import { Baby, Clock, DollarSign, Home } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import type { ResultThreshold } from '../../api/resultApi';

interface ThresholdCardProps {
  threshold: ResultThreshold;
}

const THRESHOLD_ICONS = {
  housing: Home,
  commute: Clock,
  childcare: Baby,
  cashflow: DollarSign,
} as const;

export function ThresholdCard({ threshold }: ThresholdCardProps) {
  const { c, isDark } = useTheme();
  const styleA = getRiskStyle(threshold.statusA, c);
  const styleB = getRiskStyle(threshold.statusB, c);
  const Icon = THRESHOLD_ICONS[threshold.id];
  const improved = (threshold.statusA === 'danger' && threshold.statusB !== 'danger') || (threshold.statusA === 'warning' && threshold.statusB === 'safe');

  return (
    <div className="rounded-2xl p-3.5" style={{ background: threshold.statusA === 'danger' ? c.errorBg : c.card, border: `1px solid ${threshold.statusA === 'danger' ? c.errorBorder : c.cardBorder}`, boxShadow: c.cardShadow }}>
      <div className="flex items-center justify-between mb-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: isDark ? 'rgba(15,23,42,0.4)' : '#F8FAFC' }}>
          <Icon size={13} style={{ color: styleA.color }} />
        </div>
        {improved && (
          <span className="px-1.5 py-0.5 rounded-full" style={{ background: c.successBg, color: c.success, fontSize: '0.6rem', border: `1px solid ${c.successBorder}` }}>
            개선
          </span>
        )}
      </div>
      <h4 style={{ color: c.text, fontSize: '0.82rem', fontWeight: 600, marginBottom: '2px' }}>{threshold.title}</h4>
      <p style={{ color: c.textMuted, fontSize: '0.65rem', marginBottom: '8px' }}>{threshold.description}</p>
      <div className="flex items-center gap-1.5 mb-2">
        <ScenarioValue label="A" value={threshold.valueA} style={styleA} />
        <span style={{ color: c.textMuted, fontSize: '0.6rem' }}>→</span>
        <ScenarioValue label="B" value={threshold.valueB} style={styleB} />
      </div>
      <p style={{ color: c.textMuted, fontSize: '0.6rem' }}>기준: {threshold.threshold}</p>
    </div>
  );
}

function ScenarioValue({ label, value, style }: { label: string; value: string; style: ReturnType<typeof getRiskStyle> }) {
  const { c } = useTheme();

  return (
    <div className="flex-1 p-1.5 rounded-lg text-center" style={{ background: style.bg, border: `1px solid ${style.border}` }}>
      <div style={{ color: c.textMuted, fontSize: '0.55rem' }}>{label}</div>
      <div style={{ color: style.color, fontSize: '0.82rem', fontWeight: 700 }}>{value}</div>
    </div>
  );
}

function getRiskStyle(status: ResultThreshold['statusA'], c: ReturnType<typeof useTheme>['c']) {
  if (status === 'safe') return { color: c.success, bg: c.successBg, border: c.successBorder };
  if (status === 'warning') return { color: c.warning, bg: c.warningBg, border: c.warningBorder };
  return { color: c.error, bg: c.errorBg, border: c.errorBorder };
}
