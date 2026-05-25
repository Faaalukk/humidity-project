import { useMemo } from 'react';

export function Panel({ title, id, right, children, className }) {
  return (
    <div className={`panel ${className || ''}`}>
      {(title || right) && (
        <div className="panel-head">
          <div className="row" style={{ gap: 10 }}>
            <span>{title}</span>
            {id && <span className="h-id">{id}</span>}
          </div>
          {right}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}

export function SectionH({ title, right }) {
  return (
    <div className="section-h">
      <span className="title">{title}</span>
      {right}
    </div>
  );
}

export function Sparkline({ data, color = '#f59e0b', height = 38 }) {
  const w = 200, h = height;
  const path = useMemo(() => {
    if (!data || data.length < 2) return '';
    const min = Math.min(...data) - 0.5;
    const max = Math.max(...data) + 0.5;
    const range = Math.max(0.1, max - min);
    const pts = data.map((v, i) => [
      (i / (data.length - 1)) * w,
      h - ((v - min) / range) * (h - 6) - 3,
    ]);
    return pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ');
  }, [data, h]);
  const fillPath = useMemo(() => {
    if (!path) return '';
    return `${path} L${w},${h} L0,${h} Z`;
  }, [path, h]);
  const gradId = `spark-grad-${color.replace('#', '')}`;
  return (
    <div className="strip">
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={color} stopOpacity="0.35" />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="0" y1={h * 0.5} x2={w} y2={h * 0.5} stroke="#2a2f37" strokeDasharray="2 3" strokeWidth="0.5" />
        <path d={fillPath} fill={`url(#${gradId})`} />
        <path d={path} stroke={color} strokeWidth="1.2" fill="none" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function SegBar({ value, channel = 'heat', count = 20 }) {
  const lit = Math.round((value / 100) * count);
  return (
    <div className="seg-bar">
      {Array.from({ length: count }).map((_, i) => (
        <i key={i} className={i < lit ? `on-${channel}` : (i < lit + 2 ? 'on-soft' : '')} />
      ))}
    </div>
  );
}

export function TargetIndicator({ value, target, min, max, channel = 'heat' }) {
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  const tpct = Math.max(0, Math.min(100, ((target - min) / (max - min)) * 100));
  return (
    <div className="target-ind">
      <div className={`fill ${channel}`} style={{ width: `${pct}%` }} />
      <div className="target-mark" style={{ left: `calc(${tpct}% - 1px)` }} />
    </div>
  );
}

export function NumField({ value, onChange, step = 0.1, min = 0, max = 100, suffix = '' }) {
  const dec = () => onChange(Math.max(min, +(value - step).toFixed(1)));
  const inc = () => onChange(Math.min(max, +(value + step).toFixed(1)));
  return (
    <div className="num-field">
      <button onClick={dec} aria-label="decrease">−</button>
      <div className="v">{Number.isInteger(step) ? Math.round(value) : value.toFixed(1)}{suffix}</div>
      <button onClick={inc} aria-label="increase">+</button>
    </div>
  );
}
