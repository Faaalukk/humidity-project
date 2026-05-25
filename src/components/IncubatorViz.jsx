export default function IncubatorViz({ heaterOn, heaterPwr, mistOn, mistPwr, temp, hum }) {
  const heatIntensity = heaterOn ? (heaterPwr / 100) : 0;
  const mistIntensity = mistOn ? (mistPwr / 100) : 0;

  const eggs = [];
  const cols = 6, rows = 4;
  const x0 = 70, y0 = 110, dx = 42, dy = 50;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      eggs.push({
        cx: x0 + c * dx + (r % 2 ? dx / 2 : 0),
        cy: y0 + r * dy,
        rot: ((r * 7 + c * 11) % 11) - 5,
      });
    }
  }

  return (
    <svg viewBox="0 0 480 360" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cabinet-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#272c33" />
          <stop offset="1" stopColor="#1a1d22" />
        </linearGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c2026" stopOpacity="0.85" />
          <stop offset="0.5" stopColor="#181b21" stopOpacity="0.6" />
          <stop offset="1" stopColor="#1c2026" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="tray" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2f37" />
          <stop offset="1" stopColor="#1d2026" />
        </linearGradient>
        <radialGradient id="heat-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fbbf24" stopOpacity={0.6 * heatIntensity} />
          <stop offset="0.6" stopColor="#f59e0b" stopOpacity={0.25 * heatIntensity} />
          <stop offset="1" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="egg-fill" cx="0.35" cy="0.3" r="0.7">
          <stop offset="0" stopColor="#f3e8d3" />
          <stop offset="0.7" stopColor="#c9b896" />
          <stop offset="1" stopColor="#8a7a5e" />
        </radialGradient>
        <filter id="soft-blur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <pattern id="vent-lines" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="#16191e" />
          <line x1="0" y1="3" x2="6" y2="3" stroke="#2a2f37" strokeWidth="1" />
        </pattern>
      </defs>

      <ellipse cx="240" cy="340" rx="200" ry="10" fill="#000" opacity="0.5" />
      <rect x="30" y="30" width="420" height="300" rx="14" fill="url(#cabinet-body)" stroke="#383e48" strokeWidth="1" />
      <rect x="50" y="42" width="60" height="14" rx="3" fill="url(#vent-lines)" />
      <rect x="370" y="42" width="60" height="14" rx="3" fill="url(#vent-lines)" />
      <text x="240" y="54" textAnchor="middle" fill="#6b7280" fontFamily="Geist Mono, monospace" fontSize="9" letterSpacing="2">HATCH·OS  ·  UNIT 01</text>

      <circle cx="170" cy="49" r="2.5" fill="#4ade80" opacity="0.9">
        <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2.4s" repeatCount="indefinite" />
      </circle>
      <circle cx="180" cy="49" r="2.5" fill={heaterOn ? "#f59e0b" : "#434953"}>
        {heaterOn && <animate attributeName="opacity" values="1;0.4;1" dur="1.2s" repeatCount="indefinite" />}
      </circle>
      <circle cx="190" cy="49" r="2.5" fill={mistOn ? "#22d3ee" : "#434953"}>
        {mistOn && <animate attributeName="opacity" values="1;0.4;1" dur="1.4s" repeatCount="indefinite" />}
      </circle>

      <rect x="50" y="70" width="380" height="240" rx="6" fill="url(#glass)" stroke="#2a2f37" strokeWidth="1" />
      <rect x="52" y="72" width="376" height="236" rx="5" fill="none" stroke="#0a0b0d" strokeWidth="1" opacity="0.5" />

      {heaterOn && (
        <rect x="52" y="72" width="376" height="236" rx="5" fill="url(#heat-glow)" opacity={0.8} />
      )}

      <g>
        <line x1="80" y1="85" x2="400" y2="85" stroke="#3a3f48" strokeWidth="2" />
        <path
          d="M 90 85 q 6 -6 12 0 q 6 6 12 0 q 6 -6 12 0 q 6 6 12 0 q 6 -6 12 0 q 6 6 12 0 q 6 -6 12 0 q 6 6 12 0 q 6 -6 12 0 q 6 6 12 0 q 6 -6 12 0 q 6 6 12 0 q 6 -6 12 0 q 6 6 12 0 q 6 -6 12 0 q 6 6 12 0 q 6 -6 12 0 q 6 6 12 0 q 6 -6 12 0 q 6 6 12 0 q 6 -6 12 0 q 6 6 12 0 q 6 -6 12 0 q 6 6 12 0 q 6 -6 12 0"
          fill="none"
          stroke={heaterOn ? `rgb(${245 + 10 * heatIntensity}, ${158 + 50 * heatIntensity}, ${11 + 40 * heatIntensity})` : "#3a3f48"}
          strokeWidth={heaterOn ? 2.5 : 1.5}
          strokeLinecap="round"
          style={heaterOn ? { filter: `drop-shadow(0 0 ${4 + 6 * heatIntensity}px rgba(245,158,11,${0.7 * heatIntensity}))` } : undefined}
        />
        {heaterOn && (
          <path
            d="M 90 85 q 6 -6 12 0 q 6 6 12 0 q 6 -6 12 0 q 6 6 12 0 q 6 -6 12 0 q 6 6 12 0 q 6 -6 12 0 q 6 6 12 0 q 6 -6 12 0 q 6 6 12 0 q 6 -6 12 0 q 6 6 12 0 q 6 -6 12 0 q 6 6 12 0 q 6 -6 12 0 q 6 6 12 0 q 6 -6 12 0 q 6 6 12 0 q 6 -6 12 0 q 6 6 12 0 q 6 -6 12 0 q 6 6 12 0 q 6 -6 12 0 q 6 6 12 0 q 6 -6 12 0"
            fill="none" stroke="#fff" strokeWidth="0.8" opacity={0.5 * heatIntensity} strokeLinecap="round"
            filter="url(#soft-blur)"
          />
        )}
      </g>

      {[0, 1].map(tIdx => {
        const ty = 100 + tIdx * 100;
        return (
          <g key={tIdx}>
            <rect x="55" y={ty} width="370" height="90" rx="3" fill="url(#tray)" stroke="#3a3f48" strokeWidth="0.6" />
            <line x1="55" y1={ty + 89} x2="425" y2={ty + 89} stroke="#0a0b0d" strokeWidth="1" />
          </g>
        );
      })}

      {eggs.map((e, i) => (
        <g key={i} transform={`translate(${e.cx} ${e.cy}) rotate(${e.rot})`}>
          <ellipse cx="0" cy="2" rx="11" ry="14" fill="#000" opacity="0.4" />
          <ellipse cx="0" cy="0" rx="11" ry="14" fill="url(#egg-fill)" />
          <ellipse cx="-3" cy="-4" rx="3" ry="5" fill="#fff" opacity="0.18" />
          {heaterOn && (
            <ellipse cx="0" cy="0" rx="11" ry="14" fill="#f59e0b" opacity={0.15 * heatIntensity} style={{ mixBlendMode: 'screen' }} />
          )}
        </g>
      ))}

      <g>
        <rect x="55" y="290" width="22" height="14" rx="2" fill="#2a2f37" stroke="#3a3f48" strokeWidth="0.6" />
        <circle cx="62" cy="297" r="1.5" fill="#0a0b0d" />
        <circle cx="68" cy="297" r="1.5" fill="#0a0b0d" />
      </g>

      {mistOn && (
        <g opacity={0.4 + 0.4 * mistIntensity}>
          {Array.from({ length: 12 }).map((_, i) => {
            const delay = i * 0.4;
            const startX = 78 + (i % 3) * 4;
            return (
              <circle key={i} cx={startX} cy={297} r="3" fill="#67e8f9" filter="url(#soft-blur)" opacity="0">
                <animate attributeName="cx" values={`${startX};${startX + 60 + i * 8}`} dur="3.2s" begin={`${delay}s`} repeatCount="indefinite" />
                <animate attributeName="cy" values={`${297};${260 - (i % 4) * 10}`} dur="3.2s" begin={`${delay}s`} repeatCount="indefinite" />
                <animate attributeName="r" values="2;8;14" dur="3.2s" begin={`${delay}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;0.6;0" dur="3.2s" begin={`${delay}s`} repeatCount="indefinite" />
              </circle>
            );
          })}
        </g>
      )}

      <rect x="412" y="170" width="8" height="40" rx="3" fill="#3a3f48" stroke="#0a0b0d" strokeWidth="0.6" />

      <g transform="translate(390, 295)">
        <rect x="0" y="0" width="22" height="8" rx="1.5" fill="#2a2f37" stroke="#3a3f48" strokeWidth="0.5" />
        <circle cx="4" cy="4" r="1.2" fill={heaterOn ? "#f59e0b" : "#4ade80"} />
        <circle cx="9" cy="4" r="1.2" fill={mistOn ? "#22d3ee" : "#434953"} />
      </g>

      <rect x="30" y="310" width="420" height="20" rx="3" fill="#16191e" stroke="#2a2f37" strokeWidth="0.6" />
      <line x1="30" y1="313" x2="450" y2="313" stroke="#0a0b0d" strokeWidth="1" />

      <rect x="60" y="316" width="62" height="10" rx="1.5" fill="#0a0b0d" stroke="#2a2f37" strokeWidth="0.4" />
      <text x="91" y="324" textAnchor="middle" fill={heaterOn ? "#f59e0b" : "#4ade80"} fontFamily="Geist Mono, monospace" fontSize="7" letterSpacing="0.5">
        {temp.toFixed(1)}°C · {Math.round(hum)}%
      </text>

      <rect x="55" y="328" width="14" height="4" fill="#0a0b0d" />
      <rect x="411" y="328" width="14" height="4" fill="#0a0b0d" />
    </svg>
  );
}
