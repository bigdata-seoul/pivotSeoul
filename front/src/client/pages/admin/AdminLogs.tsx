import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { AlertOctagon, Filter, Download, RefreshCw, CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';

const logData = [
  { id: 'LOG-9482', level: 'error' as const, message: 'calculateRisk: NaN detected in housingRatio (district: 강남구)', source: 'PivotContext.tsx:88', time: '14:22:31', user: 'SIM-2841' },
  { id: 'LOG-9481', level: 'warn' as const, message: 'District rent data missing for 도봉구 — using fallback average', source: 'OnboardingYouth.tsx:101', time: '14:19:05', user: 'SIM-2839' },
  { id: 'LOG-9480', level: 'info' as const, message: 'Scenario A/B comparison completed successfully', source: 'Scenario.tsx:145', time: '14:17:52', user: 'SIM-2838' },
  { id: 'LOG-9479', level: 'info' as const, message: 'User completed onboarding — life stage: family', source: 'OnboardingFamily.tsx:168', time: '14:15:10', user: 'SIM-2837' },
  { id: 'LOG-9478', level: 'success' as const, message: 'Dataset sync completed: 서울시 전월세 현황 v2.4.1', source: 'DataSync.ts:44', time: '14:10:00', user: 'SYSTEM' },
  { id: 'LOG-9477', level: 'warn' as const, message: 'Slow API response: /api/district/latency > 200ms', source: 'api/districts.ts:32', time: '14:08:44', user: 'SYSTEM' },
  { id: 'LOG-9476', level: 'error' as const, message: 'Failed to load policy data: network timeout after 5000ms', source: 'Results.tsx:218', time: '14:05:22', user: 'SIM-2835' },
  { id: 'LOG-9475', level: 'info' as const, message: 'Admin login successful', source: 'AdminLogin.tsx:47', time: '14:01:05', user: 'admin' },
  { id: 'LOG-9474', level: 'success' as const, message: 'Theme changed to dark mode', source: 'ThemeContext.tsx:141', time: '13:55:33', user: 'SIM-2834' },
  { id: 'LOG-9473', level: 'warn' as const, message: 'childcareCost ratio exceeds 25% threshold — flagged', source: 'PivotContext.tsx:112', time: '13:50:18', user: 'SIM-2833' },
  { id: 'LOG-9472', level: 'info' as const, message: 'GaugeChart rendered with score: 72 (danger zone)', source: 'GaugeChart.tsx:38', time: '13:48:02', user: 'SIM-2832' },
  { id: 'LOG-9471', level: 'success' as const, message: 'Policy application toggle activated — benefit: +30만원/월', source: 'Scenario.tsx:89', time: '13:45:55', user: 'SIM-2831' },
];

const levelInfo = {
  error: { label: 'ERROR', color: '#EF4444', Icon: XCircle },
  warn: { label: 'WARN', color: '#F59E0B', Icon: AlertTriangle },
  info: { label: 'INFO', color: '#6366F1', Icon: Info },
  success: { label: 'OK', color: '#10B981', Icon: CheckCircle2 },
};

export function AdminLogs() {
  const { c, isDark } = useTheme();
  const [filter, setFilter] = useState<'all' | 'error' | 'warn' | 'info' | 'success'>('all');

  const filtered = filter === 'all' ? logData : logData.filter(l => l.level === filter);

  const counts = {
    error: logData.filter(l => l.level === 'error').length,
    warn: logData.filter(l => l.level === 'warn').length,
    info: logData.filter(l => l.level === 'info').length,
    success: logData.filter(l => l.level === 'success').length,
  };

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertOctagon size={15} style={{ color: c.primary }} />
          <h2 style={{ color: c.text, fontSize: '1.05rem', fontWeight: 700 }}>로그 / 오류 뷰어</h2>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
            style={{ background: c.card, border: `1px solid ${c.border}`, color: c.textSec, fontSize: '0.8rem' }}>
            <Download size={13} /> 내보내기
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
            style={{ background: c.primaryBg, border: `1px solid ${c.primaryBorder}`, color: c.primary, fontSize: '0.8rem' }}>
            <RefreshCw size={13} /> 새로고침
          </button>
        </div>
      </div>

      {/* Level filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'all', label: `전체 (${logData.length})`, color: c.textSec },
          { key: 'error', label: `오류 (${counts.error})`, color: '#EF4444' },
          { key: 'warn', label: `경고 (${counts.warn})`, color: '#F59E0B' },
          { key: 'info', label: `정보 (${counts.info})`, color: '#6366F1' },
          { key: 'success', label: `성공 (${counts.success})`, color: '#10B981' },
        ].map(({ key, label, color }) => (
          <button key={key}
            onClick={() => setFilter(key as any)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all"
            style={{
              background: filter === key ? `${color}18` : (isDark ? 'rgba(15,23,42,0.4)' : '#F8FAFC'),
              border: `1px solid ${filter === key ? `${color}40` : c.borderSoft}`,
              color: filter === key ? color : c.textMuted,
              fontSize: '0.78rem',
              fontWeight: filter === key ? 600 : 400,
            }}>
            <Filter size={10} />
            {label}
          </button>
        ))}
      </div>

      {/* Log table */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: c.card, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${c.border}`, background: isDark ? 'rgba(15,23,42,0.4)' : '#F8FAFC' }}>
                {['레벨', '시간', '메시지', '소스', '사용자'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left"
                    style={{ color: c.textMuted, fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((log, idx) => {
                const li = levelInfo[log.level];
                return (
                  <tr key={log.id}
                    style={{ borderBottom: idx < filtered.length - 1 ? `1px solid ${c.border}` : 'none' }}
                    className="transition-colors"
                    onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <li.Icon size={12} style={{ color: li.color }} />
                        <span style={{ color: li.color, fontSize: '0.68rem', fontWeight: 700, fontFamily: 'monospace' }}>{li.label}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span style={{ color: c.textMuted, fontSize: '0.72rem', fontFamily: 'monospace' }}>{log.time}</span>
                    </td>
                    <td className="px-4 py-2.5" style={{ maxWidth: '340px' }}>
                      <p style={{ color: c.text, fontSize: '0.78rem', lineHeight: 1.45 }}>{log.message}</p>
                    </td>
                    <td className="px-4 py-2.5">
                      <span style={{ color: c.textMuted, fontSize: '0.68rem', fontFamily: 'monospace' }}>{log.source}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="px-2 py-0.5 rounded-md"
                        style={{ background: c.badgeBg, color: c.textSec, fontSize: '0.68rem', fontFamily: 'monospace' }}>
                        {log.user}
                      </span>
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
