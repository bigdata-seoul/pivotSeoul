import { SlidersHorizontal } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const MOCK_PROMPT_ITEMS = [
  { id: 'recommendation-policy', label: '정책 추천 프롬프트', version: 'v1.3', status: '운영' },
  { id: 'result-summary', label: '결과 요약 프롬프트', version: 'v1.1', status: '검토' },
];

export function PromptManagePanel() {
  const { c } = useTheme();

  return (
    <div className="rounded-2xl p-5" style={{ background: c.card, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow }}>
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal size={14} style={{ color: c.primary }} />
        <p style={{ color: c.textSec, fontSize: '0.73rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>프롬프트/추천 관리</p>
      </div>
      <div className="space-y-2">
        {MOCK_PROMPT_ITEMS.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl px-3 py-2" style={{ background: c.badgeBg }}>
            <span style={{ color: c.text, fontSize: '0.78rem' }}>{item.label}</span>
            <span style={{ color: c.textMuted, fontSize: '0.68rem' }}>{item.version} · {item.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
