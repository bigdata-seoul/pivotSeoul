import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Database, RefreshCw, CheckCircle2, AlertCircle, Clock, Upload, Download } from 'lucide-react';

const datasets = [
  { name: '서울시 자치구별 전월세 현황', source: '서울열린데이터광장', lastUpdated: '2025-05-01', version: 'v2.4.1', status: 'active' as const, rows: 1250, size: '2.4 MB' },
  { name: '통근 시간 분석 데이터', source: '서울연구원', lastUpdated: '2025-04-15', version: 'v1.8.0', status: 'active' as const, rows: 840, size: '1.1 MB' },
  { name: '보육비 지원 정책 DB', source: '서울시 보육포털', lastUpdated: '2025-05-03', version: 'v3.1.0', status: 'active' as const, rows: 320, size: '0.6 MB' },
  { name: '자치구별 생활편의시설', source: '국토교통부', lastUpdated: '2025-03-20', version: 'v1.2.3', status: 'warning' as const, rows: 4200, size: '8.7 MB' },
  { name: '노후 현금흐름 모델 파라미터', source: '금융감독원', lastUpdated: '2025-04-28', version: 'v2.0.0', status: 'active' as const, rows: 150, size: '0.3 MB' },
  { name: '청년 정책 지원금 현황', source: '청년정책조정위', lastUpdated: '2025-02-10', version: 'v1.5.2', status: 'outdated' as const, rows: 280, size: '0.5 MB' },
  { name: '공동육아나눔터 위치 DB', source: '서울시 여성가족재단', lastUpdated: '2025-04-30', version: 'v1.1.0', status: 'active' as const, rows: 95, size: '0.2 MB' },
];

export function AdminDatasets() {
  const { c, isDark } = useTheme();
  const [selected, setSelected] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const toggle = (i: number) => setSelected(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  const toggleAll = () => setSelected(selected.length === datasets.length ? [] : datasets.map((_, i) => i));

  const statusInfo = (s: 'active' | 'warning' | 'outdated') => {
    if (s === 'active') return { label: '정상', color: c.success, bg: c.successBg, border: c.successBorder, Icon: CheckCircle2 };
    if (s === 'warning') return { label: '주의', color: c.warning, bg: c.warningBg, border: c.warningBorder, Icon: AlertCircle };
    return { label: '업데이트 필요', color: c.error, bg: c.errorBg, border: c.errorBorder, Icon: Clock };
  };

  const filtered = datasets.filter(d =>
    d.name.includes(searchTerm) || d.source.includes(searchTerm)
  );

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database size={15} style={{ color: c.primary }} />
          <h2 style={{ color: c.text, fontSize: '1.05rem', fontWeight: 700 }}>데이터셋 관리</h2>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
            style={{ background: c.card, border: `1px solid ${c.border}`, color: c.textSec, fontSize: '0.8rem' }}>
            <Upload size={13} /> 업로드
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
            style={{ background: c.primaryBg, border: `1px solid ${c.primaryBorder}`, color: c.primary, fontSize: '0.8rem' }}>
            <RefreshCw size={13} /> 전체 갱신
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: '총 데이터셋', value: datasets.length.toString(), color: c.primary },
          { label: '정상', value: datasets.filter(d => d.status === 'active').length.toString(), color: c.success },
          { label: '업데이트 필요', value: datasets.filter(d => d.status !== 'active').length.toString(), color: c.error },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-3.5"
            style={{ background: c.card, border: `1px solid ${c.cardBorder}` }}>
            <div style={{ color: s.color, fontSize: '1.5rem', fontWeight: 700 }}>{s.value}</div>
            <div style={{ color: c.textMuted, fontSize: '0.72rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
        style={{ background: c.inputBg, border: `1px solid ${c.inputBorder}` }}>
        <Database size={14} style={{ color: c.textMuted }} />
        <input
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="데이터셋 이름, 출처 검색..."
          className="flex-1 bg-transparent outline-none"
          style={{ color: c.text, fontSize: '0.85rem' }}
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: c.card, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: `1px solid ${c.border}`, background: isDark ? 'rgba(15,23,42,0.4)' : '#F8FAFC' }}>
              <th className="px-4 py-3 text-left w-8">
                <input type="checkbox" checked={selected.length === datasets.length} onChange={toggleAll}
                  className="rounded cursor-pointer" style={{ accentColor: c.primary }} />
              </th>
              {['데이터셋 이름', '출처', '마지막 갱신', '버전', '행 수', '크기', '상태', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left"
                  style={{ color: c.textMuted, fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((ds, idx) => {
              const si = statusInfo(ds.status);
              const isSelected = selected.includes(idx);
              return (
                <tr key={ds.name}
                  style={{
                    borderBottom: idx < filtered.length - 1 ? `1px solid ${c.border}` : 'none',
                    background: isSelected ? c.primaryBg : 'transparent',
                  }}>
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={isSelected} onChange={() => toggle(idx)}
                      className="cursor-pointer" style={{ accentColor: c.primary }} />
                  </td>
                  <td className="px-4 py-3">
                    <span style={{ color: c.text, fontSize: '0.82rem', fontWeight: 500 }}>{ds.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span style={{ color: c.textSec, fontSize: '0.78rem' }}>{ds.source}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span style={{ color: c.textSec, fontSize: '0.78rem' }}>{ds.lastUpdated}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-md"
                      style={{ background: c.primaryBg, color: c.accent, fontSize: '0.72rem', fontFamily: 'monospace' }}>
                      {ds.version}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span style={{ color: c.textSec, fontSize: '0.78rem' }}>{ds.rows.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span style={{ color: c.textMuted, fontSize: '0.75rem' }}>{ds.size}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full w-fit"
                      style={{ background: si.bg, border: `1px solid ${si.border}`, color: si.color, fontSize: '0.68rem', whiteSpace: 'nowrap' }}>
                      <si.Icon size={10} />
                      {si.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="p-1.5 rounded-lg transition-all"
                      style={{ color: c.textMuted, background: c.primaryBg }}>
                      <Download size={12} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
