import { useState } from 'react';
import { Panel, SectionH } from '../components/ui';
import { Icon } from '../components/Icons';

export default function CameraScreen({ state, control }) {
  const { lampOn, temp, hum, connection, camFrame } = state;
  const [recording, setRecording] = useState(false);
  const [resolution, setResolution] = useState('VGA');
  const [framerate, setFramerate] = useState('15');

  return (
    <div className="screen">
      <SectionH title="ESP32-CAM · Live Feed" right={<span className="label-sm">CAM-01 · 192.168.1.42</span>} />

      <div className="panel">
        <div className="panel-body" style={{ padding: 10 }}>
          <div className="cam-frame">
            {camFrame ? (
              <img
                src={camFrame}
                alt="cam"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' }}
              />
            ) : (
              <div style={{ position: 'absolute', inset: 0, background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.3)' }}>
                  NO SIGNAL
                </span>
              </div>
            )}
            <div className="cam-noise" />
            <div className="cam-overlay">
              <span className="corner tl" /><span className="corner tr" />
              <span className="corner bl" /><span className="corner br" />
              {recording && (
                <span className="rec"><span className="dot" />REC</span>
              )}
              <div className="meta-tl">
                CAM-01<br />
                {resolution} · {framerate}fps<br />
                <span style={{ color: connection === 'connected' ? '#4ade80' : '#f43f5e' }}>
                  {connection === 'connected' ? '● LIVE' : '○ OFFLINE'}
                </span>
              </div>
              <div className="meta-br">
                {temp.toFixed(1)}°C<br />
                {Math.round(hum)}%RH<br />
                {new Date().toLocaleTimeString('en-GB')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row" style={{ gap: 8 }}>
        <button className="btn grow" onClick={() => control('light', !state.lampOn)} data-variant={state.lampOn ? 'primary' : undefined}>
          {state.lampOn ? 'Lamp · ON' : 'Turn on lamp'}
        </button>
        <button className="btn-icon" onClick={() => setRecording(!recording)} aria-label="record" style={recording ? { borderColor: 'var(--warn)', color: 'var(--warn)' } : undefined}>
          {recording
            ? <span style={{ width: 12, height: 12, borderRadius: 2, background: 'var(--warn)' }} />
            : <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--warn)' }} />}
        </button>
        <button className="btn-icon" aria-label="snapshot"><Icon.Snap /></button>
        <button className="btn-icon" aria-label="fullscreen"><Icon.Maximize /></button>
      </div>

      <Panel title="Stream Settings" id="CAM·CFG">
        <div className="panel-row">
          <div className="row between">
            <span className="label">Resolution</span>
            <div className="row" style={{ gap: 4 }}>
              {['QVGA', 'VGA', 'SVGA', 'HD'].map(r => (
                <button key={r} className="btn" data-variant={r === resolution ? 'primary' : undefined}
                  style={{ padding: '5px 10px', fontSize: 10 }} onClick={() => setResolution(r)}>{r}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="panel-row">
          <div className="row between">
            <span className="label">Framerate</span>
            <div className="row" style={{ gap: 4 }}>
              {['5', '10', '15', '25'].map(f => (
                <button key={f} className="btn" data-variant={f === framerate ? 'primary' : undefined}
                  style={{ padding: '5px 10px', fontSize: 10 }} onClick={() => setFramerate(f)}>{f}fps</button>
              ))}
            </div>
          </div>
        </div>
        <div className="panel-row">
          <div className="row between">
            <span className="label">Night vision (IR)</span>
            <div className="switch" data-on={true} />
          </div>
        </div>
      </Panel>
    </div>
  );
}
