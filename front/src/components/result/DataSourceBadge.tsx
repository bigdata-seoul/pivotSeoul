import { useTheme } from '../../context/ThemeContext';
import type { DataSource } from '../../api/dataApi';

interface DataSourceBadgeProps {
  source: DataSource;
}

export function DataSourceBadge({ source }: DataSourceBadgeProps) {
  const { c } = useTheme();

  return (
    <div className="flex items-start gap-1.5">
      <div className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ background: c.textMuted }} />
      <div>
        <p style={{ color: c.textSec, fontSize: '0.68rem' }}>{source.label}</p>
        <p style={{ color: c.textMuted, fontSize: '0.62rem' }}>{source.provider} ({source.year})</p>
      </div>
    </div>
  );
}
