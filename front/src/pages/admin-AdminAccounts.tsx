import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Users, Shield, UserPlus, Search, MoreHorizontal, CheckCircle2, XCircle } from 'lucide-react';

const accounts = [
  { id: 1, name: '김관리', email: 'kim@pivotseoul.kr', role: 'superadmin', status: 'active' as const, lastLogin: '방금 전', created: '2024-01-15' },
  { id: 2, name: '이데이터', email: 'lee@pivotseoul.kr', role: 'datamanager', status: 'active' as const, lastLogin: '1시간 전', created: '2024-02-20' },
  { id: 3, name: '박콘텐츠', email: 'park@pivotseoul.kr', role: 'editor', status: 'active' as const, lastLogin: '3시간 전', created: '2024-03-10' },
  { id: 4, name: '최모니터', email: 'choi@pivotseoul.kr', role: 'viewer', status: 'active' as const, lastLogin: '어제', created: '2024-04-05' },
  { id: 5, name: '정테스터', email: 'jung@pivotseoul.kr', role: 'editor', status: 'inactive' as const, lastLogin: '2주 전', created: '2024-05-22' },
  { id: 6, name: '한분석', email: 'han@pivotseoul.kr', role: 'datamanager', status: 'active' as const, lastLogin: '2일 전', created: '2024-06-11' },
];

const roleInfo: Record<string, { label: string; color: string }> = {
  superadmin: { label: '슈퍼어드민', color: '#EF4444' },
  datamanager: { label: '데이터 관리자', color: '#6366F1' },
  editor: { label: '에디터', color: '#F59E0B' },
  viewer: { label: '뷰어', color: '#10B981' },
};

export function AdminAccounts() {
  const { c, isDark } = useTheme();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filtered = accounts.filter(a =>
    a.name.includes(search) || a.email.includes(search) || a.role.includes(search)
  );

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={15} style={{ color: c.primary }} />
          <h2 style={{ color: c.text, fontSize: '1.05rem', fontWeight: 700 }}>계정 / 권한 관리</h2>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl"
          style={{ background: 'linear-gradient(135deg, #6366F1, #818CF8)', color: 'white', fontSize: '0.82rem', fontWeight: 600, boxShadow: '0 0 14px rgba(99,102,241,0.3)' }}>
          <UserPlus size={14} /> 계정 추가
        </button>
      </div>

      {/* Role legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(roleInfo).map(([key, { label, color }]) => (
          <div key={key} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
            style={{ background: `${color}14`, border: `1px solid ${color}33` }}>
            <Shield size={11} style={{ color }} />
            <span style={{ color, fontSize: '0.72rem', fontWeight: 500 }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
        style={{ background: c.inputBg, border: `1px solid ${c.inputBorder}` }}>
        <Search size={14} style={{ color: c.textMuted }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="이름, 이메일, 역할로 검색..."
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
              {['이름', '이메일', '역할', '상태', '마지막 로그인', '가입일', ''].map(h => (
                <th key={h} className="px-5 py-3 text-left"
                  style={{ color: c.textMuted, fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((acc, idx) => {
              const role = roleInfo[acc.role];
              const isActive = acc.status === 'active';
              return (
                <tr key={acc.id}
                  style={{ borderBottom: idx < filtered.length - 1 ? `1px solid ${c.border}` : 'none' }}
                  className="transition-colors"
                  onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: `${role.color}20`, color: role.color, fontSize: '0.75rem', fontWeight: 700 }}>
                        {acc.name[0]}
                      </div>
                      <span style={{ color: c.text, fontSize: '0.85rem', fontWeight: 500 }}>{acc.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span style={{ color: c.textSec, fontSize: '0.8rem' }}>{acc.email}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 rounded-full"
                      style={{ background: `${role.color}18`, color: role.color, border: `1px solid ${role.color}33`, fontSize: '0.7rem' }}>
                      {role.label}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      {isActive
                        ? <CheckCircle2 size={13} style={{ color: c.success }} />
                        : <XCircle size={13} style={{ color: c.error }} />}
                      <span style={{ color: isActive ? c.success : c.error, fontSize: '0.78rem' }}>
                        {isActive ? '활성' : '비활성'}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span style={{ color: c.textSec, fontSize: '0.78rem' }}>{acc.lastLogin}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span style={{ color: c.textMuted, fontSize: '0.75rem' }}>{acc.created}</span>
                  </td>
                  <td className="px-5 py-3">
                    <button className="p-1.5 rounded-lg"
                      style={{ color: c.textMuted, background: c.badgeBg }}>
                      <MoreHorizontal size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add account modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-md rounded-2xl p-6 space-y-4" style={{ background: c.card, border: `1px solid ${c.cardBorder}`, boxShadow: '0 20px 60px rgba(0,0,0,0.35)' }}>
            <div className="flex items-center justify-between">
              <h3 style={{ color: c.text, fontSize: '1rem', fontWeight: 700 }}>새 계정 추가</h3>
              <button onClick={() => setShowModal(false)} style={{ color: c.textMuted }}>
                <XCircle size={18} />
              </button>
            </div>
            {[{ label: '이름', placeholder: '홍길동' }, { label: '이메일', placeholder: 'hong@pivotseoul.kr' }].map(f => (
              <div key={f.label}>
                <label style={{ color: c.textSec, fontSize: '0.8rem', display: 'block', marginBottom: '6px' }}>{f.label}</label>
                <input placeholder={f.placeholder} className="w-full px-3 py-2.5 rounded-xl outline-none"
                  style={{ background: c.inputBg, border: `1px solid ${c.inputBorder}`, color: c.text, fontSize: '0.88rem' }} />
              </div>
            ))}
            <div>
              <label style={{ color: c.textSec, fontSize: '0.8rem', display: 'block', marginBottom: '6px' }}>역할</label>
              <select className="w-full px-3 py-2.5 rounded-xl outline-none"
                style={{ background: c.inputBg, border: `1px solid ${c.inputBorder}`, color: c.text, fontSize: '0.88rem' }}>
                {Object.entries(roleInfo).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl"
                style={{ background: c.badgeBg, color: c.textSec, border: `1px solid ${c.border}`, fontSize: '0.88rem' }}>
                취소
              </button>
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl font-semibold"
                style={{ background: 'linear-gradient(135deg, #6366F1, #818CF8)', color: 'white', fontSize: '0.88rem' }}>
                추가하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
