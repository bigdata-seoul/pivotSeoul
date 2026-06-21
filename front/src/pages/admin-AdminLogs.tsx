import { useMemo, useState } from 'react';
import { AlertOctagon, Download, RefreshCw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { DataValidationLog } from '../components/admin/DataValidationLog';
import { getMockValidationLogs, type LogLevel } from '../api/adminApi';

export function AdminLogs() {
  const { c } = useTheme();
  const [filter, setFilter] = useState<LogLevel | 'all'>('all');
  const logs = useMemo(() => getMockValidationLogs(), []);

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertOctagon size={15} style={{ color: c.primary }} />
          <h2 style={{ color: c.text, fontSize: '1.05rem', fontWeight: 700 }}>데이터 검증 로그</h2>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="flex items-center gap-1.5 px-3 py-2 rounded-xl" style={{ background: c.card, border: `1px solid ${c.border}`, color: c.textSec, fontSize: '0.8rem' }}>
            <Download size={13} /> 내보내기
          </button>
          <button type="button" className="flex items-center gap-1.5 px-3 py-2 rounded-xl" style={{ background: c.primaryBg, border: `1px solid ${c.primaryBorder}`, color: c.primary, fontSize: '0.8rem' }}>
            <RefreshCw size={13} /> 새로고침
          </button>
        </div>
      </div>

      <DataValidationLog logs={logs} filter={filter} onFilterChange={setFilter} />
    </div>
  );
}
