import { BrainCircuit } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import type { AiServiceStatus } from '../../api/adminApi';

interface AiStatusCardProps {
  statuses: AiServiceStatus[];
}

export function AiStatusCard({ statuses }: AiStatusCardProps) {
  const { c } = useTheme();

  return (
    <div className="rounded-2xl p-5" style={{ background: c.card, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow }}>
      <div className="flex items-center gap-2 mb-4">
        <BrainCircuit size={14} style={{ color: c.primary }} />
        <p style={{ color: c.textSec, fontSize: '0.73rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>AI 상태</p>
      </div>
      <div className="space-y-3">
        {statuses.map((status) => {
          const color = status.status === 'normal' ? c.success : status.status === 'warning' ? c.warning : c.error;

          return (
            <div key={status.id} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                <span style={{ color: c.text, fontSize: '0.78rem', fontWeight: 500 }}>{status.label}</span>
              </div>
              <div className="text-right">
                <div style={{ color, fontSize: '0.75rem', fontWeight: 600 }}>{status.latencyMs}ms</div>
                <div style={{ color: c.textMuted, fontSize: '0.62rem' }}>{status.updatedAt}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
