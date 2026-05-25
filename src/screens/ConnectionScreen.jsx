import { Panel, SectionH } from '../components/ui';
import { Icon } from '../components/Icons';

function formatUptime(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

export default function ConnectionScreen({ state }) {
  const { connection, wsUrl, deviceId, signal, latencyMs, uptime, packetsRx } = state;

  return (
    <div className="screen">
      <SectionH title="Device Link" right={<span className="label-sm">WS / I²C</span>} />

      <div className="net-card" style={{
        background: connection === 'connected'
          ? 'radial-gradient(ellipse at 50% 0%, rgba(74,222,128,0.10), transparent 60%), var(--bg-2)'
          : connection === 'connecting'
          ? 'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.10), transparent 60%), var(--bg-2)'
          : 'radial-gradient(ellipse at 50% 0%, rgba(244,63,94,0.10), transparent 60%), var(--bg-2)',
      }}>
        <div className="row between">
          <div className="row" style={{ gap: 12 }}>
            {connection === 'connected' && (
              <span className="ping"><i /><i /></span>
            )}
            {connection !== 'connected' && (
              <span className={`led ${connection === 'connecting' ? 'warn' : 'idle'}`} style={{ width: 10, height: 10 }} />
            )}
            <div className="col" style={{ gap: 2 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>
                {connection === 'connected' && 'Connected'}
                {connection === 'connecting' && (<>Connecting<span className="dots"><i /><i /><i /></span></>)}
                {connection === 'disconnected' && 'Disconnected'}
              </div>
              <div className="label-sm">{deviceId}</div>
            </div>
          </div>
          <span className={`pill ${connection === 'connected' ? 'ok' : connection === 'connecting' ? 'heat' : 'warn'}`}>
            {connection === 'connected' ? 'WS OPEN' : connection === 'connecting' ? 'OPENING' : 'CLOSED'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, marginTop: 6, borderTop: '1px solid var(--line)', paddingTop: 10 }}>
          <div className="col" style={{ gap: 2, paddingRight: 14, borderRight: '1px solid var(--line)' }}>
            <span className="label-sm">Latency</span>
            <span className="readout" style={{ fontSize: 16 }}>{connection === 'connected' ? `${latencyMs}` : '—'}<span className="unit">ms</span></span>
          </div>
          <div className="col" style={{ gap: 2, paddingLeft: 14 }}>
            <span className="label-sm">Signal</span>
            <span className="readout" style={{ fontSize: 16 }}>{connection === 'connected' ? `−${signal}` : '—'}<span className="unit">dBm</span></span>
          </div>
        </div>

        <div className="row" style={{ gap: 8, marginTop: 6 }}>
          {connection !== 'connected' && (
            <div className="btn grow" style={{ justifyContent: 'center', opacity: 0.6 }}>
              <Icon.Refresh style={{ width: 14, height: 14 }} />
              {connection === 'connecting' ? 'Connecting…' : 'Auto-reconnecting in 3s…'}
            </div>
          )}
          {connection === 'connected' && (
            <div className="pill ok" style={{ padding: '8px 14px', fontSize: 10 }}>
              <span className="led ok" style={{ marginRight: 0 }} />
              WebSocket open · auto-managed
            </div>
          )}
        </div>
      </div>

      <Panel title="WebSocket Endpoint" id="WS-CFG">
        <div className="panel-row">
          <div className="col" style={{ gap: 4 }}>
            <span className="label">URL</span>
            <div className="row between">
              <span className="readout" style={{ fontSize: 12 }}>{wsUrl}</span>
              <button className="btn-icon" aria-label="edit">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                  <path d="M4 20h4l11-11-4-4L4 16v4z" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="panel-row">
          <div className="row between">
            <span className="label">Auto-reconnect</span>
            <div className="switch" data-on={true} />
          </div>
        </div>
        <div className="panel-row">
          <div className="row between">
            <span className="label">Heartbeat</span>
            <span className="readout" style={{ fontSize: 12 }}>5s</span>
          </div>
        </div>
      </Panel>

      <Panel title="Session" id="STATS">
        <div className="panel-row">
          <div className="row between">
            <span className="label">Uptime</span>
            <span className="readout" style={{ fontSize: 12 }}>{formatUptime(uptime + 14283)}</span>
          </div>
        </div>
        <div className="panel-row">
          <div className="row between">
            <span className="label">Packets RX</span>
            <span className="readout" style={{ fontSize: 12 }}>{packetsRx.toLocaleString()}</span>
          </div>
        </div>
        <div className="panel-row">
          <div className="row between">
            <span className="label">Last frame</span>
            <span className="readout" style={{ fontSize: 12, color: connection === 'connected' ? 'var(--ok)' : 'var(--fg-mute)' }}>
              {connection === 'connected' ? `${Math.floor(latencyMs / 100)}ms ago` : '—'}
            </span>
          </div>
        </div>
      </Panel>

      <SectionH title="Nearby Devices" right={
        <span className="row" style={{ gap: 6, color: 'var(--fg-mute)', fontFamily: 'var(--font-mono)', fontSize: 10 }}>
          Scanning<span className="dots"><i /><i /><i /></span>
        </span>
      } />
      <div className="panel">
        {[
          { id: 'HATCH-01', mac: 'A4:CF:12:3F:91:0B', rssi: signal, active: true },
          { id: 'HATCH-02', mac: 'A4:CF:12:3F:88:DA', rssi: 67, active: false },
          { id: 'ESP-CAM-01', mac: '7C:9E:BD:42:01:7F', rssi: 54, active: false },
        ].map(d => (
          <div key={d.id} className="list-item">
            <div style={{ width: 30, height: 30, borderRadius: 6, background: 'var(--bg-3)', border: '1px solid var(--line-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: d.active ? 'var(--ok)' : 'var(--fg-mute)' }}>
              <Icon.Wifi style={{ width: 14, height: 14 }} />
            </div>
            <div className="col grow" style={{ gap: 2 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>
                {d.id} {d.active && <span style={{ color: 'var(--ok)', fontSize: 10, marginLeft: 6 }}>● linked</span>}
              </div>
              <div className="label-sm">{d.mac}</div>
            </div>
            <span className="readout label-sm">−{d.rssi}dBm</span>
            <Icon.Chevron className="chev" style={{ width: 14, height: 14 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
