import { AlertTriangle, CheckCircle2, Filter, Info, XCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import type { LogLevel, ValidationLog } from '../../api/adminApi';

interface DataValidationLogProps {
  logs: ValidationLog[];
  filter: LogLevel | 'all';
  onFilterChange: (filter: LogLevel | 'all') => void;
}

const LOG_LEVEL_META = {
  error: { label: 'ERROR', displayName: '오류', color: '#EF4444', Icon: XCircle },
  warn: { label: 'WARN', displayName: '경고', color: '#F59E0B', Icon: AlertTriangle },
  info: { label: 'INFO', displayName: '정보', color: '#6366F1', Icon: Info },
  success: { label: 'OK', displayName: '성공', color: '#10B981', Icon: CheckCircle2 },
} as const;

export function DataValidationLog({ logs, filter, onFilterChange }: DataValidationLogProps) {
  const { c, isDark } = useTheme();
  const filteredLogs = filter === 'all' ? logs : logs.filter((log) => log.level === filter);

  return (
    <>
      <div className="flex gap-2 flex-wrap">
        <FilterButton label={`전체 (${logs.length})`} color={c.textSec} active={filter === 'all'} onClick={() => onFilterChange('all')} />
        {(Object.keys(LOG_LEVEL_META) as LogLevel[]).map((level) => (
          <FilterButton
            key={level}
            label={`${LOG_LEVEL_META[level].displayName} (${logs.filter((log) => log.level === level).length})`}
            color={LOG_LEVEL_META[level].color}
            active={filter === level}
            onClick={() => onFilterChange(level)}
          />
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: c.card, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${c.border}`, background: isDark ? 'rgba(15,23,42,0.4)' : '#F8FAFC' }}>
                {['레벨', '시간', '메시지', '소스', '사용자'].map((header) => (
                  <th key={header} className="px-4 py-2.5 text-left" style={{ color: c.textMuted, fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, index) => {
                const meta = LOG_LEVEL_META[log.level];
                const Icon = meta.Icon;

                return (
                  <tr key={log.id} style={{ borderBottom: index < filteredLogs.length - 1 ? `1px solid ${c.border}` : 'none' }} className="transition-colors" onMouseEnter={(event) => { event.currentTarget.style.background = c.hoverBg; }} onMouseLeave={(event) => { event.currentTarget.style.background = 'transparent'; }}>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <Icon size={12} style={{ color: meta.color }} />
                        <span style={{ color: meta.color, fontSize: '0.68rem', fontWeight: 700, fontFamily: 'monospace' }}>{meta.label}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5"><span style={{ color: c.textMuted, fontSize: '0.72rem', fontFamily: 'monospace' }}>{log.time}</span></td>
                    <td className="px-4 py-2.5" style={{ maxWidth: '340px' }}><p style={{ color: c.text, fontSize: '0.78rem', lineHeight: 1.45 }}>{log.message}</p></td>
                    <td className="px-4 py-2.5"><span style={{ color: c.textMuted, fontSize: '0.68rem', fontFamily: 'monospace' }}>{log.source}</span></td>
                    <td className="px-4 py-2.5"><span className="px-2 py-0.5 rounded-md" style={{ background: c.badgeBg, color: c.textSec, fontSize: '0.68rem', fontFamily: 'monospace' }}>{log.actor}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function FilterButton({ label, color, active, onClick }: { label: string; color: string; active: boolean; onClick: () => void }) {
  const { c, isDark } = useTheme();

  return (
    <button type="button" onClick={onClick} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all" style={{ background: active ? `${color}18` : (isDark ? 'rgba(15,23,42,0.4)' : '#F8FAFC'), border: `1px solid ${active ? `${color}40` : c.borderSoft}`, color: active ? color : c.textMuted, fontSize: '0.78rem', fontWeight: active ? 600 : 400 }}>
      <Filter size={10} />
      {label}
    </button>
  );
}
