import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Activity, Clock, Server, Cpu, MemoryStick, Wifi } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area
} from 'recharts';

const hourlyData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i.toString().padStart(2, '0')}:00`,
  users: Math.round(30 + Math.sin(i / 3) * 25 + Math.random() * 15),
  latency: Math.round(45 + Math.cos(i / 4) * 20 + Math.random() * 10),
  errors: Math.round(Math.max(0, Math.random() * 3)),
}));

const pageViews = [
  { page: '홈 대시보드', views: 1842, avg: '32초', bounce: '18%' },
  { page: '생애단계 선택', views: 1204, avg: '45초', bounce: '22%' },
  { page: '청년기 온보딩', views: 987, avg: '3분 12초', bounce: '8%' },
  { page: 'A/B 시나리오', views: 743, avg: '5분 48초', bounce: '5%' },
  { page: '결과 분석', views: 681, avg: '4분 22초', bounce: '6%' },
  { page: '신혼·출산기 온보딩', views: 412, avg: '2분 58초', bounce: '9%' },
  { page: '노년기 온보딩', views: 218, avg: '2분 41초', bounce: '11%' },
];

export function AdminMonitoring() {
  const { c, isDark } = useTheme();
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const serverStats = [
    { label: 'CPU 사용률', value: 34, unit: '%', icon: Cpu, color: c.primary, max: 100 },
    { label: '메모리', value: 62, unit: '%', icon: MemoryStick, color: c.warning, max: 100 },
    { label: '응답시간', value: 48, unit: 'ms', icon: Clock, color: c.success, max: 200 },
    { label: '네트워크', value: 128, unit: 'KB/s', icon: Wifi, color: c.accent, max: 1000 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="px-3 py-2 rounded-xl"
        style={{ background: isDark ? 'rgba(15,23,42,0.95)' : '#fff', border: `1px solid ${c.border}`, boxShadow: c.cardShadow }}>
        <p style={{ color: c.textSec, fontSize: '0.7rem', marginBottom: '4px' }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color, fontSize: '0.78rem' }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  };

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center gap-2">
        <Activity size={15} style={{ color: c.primary }} />
        <h2 style={{ color: c.text, fontSize: '1.05rem', fontWeight: 700 }}>사용 현황 모니터링</h2>
        <div className="flex items-center gap-1.5 ml-auto px-3 py-1 rounded-full"
          style={{ background: c.successBg, border: `1px solid ${c.successBorder}` }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: c.success }} />
          <span style={{ color: c.success, fontSize: '0.72rem' }}>실시간 모니터링 중</span>
        </div>
      </div>

      {/* Server stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {serverStats.map(({ label, value, unit, icon: Icon, color, max }) => (
          <div key={label} className="rounded-2xl p-4"
            style={{ background: c.card, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow }}>
            <div className="flex items-center gap-2 mb-3">
              <Icon size={14} style={{ color }} />
              <span style={{ color: c.textMuted, fontSize: '0.72rem' }}>{label}</span>
            </div>
            <div style={{ color: c.text, fontSize: '1.5rem', fontWeight: 700 }}>
              {value}<span style={{ fontSize: '0.8rem', color: c.textSec }}>{unit}</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: c.borderSoft }}>
              <div className="h-full rounded-full transition-all"
                style={{ width: `${(value / max) * 100}%`, background: color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="rounded-2xl p-5"
          style={{ background: c.card, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow }}>
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
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="users" name="접속자" stroke="#6366F1" strokeWidth={2} fill="url(#uGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl p-5"
          style={{ background: c.card, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow }}>
          <p style={{ color: c.textSec, fontSize: '0.73rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px' }}>API 응답시간</p>
          <p style={{ color: c.text, fontSize: '0.92rem', fontWeight: 600, marginBottom: '16px' }}>시간대별 평균 (ms)</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={hourlyData} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={c.chartGrid} />
              <XAxis dataKey="time" tick={{ fill: c.chartAxis, fontSize: 9 }} axisLine={false} tickLine={false} interval={3} />
              <YAxis tick={{ fill: c.chartAxis, fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="latency" name="응답시간(ms)" stroke={c.success} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Page views table */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: c.card, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow }}>
        <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: c.border }}>
          <Server size={13} style={{ color: c.primary }} />
          <p style={{ color: c.textSec, fontSize: '0.73rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            페이지별 방문 현황
          </p>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: `1px solid ${c.border}` }}>
              {['페이지', '페이지뷰', '평균 체류시간', '이탈률', '퍼널'].map(h => (
                <th key={h} className="px-5 py-2.5 text-left"
                  style={{ color: c.textMuted, fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageViews.map((row, idx) => {
              const pct = (row.views / pageViews[0].views) * 100;
              return (
                <tr key={row.page}
                  style={{ borderBottom: idx < pageViews.length - 1 ? `1px solid ${c.border}` : 'none', background: hoveredRow === idx ? c.hoverBg : 'transparent' }}
                  onMouseEnter={() => setHoveredRow(idx)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="px-5 py-3" style={{ color: c.text, fontSize: '0.82rem' }}>{row.page}</td>
                  <td className="px-5 py-3" style={{ color: c.text, fontSize: '0.82rem', fontWeight: 600 }}>{row.views.toLocaleString()}</td>
                  <td className="px-5 py-3" style={{ color: c.textSec, fontSize: '0.78rem' }}>{row.avg}</td>
                  <td className="px-5 py-3" style={{ color: Number(row.bounce) < 10 ? c.success : Number(row.bounce) < 20 ? c.warning : c.error, fontSize: '0.78rem', fontWeight: 500 }}>{row.bounce}</td>
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
