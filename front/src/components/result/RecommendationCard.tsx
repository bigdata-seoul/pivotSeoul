import { Clock, FileText, Home, MapPin } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import type { ResultRecommendation } from '../../api/resultApi';

interface RecommendationCardProps {
  recommendation: ResultRecommendation;
  isLast?: boolean;
}

const RECOMMENDATION_ICONS = {
  relocation: MapPin,
  policy: FileText,
  work: Clock,
  housing: Home,
} as const;

const PRIORITY_LABELS = {
  high: '즉시',
  medium: '권장',
} as const;

export function RecommendationCard({ recommendation, isLast = false }: RecommendationCardProps) {
  const { c } = useTheme();
  const Icon = RECOMMENDATION_ICONS[recommendation.kind];
  const priorityStyle = recommendation.priority === 'high'
    ? { color: c.error, bg: c.errorBg }
    : { color: c.warning, bg: c.warningBg };

  return (
    <div className="flex items-center px-4 md:px-5 py-3 gap-3 md:gap-4 transition-all" style={{ borderBottom: isLast ? 'none' : `1px solid ${c.border}` }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: c.primaryBg }}>
        <Icon size={13} style={{ color: c.primary }} />
      </div>
      <div className="flex-1 min-w-0">
        <div style={{ color: c.text, fontSize: '0.82rem', fontWeight: 500 }}>{recommendation.title}</div>
        <div style={{ color: c.textMuted, fontSize: '0.68rem' }}>
          {recommendation.from} → <span style={{ color: c.textSec }}>{recommendation.to}</span>
        </div>
      </div>
      <div className="text-right shrink-0 hidden sm:block">
        <div style={{ color: c.success, fontSize: '0.78rem', fontWeight: 600 }}>{recommendation.effect}</div>
        <div style={{ color: c.textMuted, fontSize: '0.65rem' }}>조건: {recommendation.tradeoff}</div>
      </div>
      <div className="px-2 py-0.5 rounded-full shrink-0" style={{ background: priorityStyle.bg, color: priorityStyle.color, fontSize: '0.65rem' }}>
        {PRIORITY_LABELS[recommendation.priority]}
      </div>
    </div>
  );
}
