import { Panel, SectionH } from '../components/ui';
import { Icon } from '../components/Icons';

function DeviceRow({ label, sub, on, device, control, icon }) {
  return (
    <div className="row between">
      <div className="row" style={{ gap: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10,
          background: on
            ? (device === 'fog'
                ? 'linear-gradient(135deg,rgba(34,211,238,0.18),rgba(34,211,238,0.04))'
                : 'linear-gradient(135deg,rgba(245,158,11,0.18),rgba(245,158,11,0.04))')
            : 'var(--bg-3)',
          border: '1px solid ' + (on
            ? (device === 'fog' ? 'rgba(34,211,238,0.5)' : 'rgba(245,158,11,0.5)')
            : 'var(--line-2)'),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: on
            ? (device === 'fog' ? 'var(--mist)' : 'var(--heat)')
            : 'var(--fg-mute)',
        }}>
          {icon}
        </div>
        <div className="col" style={{ gap: 2 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{label}</div>
          <div className="label-sm">{sub}</div>
        </div>
      </div>
      <div
        className="switch"
        data-on={on}
        data-channel={device === 'fog' ? 'mist' : undefined}
        onClick={() => control(device, !on)}
      />
    </div>
  );
}

export default function ControlsScreen({ state, control }) {
  const { heaterOn, mistOn, fanOn, lampOn, motorOn } = state;

  return (
    <div className="screen">
      <SectionH title="Actuator Control" right={<span className="label-sm">UNIT 01 · I/O</span>} />

      <Panel title="Heater" id="H-01">
        <div className="panel-body">
          <DeviceRow
            label="Ceramic Heater"
            sub="Pin D5 · 12V · 80W"
            on={heaterOn}
            device="heater"
            control={control}
            icon={<Icon.Heat style={{ width: 22, height: 22 }} />}
          />
          <div className="row" style={{ marginTop: 12, gap: 8 }}>
            <div style={{
              flex: 1, padding: '8px 12px', borderRadius: 8,
              background: 'var(--bg-3)', border: '1px solid var(--line)',
              textAlign: 'center',
            }}>
              <div className="label-sm">Status</div>
              <div className="readout" style={{ fontSize: 16, marginTop: 4, color: heaterOn ? 'var(--heat)' : 'var(--fg-mute)' }}>
                {heaterOn ? 'ACTIVE' : 'IDLE'}
              </div>
            </div>
            <div style={{
              flex: 1, padding: '8px 12px', borderRadius: 8,
              background: 'var(--bg-3)', border: '1px solid var(--line)',
              textAlign: 'center',
            }}>
              <div className="label-sm">Temp now</div>
              <div className="readout" style={{ fontSize: 16, marginTop: 4, color: 'var(--heat)' }}>
                {state.temp.toFixed(1)}°C
              </div>
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="Humidifier" id="H-02">
        <div className="panel-body">
          <DeviceRow
            label="Ultrasonic Atomizer"
            sub="Pin D6 · 24V · 25W"
            on={mistOn}
            device="fog"
            control={control}
            icon={<Icon.Mist style={{ width: 22, height: 22 }} />}
          />
          <div className="row" style={{ marginTop: 12, gap: 8 }}>
            <div style={{
              flex: 1, padding: '8px 12px', borderRadius: 8,
              background: 'var(--bg-3)', border: '1px solid var(--line)',
              textAlign: 'center',
            }}>
              <div className="label-sm">Status</div>
              <div className="readout" style={{ fontSize: 16, marginTop: 4, color: mistOn ? 'var(--mist)' : 'var(--fg-mute)' }}>
                {mistOn ? 'ACTIVE' : 'IDLE'}
              </div>
            </div>
            <div style={{
              flex: 1, padding: '8px 12px', borderRadius: 8,
              background: 'var(--bg-3)', border: '1px solid var(--line)',
              textAlign: 'center',
            }}>
              <div className="label-sm">Humi now</div>
              <div className="readout" style={{ fontSize: 16, marginTop: 4, color: 'var(--mist)' }}>
                {Math.round(state.hum)}%
              </div>
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="Aux Devices" id="AUX">
        <div className="panel-row">
          <div className="row between">
            <div className="row" style={{ gap: 12 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--bg-3)', border: '1px solid var(--line-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: fanOn ? 'var(--fg)' : 'var(--fg-mute)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                  <path d="M12 4c2 0 4 1 4 3s-2 3-4 3-2-1-2-2 1-4 2-4zM20 12c0 2-1 4-3 4s-3-2-3-4 1-2 2-2 4 1 4 2zM12 20c-2 0-4-1-4-3s2-3 4-3 2 1 2 2-1 4-2 4zM4 12c0-2 1-4 3-4s3 2 3 4-1 2-2 2-4-1-4-2z" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </div>
              <div className="col" style={{ gap: 2 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>Circulation Fan</div>
                <div className="label-sm">Pin D3 · {fanOn ? 'ON' : 'OFF'}</div>
              </div>
            </div>
            <div className="switch" data-on={fanOn} onClick={() => control('fan', !fanOn)} />
          </div>
        </div>
        <div className="panel-row">
          <div className="row between">
            <div className="row" style={{ gap: 12 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--bg-3)', border: '1px solid var(--line-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: motorOn ? 'var(--fg)' : 'var(--fg-mute)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M19.07 4.93l-2.83 2.83M7.76 16.24l-2.83 2.83" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="col" style={{ gap: 2 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>Egg Turner Motor</div>
                <div className="label-sm">Pin D7 · {motorOn ? 'TURNING' : 'STOPPED'}</div>
              </div>
            </div>
            <div className="switch" data-on={motorOn} onClick={() => control('motor', !motorOn)} />
          </div>
        </div>
        <div className="panel-row">
          <div className="row between">
            <div className="row" style={{ gap: 12 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--bg-3)', border: '1px solid var(--line-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: lampOn ? 'var(--fg)' : 'var(--fg-mute)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18h6M10 21h4M12 3a6 6 0 0 1 4 10c-1 1-1 2-1 3H9c0-1 0-2-1-3a6 6 0 0 1 4-10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="col" style={{ gap: 2 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>Interior Lamp</div>
                <div className="label-sm">Pin D4 · For viewing only</div>
              </div>
            </div>
            <div className="switch" data-on={lampOn} onClick={() => control('light', !lampOn)} />
          </div>
        </div>
      </Panel>

      <button
        className="btn"
        data-variant="danger"
        style={{ width: '100%', padding: 14, gap: 10 }}
        onClick={() => {
          control('heater', false);
          control('fog', false);
          control('fan', false);
          control('motor', false);
          control('light', false);
        }}
      >
        <Icon.Power style={{ width: 18, height: 18 }} />
        Emergency stop · all outputs OFF
      </button>
    </div>
  );
}
