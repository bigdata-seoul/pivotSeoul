interface GaugeChartProps {
  score: number; // 0–100
  size?: number;
}

function getColor(score: number) {
  if (score < 35) return '#10B981';
  if (score < 65) return '#F59E0B';
  return '#EF4444';
}

function getStatusLabel(score: number) {
  if (score < 35) return '안전';
  if (score < 65) return '경계';
  return '위험';
}

export function GaugeChart({ score, size = 160 }: GaugeChartProps) {
  const cx = size / 2;
  const cy = size * 0.56;
  const r = size * 0.36;
  const sw = size * 0.075;

  // Active fill arc
  const fillAngle = (score / 100) * Math.PI;
  const fillRad = Math.PI - fillAngle;
  const fillEnd = {
    x: cx + r * Math.cos(fillRad),
    y: cy - r * Math.sin(fillRad),
  };

  const color = getColor(score);
  const statusLabel = getStatusLabel(score);

  // Needle
  const needleAngle = Math.PI - (score / 100) * Math.PI;
  const needleLength = r * 0.82;
  const needleTip = {
    x: cx + needleLength * Math.cos(needleAngle),
    y: cy - needleLength * Math.sin(needleAngle),
  };

  const h = cy + sw / 2 + 10;

  return (
    <svg width={size} height={h} viewBox={`0 0 ${size} ${h}`} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`gaugeGrad-${size}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#EF4444" />
        </linearGradient>
      </defs>

      {/* BG track */}
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke="rgba(100,116,139,0.2)"
        strokeWidth={sw}
        strokeLinecap="round"
      />
      {/* Gradient ghost track */}
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke={`url(#gaugeGrad-${size})`}
        strokeWidth={sw}
        strokeLinecap="round"
        opacity={0.18}
      />
      {/* Active fill */}
      {score > 0 && (
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 ${fillAngle > Math.PI / 2 ? 1 : 0} 1 ${fillEnd.x} ${fillEnd.y}`}
          fill="none"
          stroke={color}
          strokeWidth={sw}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 ${size * 0.025}px ${color}88)` }}
        />
      )}

      {/* Tick marks at 0, 25, 50, 75, 100 */}
      {[0, 25, 50, 75, 100].map(tick => {
        const ta = Math.PI - (tick / 100) * Math.PI;
        const inner = r - sw / 2 - 3;
        const outer = r + sw / 2 + 3;
        return (
          <line key={tick}
            x1={cx + inner * Math.cos(ta)} y1={cy - inner * Math.sin(ta)}
            x2={cx + outer * Math.cos(ta)} y2={cy - outer * Math.sin(ta)}
            stroke="rgba(100,116,139,0.4)" strokeWidth={1.5} />
        );
      })}

      {/* Needle */}
      <line x1={cx} y1={cy} x2={needleTip.x} y2={needleTip.y}
        stroke={color} strokeWidth={2} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={sw * 0.55} fill={color} />
      <circle cx={cx} cy={cy} r={sw * 0.3} fill="rgba(15,23,42,0.9)" />

      {/* Score text */}
      <text x={cx} y={cy - r * 0.28} textAnchor="middle"
        fill={color} fontSize={size * 0.145} fontWeight="700" fontFamily="system-ui">
        {score}
      </text>
      <text x={cx} y={cy - r * 0.05} textAnchor="middle"
        fill="rgba(148,163,184,0.9)" fontSize={size * 0.07} fontFamily="system-ui">
        {statusLabel}
      </text>

      {/* Min / Max labels */}
      <text x={cx - r - 2} y={cy + 14} textAnchor="end"
        fill="rgba(100,116,139,0.7)" fontSize={size * 0.063} fontFamily="system-ui">안전</text>
      <text x={cx + r + 2} y={cy + 14} textAnchor="start"
        fill="rgba(100,116,139,0.7)" fontSize={size * 0.063} fontFamily="system-ui">위험</text>
    </svg>
  );
}
