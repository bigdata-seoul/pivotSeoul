import { useMemo, useState } from 'react';
import { Activity, Server } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { AdminStatusTable } from '../components/admin/AdminStatusTable';
import { AiStatusCard } from '../components/admin/AiStatusCard';
import { PromptManagePanel } from '../components/admin/PromptManagePanel';
import { getMockAiStatuses, getMockServiceMetrics } from '../api/adminApi';

interface TooltipPayload {
  name?: string;
  value?: number;
  color?: string;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

const hourlyData = Array.from({ length: 24 }, (_, index) => ({
  time: `${index.toString().padStart(2, '0')}:00`,
  users: Math.round(30 + Math.sin(index / 3) * 25 + (index % 4) * 3),
  latency: Math.round(45 + Math.cos(index / 4) * 20 + (index % 3) * 4),
  errors: Math.round(Math.max(0, index % 5 === 0 ? 2 : 0)),
}));

const pageViews = [
  { page: '결과 분석', views: 681, avg: '4분 22초', bounce: '6%' },
  { page: 'A/B 시나리오', views: 743, avg: '5분 48초', bounce: '5%' },
  { page: '데이터셋 관리', views: 214, avg: '2분 10초', bounce: '12%' },
  { page: '로그 뷰어', views: 156, avg: '1분 52초', bounce: '18%' },
];

export function AdminMonitoring() {
  const { c, isDark } = useTheme();
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const serviceMetrics = useMemo(() => getMockServiceMetrics(), []);
  const aiStatuses = useMemo(() => getMockAiStatuses(), []);

  const chartTooltip = ({ active, payload, label }: ChartTooltipProps) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="px-3 py-2 rounded-xl" style={{ background: isDark ? 'rgba(15,23,42,0.95)' : '#fff', border: `1px solid ${c.border}`, boxShadow: c.cardShadow }}>
        <p style={{ color: c.textSec, fontSize: '0.7rem', marginBottom: '4px' }}>{label}</p>
        {payload.map((item) => (
          <p key={item.name} style={{ color: item.color, fontSize: '0.78rem' }}>{item.name}: {item.value}</p>
        ))}
      </div>
    );
  };

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center gap-2">
        <Activity size={15} style={{ color: c.primary }} />
        <h2 style={{ color: c.text, fontSize: '1.05rem', fontWeight: 700 }}>서비스 상태 모니터링</h2>
        <div className="flex items-center gap-1.5 ml-auto px-3 py-1 rounded-full" style={{ background: c.successBg, border: `1px solid ${c.successBorder}` }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: c.success }} />
          <span style={{ color: c.success, fontSize: '0.72rem' }}>실시간 모니터링 중</span>
        </div>
      </div>

      <AdminStatusTable metrics={serviceMetrics} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="rounded-2xl p-5" style={{ background: c.card, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow }}>
          <p style={{ color: c.textSec, fontSize: '0.73rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px' }}>시간대별 동시 접속자</p>
          <p style={{ color: c.text, fontSize: '0.92rem', fontWeight: 600, marginBottom: '16px' }}>오늘 (24시간)</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={hourlyData} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
              <defs>
                <linearGradient id="uGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={c.chartGrid} />
              <XAxis dataKey="time" tick={{ fill: c.chartAxis, fontSize: 9 }} axisLine={false} tickLine={false} interval={3} />
              <YAxis tick={{ fill: c.chartAxis, fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip content={chartTooltip} />
              <Area type="monotone" dataKey="users" name="접속자" stroke="#6366F1" strokeWidth={2} fill="url(#uGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl p-5" style={{ background: c.card, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow }}>
          <p style={{ color: c.textSec, fontSize: '0.73rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px' }}>API 응답시간</p>
          <p style={{ color: c.text, fontSize: '0.92rem', fontWeight: 600, marginBottom: '16px' }}>시간대별 평균 (ms)</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={hourlyData} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={c.chartGrid} />
              <XAxis dataKey="time" tick={{ fill: c.chartAxis, fontSize: 9 }} axisLine={false} tickLine={false} interval={3} />
              <YAxis tick={{ fill: c.chartAxis, fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip content={chartTooltip} />
              <Line type="monotone" dataKey="latency" name="응답시간(ms)" stroke={c.success} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <AiStatusCard statuses={aiStatuses} />
        <PromptManagePanel />
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: c.card, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow }}>
        <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: c.border }}>
          <Server size={13} style={{ color: c.primary }} />
          <p style={{ color: c.textSec, fontSize: '0.73rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>담당 화면 방문 현황</p>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: `1px solid ${c.border}` }}>
              {['페이지', '페이지뷰', '평균 체류시간', '이탈률', '비율'].map((header) => (
                <th key={header} className="px-5 py-2.5 text-left" style={{ color: c.textMuted, fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageViews.map((row, index) => {
              const pct = (row.views / pageViews[0].views) * 100;

              return (
                <tr key={row.page} style={{ borderBottom: index < pageViews.length - 1 ? `1px solid ${c.border}` : 'none', background: hoveredRow === index ? c.hoverBg : 'transparent' }} onMouseEnter={() => setHoveredRow(index)} onMouseLeave={() => setHoveredRow(null)}>
                  <td className="px-5 py-3" style={{ color: c.text, fontSize: '0.82rem' }}>{row.page}</td>
                  <td className="px-5 py-3" style={{ color: c.text, fontSize: '0.82rem', fontWeight: 600 }}>{row.views.toLocaleString()}</td>
                  <td className="px-5 py-3" style={{ color: c.textSec, fontSize: '0.78rem' }}>{row.avg}</td>
                  <td className="px-5 py-3" style={{ color: Number.parseInt(row.bounce, 10) < 10 ? c.success : Number.parseInt(row.bounce, 10) < 20 ? c.warning : c.error, fontSize: '0.78rem', fontWeight: 500 }}>{row.bounce}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: c.borderSoft, maxWidth: '80px' }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: c.primary }} />
                      </div>
                      <span style={{ color: c.textMuted, fontSize: '0.68rem' }}>{pct.toFixed(0)}%</span>
                    </div>
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
