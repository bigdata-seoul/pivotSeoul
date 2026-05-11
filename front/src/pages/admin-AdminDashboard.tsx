import { Activity, AlertTriangle, BarChart3, Database, TrendingDown, TrendingUp, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { AiStatusCard } from '../components/admin/AiStatusCard';
import { DataValidationLog } from '../components/admin/DataValidationLog';
import { PromptManagePanel } from '../components/admin/PromptManagePanel';
import { getMockAiStatuses, getMockValidationLogs, type LogLevel } from '../api/adminApi';
import type { RiskStatus } from '../api/resultApi';

interface RecentSimulation {
  id: string;
  stage: string;
  fromDistrict: string;
  toDistrict: string;
  score: number;
  status: RiskStatus;
  createdAt: string;
}

const RECENT_SIMULATIONS: RecentSimulation[] = [
  { id: 'SIM-2847', stage: '청년기', fromDistrict: '강남구', toDistrict: '노원구', score: 72, status: 'danger', createdAt: '2분 전' },
  { id: 'SIM-2846', stage: '신혼출산기', fromDistrict: '마포구', toDistrict: '은평구', score: 45, status: 'warning', createdAt: '5분 전' },
  { id: 'SIM-2845', stage: '청년기', fromDistrict: '서초구', toDistrict: '관악구', score: 58, status: 'warning', createdAt: '8분 전' },
  { id: 'SIM-2844', stage: '노년기', fromDistrict: '강서구', toDistrict: '도봉구', score: 33, status: 'safe', createdAt: '11분 전' },
];

const STATUS_LABELS: Record<RiskStatus, string> = {
  safe: '안전',
  warning: '경계',
  danger: '위험',
};

export function AdminDashboard() {
  const { c } = useTheme();
  const [logFilter, setLogFilter] = useState<LogLevel | 'all'>('all');
  const aiStatuses = useMemo(() => getMockAiStatuses(), []);
  const validationLogs = useMemo(() => getMockValidationLogs(), []);

  const kpis = [
    { label: '오늘 활성 사용자', value: '524', delta: '+12.4%', up: true, icon: Users, color: c.primary },
    { label: '총 시뮬레이션', value: '2,847', delta: '+8.1%', up: true, icon: BarChart3, color: c.success },
    { label: '평균 리스크 점수', value: '61.2점', delta: '+2.3pt', up: false, icon: Activity, color: c.warning },
    { label: '데이터 오류율', value: '0.08%', delta: '-0.02%', up: true, icon: AlertTriangle, color: c.error },
  ];

  return (
    <div className="p-5 space-y-5">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {kpis.map(({ label, value, delta, up, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl p-4" style={{ background: c.card, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
                <Icon size={16} style={{ color }} />
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: up ? c.successBg : c.errorBg, border: `1px solid ${up ? c.successBorder : c.errorBorder}` }}>
                {up ? <TrendingUp size={10} style={{ color: c.success }} /> : <TrendingDown size={10} style={{ color: c.error }} />}
                <span style={{ color: up ? c.success : c.error, fontSize: '0.65rem' }}>{delta}</span>
              </div>
            </div>
            <div style={{ color: c.text, fontSize: '1.4rem', fontWeight: 700 }}>{value}</div>
            <div style={{ color: c.textMuted, fontSize: '0.72rem', marginTop: '2px' }}>{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <AiStatusCard statuses={aiStatuses} />
        <PromptManagePanel />
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: c.card, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow }}>
        <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: c.border }}>
          <Database size={13} style={{ color: c.primary }} />
          <p style={{ color: c.textSec, fontSize: '0.73rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>최근 결과 기록</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${c.border}` }}>
                {['시뮬레이션 ID', '생애단계', 'A 자치구', 'B 자치구', '리스크 점수', '결과', '시간'].map((header) => (
                  <th key={header} className="px-4 py-2.5 text-left" style={{ color: c.textMuted, fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_SIMULATIONS.map((simulation, index) => {
                const statusStyle = getResultStyle(simulation.status, c);

                return (
                  <tr key={simulation.id} style={{ borderBottom: index < RECENT_SIMULATIONS.length - 1 ? `1px solid ${c.border}` : 'none' }} className="transition-colors" onMouseEnter={(event) => { event.currentTarget.style.background = c.hoverBg; }} onMouseLeave={(event) => { event.currentTarget.style.background = 'transparent'; }}>
                    <td className="px-4 py-3"><span style={{ color: c.accent, fontSize: '0.78rem', fontFamily: 'monospace' }}>{simulation.id}</span></td>
                    <td className="px-4 py-3"><span style={{ color: c.textSec, fontSize: '0.8rem' }}>{simulation.stage}</span></td>
                    <td className="px-4 py-3"><span style={{ color: c.textSec, fontSize: '0.8rem' }}>{simulation.fromDistrict}</span></td>
                    <td className="px-4 py-3"><span style={{ color: c.textSec, fontSize: '0.8rem' }}>{simulation.toDistrict}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: c.borderSoft }}>
                          <div className="h-full rounded-full" style={{ width: `${simulation.score}%`, background: statusStyle.color }} />
                        </div>
                        <span style={{ color: c.text, fontSize: '0.78rem', fontWeight: 600 }}>{simulation.score}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full" style={{ background: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}`, fontSize: '0.7rem' }}>
                        {STATUS_LABELS[simulation.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3"><span style={{ color: c.textMuted, fontSize: '0.72rem' }}>{simulation.createdAt}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <DataValidationLog logs={validationLogs} filter={logFilter} onFilterChange={setLogFilter} />
    </div>
  );
}

function getResultStyle(status: RiskStatus, c: ReturnType<typeof useTheme>['c']) {
  if (status === 'safe') return { color: c.success, bg: c.successBg, border: c.successBorder };
  if (status === 'warning') return { color: c.warning, bg: c.warningBg, border: c.warningBorder };
  return { color: c.error, bg: c.errorBg, border: c.errorBorder };
}
