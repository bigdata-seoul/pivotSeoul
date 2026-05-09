import { useTheme } from '../context/ThemeContext';
import {
  Users, Activity, BarChart3, AlertTriangle, TrendingUp,
  TrendingDown, MapPin, Zap, Baby, Sunset, ArrowUpRight
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const userTrend = [
  { date: '4/1', 청년기: 120, 신혼출산: 80, 노년기: 40 },
  { date: '4/8', 청년기: 145, 신혼출산: 95, 노년기: 52 },
  { date: '4/15', 청년기: 160, 신혼출산: 110, 노년기: 58 },
  { date: '4/22', 청년기: 188, 신혼출산: 125, 노년기: 67 },
  { date: '4/29', 청년기: 210, 신혼출산: 138, 노년기: 74 },
  { date: '5/6', 청년기: 243, 신혼출산: 155, 노년기: 88 },
  { date: '5/7', 청년기: 261, 신혼출산: 168, 노년기: 95 },
];

const districtData = [
  { name: '강남구', simulations: 320 },
  { name: '마포구', simulations: 280 },
  { name: '송파구', simulations: 245 },
  { name: '노원구', simulations: 210 },
  { name: '관악구', simulations: 195 },
  { name: '서초구', simulations: 180 },
  { name: '성동구', simulations: 160 },
  { name: '은평구', simulations: 140 },
];

const recentSims = [
  { id: 'SIM-2847', stage: '청년기', from: '강남구', to: '노원구', score: 72, result: '위험→경계', time: '2분 전' },
  { id: 'SIM-2846', stage: '신혼·출산기', from: '마포구', to: '은평구', score: 45, result: '위험→안전', time: '5분 전' },
  { id: 'SIM-2845', stage: '청년기', from: '서초구', to: '관악구', score: 58, result: '경계→안전', time: '8분 전' },
  { id: 'SIM-2844', stage: '노년기', from: '강서구', to: '도봉구', score: 33, result: '안전 유지', time: '11분 전' },
  { id: 'SIM-2843', stage: '신혼·출산기', from: '송파구', to: '양천구', score: 62, result: '경계 유지', time: '15분 전' },
  { id: 'SIM-2842', stage: '청년기', from: '용산구', to: '성북구', score: 81, result: '위험 유지', time: '20분 전' },
];

const stageIcon = { '청년기': Zap, '신혼·출산기': Baby, '노년기': Sunset };
const stageColor = { '청년기': '#6366F1', '신혼·출산기': '#F59E0B', '노년기': '#10B981' };

export function AdminDashboard() {
  const { c, isDark } = useTheme();

  const kpis = [
    { label: '오늘 활성 사용자', value: '524', delta: '+12.4%', up: true, icon: Users, color: c.primary },
    { label: '총 시뮬레이션', value: '2,847', delta: '+8.1%', up: true, icon: BarChart3, color: c.success },
    { label: '평균 리스크 점수', value: '61.2점', delta: '+2.3pt', up: false, icon: Activity, color: c.warning },
    { label: '오류 발생률', value: '0.08%', delta: '-0.02%', up: true, icon: AlertTriangle, color: c.error },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="px-3 py-2 rounded-xl"
        style={{ background: isDark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.98)', border: `1px solid ${c.border}`, boxShadow: c.cardShadow }}>
        <p style={{ color: c.textSec, fontSize: '0.72rem', marginBottom: '4px' }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color, fontSize: '0.78rem' }}>{p.dataKey}: {p.value.toLocaleString()}명</p>
        ))}
      </div>
    );
  };

  const resultStyle = (r: string) => {
    if (r.includes('안전')) return { color: c.success, bg: c.successBg, border: c.successBorder };
    if (r.includes('경계')) return { color: c.warning, bg: c.warningBg, border: c.warningBorder };
    return { color: c.error, bg: c.errorBg, border: c.errorBorder };
  };

  return (
    <div className="p-5 space-y-5">

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {kpis.map(({ label, value, delta, up, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl p-4"
            style={{ background: c.card, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `${color}18` }}>
                <Icon size={16} style={{ color }} />
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                style={{ background: up ? c.successBg : c.errorBg, border: `1px solid ${up ? c.successBorder : c.errorBorder}` }}>
                {up ? <TrendingUp size={10} style={{ color: c.success }} /> : <TrendingDown size={10} style={{ color: c.error }} />}
                <span style={{ color: up ? c.success : c.error, fontSize: '0.65rem' }}>{delta}</span>
              </div>
            </div>
            <div style={{ color: c.text, fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.02em' }}>{value}</div>
            <div style={{ color: c.textMuted, fontSize: '0.72rem', marginTop: '2px' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* User trend */}
        <div className="xl:col-span-2 rounded-2xl p-5"
          style={{ background: c.card, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p style={{ color: c.textSec, fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>생애 단계별 일별 사용자</p>
              <p style={{ color: c.text, fontSize: '0.95rem', fontWeight: 600 }}>최근 7일 트렌드</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full"
              style={{ background: c.successBg, border: `1px solid ${c.successBorder}` }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: c.success }} />
              <span style={{ color: c.success, fontSize: '0.68rem' }}>실시간</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={userTrend} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
              <defs>
                {[
                  { id: 'g1', color: '#6366F1' },
                  { id: 'g2', color: '#F59E0B' },
                  { id: 'g3', color: '#10B981' },
                ].map(g => (
                  <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={g.color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={g.color} stopOpacity={0.02} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={c.chartGrid} />
              <XAxis dataKey="date" tick={{ fill: c.chartAxis, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: c.chartAxis, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '0.72rem' }}
                formatter={(v) => <span style={{ color: c.textSec }}>{v}</span>} />
              <Area type="monotone" dataKey="청년기" stroke="#6366F1" strokeWidth={2} fill="url(#g1)" dot={false} />
              <Area type="monotone" dataKey="신혼출산" stroke="#F59E0B" strokeWidth={2} fill="url(#g2)" dot={false} />
              <Area type="monotone" dataKey="노년기" stroke="#10B981" strokeWidth={2} fill="url(#g3)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* District ranking */}
        <div className="rounded-2xl p-5"
          style={{ background: c.card, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow }}>
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={13} style={{ color: c.primary }} />
            <p style={{ color: c.textSec, fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              인기 자치구 TOP 8
            </p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={districtData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <XAxis type="number" tick={{ fill: c.chartAxis, fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: c.chartAxis, fontSize: 10 }} width={40} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(v) => [`${v}회`, '시뮬레이션']}
                contentStyle={{ background: isDark ? 'rgba(15,23,42,0.95)' : '#fff', border: `1px solid ${c.border}`, borderRadius: '12px', fontSize: '0.78rem' }}
                labelStyle={{ color: c.text }}
              />
              <Bar dataKey="simulations" fill="#6366F1" fillOpacity={0.75} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Simulations Table */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: c.card, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: c.border }}>
          <div className="flex items-center gap-2">
            <Activity size={13} style={{ color: c.primary }} />
            <p style={{ color: c.textSec, fontSize: '0.73rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              최근 시뮬레이션
            </p>
          </div>
          <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg"
            style={{ color: c.primary, background: c.primaryBg, border: `1px solid ${c.primaryBorder}`, fontSize: '0.72rem' }}>
            전체보기 <ArrowUpRight size={11} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${c.border}` }}>
                {['시뮬레이션 ID', '생애단계', 'A 자치구', 'B 자치구', '리스크 점수', '결과', '시간'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left"
                    style={{ color: c.textMuted, fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentSims.map((sim, idx) => {
                const Icon = stageIcon[sim.stage as keyof typeof stageIcon] || Zap;
                const color = stageColor[sim.stage as keyof typeof stageColor] || c.primary;
                const rs = resultStyle(sim.result);
                return (
                  <tr key={sim.id}
                    style={{ borderBottom: idx < recentSims.length - 1 ? `1px solid ${c.border}` : 'none' }}
                    className="transition-colors"
                    onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td className="px-4 py-3">
                      <span style={{ color: c.accent, fontSize: '0.78rem', fontFamily: 'monospace' }}>{sim.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Icon size={12} style={{ color }} />
                        <span style={{ color, fontSize: '0.78rem', fontWeight: 500 }}>{sim.stage}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ color: c.textSec, fontSize: '0.8rem' }}>{sim.from}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ color: c.textSec, fontSize: '0.8rem' }}>{sim.to}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: c.borderSoft }}>
                          <div className="h-full rounded-full" style={{ width: `${sim.score}%`, background: sim.score > 65 ? c.error : sim.score > 35 ? c.warning : c.success }} />
                        </div>
                        <span style={{ color: c.text, fontSize: '0.78rem', fontWeight: 600 }}>{sim.score}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full"
                        style={{ background: rs.bg, color: rs.color, border: `1px solid ${rs.border}`, fontSize: '0.7rem' }}>
                        {sim.result}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ color: c.textMuted, fontSize: '0.72rem' }}>{sim.time}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
