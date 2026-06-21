import { useMemo, useState } from 'react';
import { Database, RefreshCw, Upload } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { DataSourceTable } from '../components/admin/DataSourceTable';
import { getMockDatasetStatuses } from '../api/dataApi';

export function AdminDatasets() {
  const { c } = useTheme();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const datasets = useMemo(() => getMockDatasetStatuses(), []);

  const filteredDatasets = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return datasets;

    return datasets.filter((dataset) =>
      dataset.label.toLowerCase().includes(keyword) ||
      dataset.provider.toLowerCase().includes(keyword)
    );
  }, [datasets, searchTerm]);

  const stats = useMemo(() => [
    { label: '총 데이터셋', value: datasets.length.toString(), color: c.primary },
    { label: '정상', value: datasets.filter((dataset) => dataset.status === 'active').length.toString(), color: c.success },
    { label: '업데이트 필요', value: datasets.filter((dataset) => dataset.status !== 'active').length.toString(), color: c.error },
  ], [c, datasets]);

  const toggleDataset = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]));
  };

  const toggleAll = () => {
    setSelectedIds((prev) => (prev.length === filteredDatasets.length ? [] : filteredDatasets.map((dataset) => dataset.id)));
  };

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database size={15} style={{ color: c.primary }} />
          <h2 style={{ color: c.text, fontSize: '1.05rem', fontWeight: 700 }}>데이터셋 관리</h2>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="flex items-center gap-1.5 px-3 py-2 rounded-xl" style={{ background: c.card, border: `1px solid ${c.border}`, color: c.textSec, fontSize: '0.8rem' }}>
            <Upload size={13} /> 업로드
          </button>
          <button type="button" className="flex items-center gap-1.5 px-3 py-2 rounded-xl" style={{ background: c.primaryBg, border: `1px solid ${c.primaryBorder}`, color: c.primary, fontSize: '0.8rem' }}>
            <RefreshCw size={13} /> 전체 갱신
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl p-3.5" style={{ background: c.card, border: `1px solid ${c.cardBorder}` }}>
            <div style={{ color: stat.color, fontSize: '1.5rem', fontWeight: 700 }}>{stat.value}</div>
            <div style={{ color: c.textMuted, fontSize: '0.72rem' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl" style={{ background: c.inputBg, border: `1px solid ${c.inputBorder}` }}>
        <Database size={14} style={{ color: c.textMuted }} />
        <input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="데이터셋 이름, 출처 검색..."
          className="flex-1 bg-transparent outline-none"
          style={{ color: c.text, fontSize: '0.85rem' }}
        />
      </div>

      <DataSourceTable datasets={filteredDatasets} selectedIds={selectedIds} onToggle={toggleDataset} onToggleAll={toggleAll} />
    </div>
  );
}
