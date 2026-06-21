import { Activity, Clock, Cpu, MemoryStick, Wifi } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import type { ServiceMetric } from '../../api/adminApi';

interface AdminStatusTableProps {
  metrics: ServiceMetric[];
}

const METRIC_ICONS = {
  cpu: Cpu,
  memory: MemoryStick,
  latency: Clock,
  network: Wifi,
} as const;

export function AdminStatusTable({ metrics }: AdminStatusTableProps) {
  const { c } = useTheme();

  if (metrics.length === 0) {
    return <EmptyState message="표시할 서비스 상태가 없습니다." />;
  }

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
      {metrics.map((metric) => {
        const Icon = METRIC_ICONS[metric.id as keyof typeof METRIC_ICONS] ?? Activity;
        const color = getStatusColor(metric.status, c);

        return (
          <div key={metric.id} className="rounded-2xl p-4" style={{ background: c.card, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow }}>
            <div className="flex items-center gap-2 mb-3">
              <Icon size={14} style={{ color }} />
              <span style={{ color: c.textMuted, fontSize: '0.72rem' }}>{metric.label}</span>
            </div>
            <div style={{ color: c.text, fontSize: '1.5rem', fontWeight: 700 }}>
              {metric.value}<span style={{ fontSize: '0.8rem', color: c.textSec }}>{metric.unit}</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: c.borderSoft }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${Math.min((metric.value / metric.max) * 100, 100)}%`, background: color }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  const { c } = useTheme();
  return <div className="rounded-2xl p-5" style={{ background: c.card, border: `1px solid ${c.cardBorder}`, color: c.textMuted, fontSize: '0.82rem' }}>{message}</div>;
}

function getStatusColor(status: ServiceMetric['status'], c: ReturnType<typeof useTheme>['c']) {
  if (status === 'normal') return c.success;
  if (status === 'warning') return c.warning;
  return c.error;
}
