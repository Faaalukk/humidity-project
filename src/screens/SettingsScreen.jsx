import { Panel, SectionH, NumField } from '../components/ui';
import { Icon } from '../components/Icons';

export default function SettingsScreen({ state, set, sendWS }) {
  const { tempTarget, humTarget, tempThreshLo, tempThreshHi, humThreshLo, humThreshHi } = state;

  function setTemp(v) {
    set({ tempTarget: v });
    sendWS({ type: 'setting', temp_set: v, humi_set: humTarget });
  }
  function setHumi(v) {
    set({ humTarget: v });
    sendWS({ type: 'setting', temp_set: tempTarget, humi_set: v });
  }

  const presets = [
    { name: 'Chicken',  t: 37.7, h: 55, days: '1–18', note: 'Standard incubation' },
    { name: 'Quail',    t: 37.5, h: 60, days: '1–14', note: 'Smaller eggs' },
    { name: 'Duck',     t: 37.5, h: 65, days: '1–24', note: 'Higher humidity' },
    { name: 'Hatching', t: 37.2, h: 75, days: '18–21', note: 'Final 3 days' },
  ];

  function applyPreset(p) {
    set({ tempTarget: p.t, humTarget: p.h });
    sendWS({ type: 'setting', temp_set: p.t, humi_set: p.h });
  }

  return (
    <div className="screen">
      <SectionH title="Setpoints" right={<span className="label-sm">UNIT 01</span>} />

      <Panel title="Temperature" id="TGT-T">
        <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="row between">
            <span className="label">Target</span>
            <NumField value={tempTarget} onChange={setTemp} step={0.1} min={20} max={45} suffix="°C" />
          </div>
          <div className="row" style={{ gap: 10 }}>
            <div className="col grow" style={{ gap: 6 }}>
              <span className="label">Low alert</span>
              <NumField value={tempThreshLo} onChange={v => set({ tempThreshLo: v })} step={0.1} min={15} max={45} suffix="°C" />
            </div>
            <div className="col grow" style={{ gap: 6 }}>
              <span className="label">High alert</span>
              <NumField value={tempThreshHi} onChange={v => set({ tempThreshHi: v })} step={0.1} min={15} max={50} suffix="°C" />
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="Humidity" id="TGT-H">
        <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="row between">
            <span className="label">Target</span>
            <NumField value={humTarget} onChange={setHumi} step={1} min={20} max={95} suffix="%" />
          </div>
          <div className="row" style={{ gap: 10 }}>
            <div className="col grow" style={{ gap: 6 }}>
              <span className="label">Low alert</span>
              <NumField value={humThreshLo} onChange={v => set({ humThreshLo: v })} step={1} min={10} max={95} suffix="%" />
            </div>
            <div className="col grow" style={{ gap: 6 }}>
              <span className="label">High alert</span>
              <NumField value={humThreshHi} onChange={v => set({ humThreshHi: v })} step={1} min={10} max={100} suffix="%" />
            </div>
          </div>
        </div>
      </Panel>

      <SectionH title="Profile Presets" />
      <div className="panel">
        {presets.map((p) => {
          const active = Math.abs(p.t - tempTarget) < 0.05 && Math.abs(p.h - humTarget) < 0.5;
          return (
            <div key={p.name} className="list-item" onClick={() => applyPreset(p)}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: active ? 'var(--bg-4)' : 'var(--bg-3)',
                border: `1px solid ${active ? 'var(--heat)' : 'var(--line-2)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: active ? 'var(--heat)' : 'var(--fg-dim)',
              }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                  <ellipse cx="12" cy="13" rx="6" ry="8" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
              <div className="col grow" style={{ gap: 2 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</div>
                <div className="label-sm">Day {p.days} · {p.note}</div>
              </div>
              <div className="col" style={{ gap: 2, alignItems: 'flex-end' }}>
                <span className="readout" style={{ fontSize: 12, color: 'var(--heat)' }}>{p.t.toFixed(1)}°C</span>
                <span className="readout" style={{ fontSize: 12, color: 'var(--mist)' }}>{p.h}%</span>
              </div>
            </div>
          );
        })}
      </div>

      <SectionH title="System" />
      <div className="panel">
        <div className="list-item">
          <div className="col grow" style={{ gap: 2 }}>
            <div style={{ fontSize: 13 }}>Sensor sample rate</div>
            <div className="label-sm">How often sensors push data</div>
          </div>
          <span className="readout" style={{ fontSize: 12, color: 'var(--fg-dim)' }}>1.0 Hz</span>
          <Icon.Chevron className="chev" style={{ width: 14, height: 14 }} />
        </div>
        <div className="list-item">
          <div className="col grow" style={{ gap: 2 }}>
            <div style={{ fontSize: 13 }}>Temperature unit</div>
          </div>
          <span className="readout" style={{ fontSize: 12, color: 'var(--fg-dim)' }}>Celsius</span>
          <Icon.Chevron className="chev" style={{ width: 14, height: 14 }} />
        </div>
        <div className="list-item">
          <div className="col grow" style={{ gap: 2 }}>
            <div style={{ fontSize: 13 }}>Firmware</div>
          </div>
          <span className="readout" style={{ fontSize: 12, color: 'var(--fg-dim)' }}>v2.4.1</span>
          <Icon.Chevron className="chev" style={{ width: 14, height: 14 }} />
        </div>
      </div>
    </div>
  );
}
