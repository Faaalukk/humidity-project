import { Panel, SectionH, Sparkline, TargetIndicator } from '../components/ui';
import { Icon } from '../components/Icons';
import IncubatorViz from '../components/IncubatorViz';

export default function DashboardScreen({ state, control, goTo }) {
  const { temp, hum, heaterOn, mistOn, motorOn, fanOn, tempHistory, humHistory, tempTarget, humTarget, connection } = state;

  const tempDelta = temp - tempTarget;
  const humDelta = hum - humTarget;
  const tempStatus = temp === 0 ? 'idle' : Math.abs(tempDelta) < 0.5 ? 'ok' : Math.abs(tempDelta) < 1.5 ? 'drift' : 'off';
  const humStatus = hum === 0 ? 'idle' : Math.abs(humDelta) < 3 ? 'ok' : Math.abs(humDelta) < 8 ? 'drift' : 'off';

  return (
    <div className="screen">
      {/* Hero readouts */}
      <div className="hero">
        <div className="hero-grid">
          <div className="hero-cell">
            <div className="row between">
              <span className="label">Temperature</span>
              {tempStatus === 'idle'
                ? <span className="pill">—</span>
                : <span className={`pill ${tempStatus === 'ok' ? 'ok' : tempStatus === 'drift' ? 'heat' : 'warn'}`}>
                    {tempStatus === 'ok' ? 'Nominal' : tempStatus === 'drift' ? 'Drift' : 'Off-target'}
                  </span>
              }
            </div>
            <div className="readout-xl">
              {temp === 0 ? '—' : temp.toFixed(1)}<span className="unit">°C</span>
            </div>
            <TargetIndicator value={temp} target={tempTarget} min={30} max={42} channel="heat" />
            <div className="row between" style={{ marginTop: 2 }}>
              <span className="label-sm">Target {tempTarget.toFixed(1)}°C</span>
              {temp > 0 && (
                <span className="label-sm" style={{ color: tempDelta >= 0 ? 'var(--heat)' : 'var(--mist)' }}>
                  {tempDelta >= 0 ? '+' : ''}{tempDelta.toFixed(1)}°
                </span>
              )}
            </div>
          </div>
          <div className="hero-cell">
            <div className="row between">
              <span className="label">Humidity</span>
              {humStatus === 'idle'
                ? <span className="pill">—</span>
                : <span className={`pill ${humStatus === 'ok' ? 'ok' : humStatus === 'drift' ? 'mist' : 'warn'}`}>
                    {humStatus === 'ok' ? 'Nominal' : humStatus === 'drift' ? 'Drift' : 'Off-target'}
                  </span>
              }
            </div>
            <div className="readout-xl">
              {hum === 0 ? '—' : Math.round(hum)}<span className="unit">%</span>
            </div>
            <TargetIndicator value={hum} target={humTarget} min={30} max={90} channel="mist" />
            <div className="row between" style={{ marginTop: 2 }}>
              <span className="label-sm">Target {Math.round(humTarget)}%</span>
              {hum > 0 && (
                <span className="label-sm" style={{ color: humDelta >= 0 ? 'var(--mist)' : 'var(--heat)' }}>
                  {humDelta >= 0 ? '+' : ''}{humDelta.toFixed(0)}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chamber viz */}
      <Panel title="Chamber View" id="VIS-01" right={
        <span className="row" style={{ gap: 6 }}>
          <span className={`led ${connection === 'connected' ? 'ok' : 'warn'}`} />
          <span style={{ fontSize: 10, color: 'var(--fg-mute)' }}>LIVE</span>
        </span>
      }>
        <div className="panel-body" style={{ padding: 10 }}>
          <div className="viz-wrap">
            <IncubatorViz
              heaterOn={heaterOn} heaterPwr={heaterOn ? 80 : 0}
              mistOn={mistOn} mistPwr={mistOn ? 80 : 0}
              temp={temp} hum={hum}
            />
          </div>
        </div>
      </Panel>

      {/* Quick control tiles — 4 devices */}
      <SectionH title="Quick Control" right={
        <button className="btn" data-variant="ghost" style={{ padding: '4px 8px', fontSize: 9 }} onClick={() => goTo('controls')}>
          Full panel <Icon.Chevron style={{ width: 10, height: 10 }} />
        </button>
      } />
      <div className="quick-tiles">
        <div className="tile" data-on={heaterOn} data-ch="heat" onClick={() => control('heater', !heaterOn)}>
          <div className="row between">
            <span className="row" style={{ gap: 8 }}>
              <Icon.Heat style={{ width: 16, height: 16, color: heaterOn ? 'var(--heat)' : 'var(--fg-mute)' }} />
              <span className="tile-name">Heater</span>
            </span>
            <div className="switch" data-on={heaterOn} data-channel="heat" onClick={(e) => { e.stopPropagation(); control('heater', !heaterOn); }} />
          </div>
          <div className="tile-val">{heaterOn ? 'ON' : 'OFF'}</div>
          <div className="tile-state" data-on={heaterOn} data-ch="heat">
            {heaterOn ? `${temp.toFixed(1)}°C · heating` : 'Idle'}
          </div>
        </div>

        <div className="tile" data-on={mistOn} data-ch="mist" onClick={() => control('fog', !mistOn)}>
          <div className="row between">
            <span className="row" style={{ gap: 8 }}>
              <Icon.Mist style={{ width: 16, height: 16, color: mistOn ? 'var(--mist)' : 'var(--fg-mute)' }} />
              <span className="tile-name">Humidifier</span>
            </span>
            <div className="switch" data-on={mistOn} data-channel="mist" onClick={(e) => { e.stopPropagation(); control('fog', !mistOn); }} />
          </div>
          <div className="tile-val">{mistOn ? 'ON' : 'OFF'}</div>
          <div className="tile-state" data-on={mistOn} data-ch="mist">
            {mistOn ? `${Math.round(hum)}% · misting` : 'Idle'}
          </div>
        </div>

        <div className="tile" data-on={fanOn} data-ch="heat" onClick={() => control('fan', !fanOn)}
          style={fanOn ? { background: 'linear-gradient(180deg,rgba(147,197,253,0.10),var(--bg-2) 60%)', borderColor: 'rgba(147,197,253,0.4)' } : {}}>
          <div className="row between">
            <span className="row" style={{ gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: fanOn ? 'var(--link)' : 'var(--fg-mute)' }}>
                <circle cx="12" cy="12" r="2" fill="currentColor" />
                <path d="M12 4c2 0 4 1 4 3s-2 3-4 3-2-1-2-2 1-4 2-4zM20 12c0 2-1 4-3 4s-3-2-3-4 1-2 2-2 4 1 4 2zM12 20c-2 0-4-1-4-3s2-3 4-3 2 1 2 2-1 4-2 4zM4 12c0-2 1-4 3-4s3 2 3 4-1 2-2 2-4-1-4-2z" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              <span className="tile-name">Fan</span>
            </span>
            <div className="switch" data-on={fanOn} onClick={(e) => { e.stopPropagation(); control('fan', !fanOn); }} />
          </div>
          <div className="tile-val">{fanOn ? 'ON' : 'OFF'}</div>
          <div className="tile-state" style={{ color: fanOn ? 'var(--link)' : undefined }}>
            {fanOn ? 'Circulating' : 'Idle'}
          </div>
        </div>

        <div className="tile" data-on={motorOn} data-ch="heat" onClick={() => control('motor', !motorOn)}
          style={motorOn ? { background: 'linear-gradient(180deg,rgba(74,222,128,0.10),var(--bg-2) 60%)', borderColor: 'rgba(74,222,128,0.4)' } : {}}>
          <div className="row between">
            <span className="row" style={{ gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: motorOn ? 'var(--ok)' : 'var(--fg-mute)' }}>
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="tile-name">Turner</span>
            </span>
            <div className="switch" data-on={motorOn} onClick={(e) => { e.stopPropagation(); control('motor', !motorOn); }} />
          </div>
          <div className="tile-val">{motorOn ? 'ON' : 'OFF'}</div>
          <div className="tile-state" style={{ color: motorOn ? 'var(--ok)' : undefined }}>
            {motorOn ? 'Turning eggs' : 'Stopped'}
          </div>
        </div>
      </div>

      {/* Trends */}
      <SectionH title="Live Trend · 60s" />
      <div className="panel">
        <div className="panel-row" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="row between">
            <span className="label-sm" style={{ color: 'var(--heat)' }}>● Temperature</span>
            <span className="readout" style={{ fontSize: 11, color: 'var(--fg-dim)' }}>
              {Math.min(...tempHistory) > 0
                ? `min ${Math.min(...tempHistory).toFixed(1)}° · max ${Math.max(...tempHistory).toFixed(1)}°`
                : '—'}
            </span>
          </div>
          <Sparkline data={tempHistory} color="#f59e0b" />
        </div>
        <div className="panel-row" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="row between">
            <span className="label-sm" style={{ color: 'var(--mist)' }}>● Humidity</span>
            <span className="readout" style={{ fontSize: 11, color: 'var(--fg-dim)' }}>
              {Math.min(...humHistory) > 0
                ? `min ${Math.round(Math.min(...humHistory))}% · max ${Math.round(Math.max(...humHistory))}%`
                : '—'}
            </span>
          </div>
          <Sparkline data={humHistory} color="#22d3ee" />
        </div>
      </div>
    </div>
  );
}
