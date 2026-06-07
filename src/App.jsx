import { useState, useEffect, useRef, useCallback } from 'react';
import { Icon } from './components/Icons';
import DashboardScreen from './screens/DashboardScreen';
import ControlsScreen from './screens/ControlsScreen';
import CameraScreen from './screens/CameraScreen';
import SettingsScreen from './screens/SettingsScreen';
import ConnectionScreen from './screens/ConnectionScreen';

function formatUptime(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

export default function App() {
  const [active, setActive] = useState('dashboard');
  const wsRef = useRef(null);
  const lockedFieldsRef = useRef(new Set());

  const camUrlRef = useRef(null);

  const [state, setState] = useState({
    temp: 0,
    hum: 0,
    tempHistory: Array(60).fill(0),
    humHistory: Array(60).fill(0),

    tempTarget: 37.5,
    humTarget: 55,
    tempThreshLo: 36.5,
    tempThreshHi: 38.5,
    humThreshLo: 45,
    humThreshHi: 70,

    heaterOn: false,
    mistOn: false,
    fanOn: false,
    lampOn: false,
    motorOn: false,

    connection: 'disconnected',
    wsUrl: '',
    deviceId: 'HATCH-01',
    signal: 0,
    latencyMs: 0,
    uptime: 0,
    packetsRx: 0,
    camFrame: null,
    camConnected: false,
  });

  const set = useCallback((patch) => {
    setState(prev => ({ ...prev, ...patch }));
  }, []);

  // Control WebSocket  →  /ws  (JSON only)
  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL
      ?? `${window.location.origin.replace(/^http/, 'ws')}/ws`;

    set({ wsUrl });

    let ws;
    let reconnectTimer;
    let pingTimer;
    let t0;

    function connect() {
      set({ connection: 'connecting' });
      ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        set({ connection: 'connected' });
        ws.send(JSON.stringify({ type: 'identify', client: 'web' }));
        pingTimer = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            t0 = Date.now();
            ws.send(JSON.stringify({ type: 'ping' }));
          }
        }, 2000);
      };

      ws.onclose = () => {
        clearInterval(pingTimer);
        set({ connection: 'disconnected' });
        reconnectTimer = setTimeout(connect, 3000);
      };

      ws.onerror = () => {};

      ws.onmessage = (e) => {
        let msg;
        try { msg = JSON.parse(e.data); } catch { return; }

        if (msg.type === 'pong') {
          set({ latencyMs: Date.now() - t0 });
          return;
        }

        if (msg.type === 'identify' && msg.client === 'camera') {
          set({ camConnected: true });
          return;
        }

        if (msg.type === 'full_status') {
          const locked = lockedFieldsRef.current;
          setState(prev => ({
            ...prev,
            temp: msg.temp,
            hum: msg.humi,
            heaterOn: locked.has('heaterOn') ? prev.heaterOn : msg.heater,
            mistOn:   locked.has('mistOn')   ? prev.mistOn   : msg.fog,
            lampOn:   locked.has('lampOn')   ? prev.lampOn   : msg.light,
            motorOn:  locked.has('motorOn')  ? prev.motorOn  : msg.motor,
            fanOn:    locked.has('fanOn')    ? prev.fanOn    : msg.fan,
            tempTarget: msg.temp_set,
            humTarget: msg.humi_set,
            tempHistory: [...prev.tempHistory.slice(1), msg.temp],
            humHistory: [...prev.humHistory.slice(1), msg.humi],
            packetsRx: prev.packetsRx + 1,
          }));
        }
      };
    }

    connect();
    return () => {
      clearInterval(pingTimer);
      clearTimeout(reconnectTimer);
      ws?.close();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Camera WebSocket  →  /ws/camera  (binary frames only)
  useEffect(() => {
    const base = import.meta.env.VITE_WS_URL
      ?? `${window.location.origin.replace(/^http/, 'ws')}/ws`;
    const camUrl = base.replace(/\/ws$/, '/ws/camera');

    let ws;
    let reconnectTimer;

    function connect() {
      ws = new WebSocket(camUrl);
      ws.binaryType = 'blob';

      ws.onmessage = (e) => {
        if (!(e.data instanceof Blob)) return;
        const url = URL.createObjectURL(e.data);
        if (camUrlRef.current) URL.revokeObjectURL(camUrlRef.current);
        camUrlRef.current = url;
        set({ camFrame: url });
      };

      ws.onclose = () => {
        reconnectTimer = setTimeout(connect, 3000);
      };

      ws.onerror = () => {};
    }

    connect();
    return () => {
      clearTimeout(reconnectTimer);
      ws?.close();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // send to ESP via server bridge
  const sendWS = useCallback((msg) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    }
  }, []);

  // toggle a device: optimistic local update + send WS
  const control = useCallback((device, value) => {
    const fieldMap = {
      heater: 'heaterOn',
      fog:    'mistOn',
      light:  'lampOn',
      motor:  'motorOn',
      fan:    'fanOn',
    };
    const field = fieldMap[device];
    if (field) {
      set({ [field]: value });
      lockedFieldsRef.current.add(field);
      setTimeout(() => lockedFieldsRef.current.delete(field), 2500);
    }
    sendWS({ type: 'control', device, state: value });
  }, [set, sendWS]);

  const tabs = [
    { id: 'dashboard',  label: 'OVERVIEW', icon: Icon.Dashboard },
    { id: 'controls',   label: 'CONTROL',  icon: Icon.Controls },
    { id: 'camera',     label: 'CAMERA',   icon: Icon.Camera },
    { id: 'settings',   label: 'SETUP',    icon: Icon.Settings },
    { id: 'connection', label: 'LINK',     icon: Icon.Network },
  ];

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const tempOOB = state.temp > 0 && (state.temp < state.tempThreshLo || state.temp > state.tempThreshHi);
  const humOOB = state.hum > 0 && (state.hum < state.humThreshLo || state.hum > state.humThreshHi);
  const anyAlert = state.connection !== 'connected' || tempOOB || humOOB;

  const screenProps = { state, set, sendWS, control };

  return (
    <div className="app-host">
      <div className="chassis-rail left">HATCH·OS / FW 2.4.1 / IO-MK3</div>
      <div className="chassis-rail right">UNIT 01 / RS-485 / I²C / 2026</div>

      <div className="app">
        <div className="statusbar">
          <div className="left">
            <span>
              <span className={`led ${state.connection === 'connected' ? 'ok' : state.connection === 'connecting' ? 'warn' : 'idle'}`} />
              {state.connection === 'connected' ? 'WS·LINKED' : state.connection === 'connecting' ? 'WS·HANDSHAKE' : 'WS·DOWN'}
            </span>
            <span style={{ color: 'var(--fg-faint)' }}>·</span>
            <span>{state.connection === 'connected' ? `${state.latencyMs}ms` : '—'}</span>
          </div>
          <div className="right">
            <span>{formatUptime(state.uptime)}</span>
            <span style={{ color: 'var(--fg-faint)' }}>·</span>
            <span>{timeStr}</span>
          </div>
        </div>

        <div className="topbar">
          <div className="brand">
            <div className="brand-mark" />
            <div>
              <div className="brand-name">HATCH·OS</div>
              <div className="brand-sub">Unit 01 · Incubator</div>
            </div>
          </div>
          <div className="right">
            {anyAlert ? (
              <span className="pill warn">
                <span className="led warn" style={{ marginRight: 0 }} />
                {state.connection !== 'connected' ? 'LINK LOST' : 'ALERT'}
              </span>
            ) : (
              <span className="pill ok">
                <span className="led ok" style={{ marginRight: 0 }} />
                NOMINAL
              </span>
            )}
          </div>
        </div>

        <div className="main" key={active}>
          {active === 'dashboard'  && <DashboardScreen  {...screenProps} goTo={setActive} />}
          {active === 'controls'   && <ControlsScreen   {...screenProps} />}
          {active === 'camera'     && <CameraScreen     {...screenProps} />}
          {active === 'settings'   && <SettingsScreen   {...screenProps} />}
          {active === 'connection' && <ConnectionScreen {...screenProps} />}
        </div>

        <div className="tabbar">
          {tabs.map(t => {
            const isAlert =
              (t.id === 'connection' && state.connection !== 'connected') ||
              (t.id === 'dashboard' && (tempOOB || humOOB));
            return (
              <button
                key={t.id}
                className="tab"
                data-active={t.id === active}
                data-alert={isAlert}
                onClick={() => setActive(t.id)}
              >
                <span className="tab-icon"><t.icon /></span>
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
