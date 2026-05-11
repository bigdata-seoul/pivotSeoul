import { CheckCircle2, AlertCircle, Clock, Download } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import type { DatasetStatus, DataSourceStatus } from '../../api/dataApi';

interface DataSourceTableProps {
  datasets: DatasetStatus[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onToggleAll: () => void;
}

const DATASET_HEADERS = ['데이터셋 이름', '출처', '마지막 갱신', '버전', '행 수', '크기', '상태', ''];

export function DataSourceTable({ datasets, selectedIds, onToggle, onToggleAll }: DataSourceTableProps) {
  const { c, isDark } = useTheme();

  if (datasets.length === 0) {
    return <div className="rounded-2xl p-5" style={{ background: c.card, border: `1px solid ${c.cardBorder}`, color: c.textMuted }}>검색 결과가 없습니다.</div>;
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: c.card, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow }}>
      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: `1px solid ${c.border}`, background: isDark ? 'rgba(15,23,42,0.4)' : '#F8FAFC' }}>
            <th className="px-4 py-3 text-left w-8">
              <input type="checkbox" checked={selectedIds.length === datasets.length} onChange={onToggleAll} className="rounded cursor-pointer" style={{ accentColor: c.primary }} />
            </th>
            {DATASET_HEADERS.map((header) => (
              <th key={header} className="px-4 py-3 text-left" style={{ color: c.textMuted, fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {datasets.map((dataset, index) => {
            const isSelected = selectedIds.includes(dataset.id);

            return (
              <tr key={dataset.id} style={{ borderBottom: index < datasets.length - 1 ? `1px solid ${c.border}` : 'none', background: isSelected ? c.primaryBg : 'transparent' }}>
                <td className="px-4 py-3">
                  <input type="checkbox" checked={isSelected} onChange={() => onToggle(dataset.id)} className="cursor-pointer" style={{ accentColor: c.primary }} />
                </td>
                <td className="px-4 py-3"><span style={{ color: c.text, fontSize: '0.82rem', fontWeight: 500 }}>{dataset.label}</span></td>
                <td className="px-4 py-3"><span style={{ color: c.textSec, fontSize: '0.78rem' }}>{dataset.provider}</span></td>
                <td className="px-4 py-3"><span style={{ color: c.textSec, fontSize: '0.78rem' }}>{dataset.lastUpdated}</span></td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-md" style={{ background: c.primaryBg, color: c.accent, fontSize: '0.72rem', fontFamily: 'monospace' }}>{dataset.version}</span></td>
                <td className="px-4 py-3"><span style={{ color: c.textSec, fontSize: '0.78rem' }}>{dataset.rows.toLocaleString()}</span></td>
                <td className="px-4 py-3"><span style={{ color: c.textMuted, fontSize: '0.75rem' }}>{dataset.size}</span></td>
                <td className="px-4 py-3"><DatasetStatusBadge status={dataset.status ?? 'active'} /></td>
                <td className="px-4 py-3">
                  <button type="button" className="p-1.5 rounded-lg transition-all" style={{ color: c.textMuted, background: c.primaryBg }} aria-label={`${dataset.label} 다운로드`}>
                    <Download size={12} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function DatasetStatusBadge({ status }: { status: DataSourceStatus }) {
  const { c } = useTheme();
  const meta = getStatusMeta(status, c);
  const Icon = meta.Icon;

  return (
    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full w-fit" style={{ background: meta.bg, border: `1px solid ${meta.border}`, color: meta.color, fontSize: '0.68rem', whiteSpace: 'nowrap' }}>
      <Icon size={10} />
      {meta.label}
    </span>
  );
}

function getStatusMeta(status: DataSourceStatus, c: ReturnType<typeof useTheme>['c']) {
  if (status === 'active') return { label: '정상', color: c.success, bg: c.successBg, border: c.successBorder, Icon: CheckCircle2 };
  if (status === 'warning') return { label: '주의', color: c.warning, bg: c.warningBg, border: c.warningBorder, Icon: AlertCircle };
  return { label: '업데이트 필요', color: c.error, bg: c.errorBg, border: c.errorBorder, Icon: Clock };
}
