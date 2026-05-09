import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { BellRing, Plus, Edit2, Trash2, XCircle, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

const initialNotices = [
  { id: 1, title: '5월 서울시 전월세 데이터 업데이트 완료', type: 'info' as const, status: 'published' as const, date: '2025-05-07', audience: '전체' },
  { id: 2, title: '청년 주거지원 정책 내용 반영 (2025 상반기)', type: 'update' as const, status: 'published' as const, date: '2025-05-05', audience: '청년기' },
  { id: 3, title: '서버 점검 안내 (5월 10일 02:00~04:00)', type: 'warning' as const, status: 'scheduled' as const, date: '2025-05-10', audience: '전체' },
  { id: 4, title: '신혼·출산기 보육비 지원 한도 상향 적용', type: 'update' as const, status: 'draft' as const, date: '2025-05-12', audience: '신혼·출산기' },
  { id: 5, title: '노년기 연금 수령 기준 모델 수정 예정', type: 'info' as const, status: 'draft' as const, date: '2025-05-15', audience: '노년기' },
];

export function AdminNotices() {
  const { c, isDark } = useTheme();
  const [notices, setNotices] = useState(initialNotices);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('info');
  const [newAudience, setNewAudience] = useState('전체');

  const typeInfo = {
    info: { label: '안내', color: c.primary, bg: c.primaryBg, border: c.primaryBorder, Icon: Info },
    update: { label: '업데이트', color: c.success, bg: c.successBg, border: c.successBorder, Icon: CheckCircle2 },
    warning: { label: '점검', color: c.warning, bg: c.warningBg, border: c.warningBorder, Icon: AlertTriangle },
  };

  const statusInfo = {
    published: { label: '게시됨', color: c.success },
    scheduled: { label: '예약됨', color: c.warning },
    draft: { label: '초안', color: c.textMuted },
  };

  const handleAdd = () => {
    if (!newTitle) return;
    setNotices(prev => [{
      id: Math.max(...prev.map(n => n.id)) + 1,
      title: newTitle,
      type: newType as 'info' | 'update' | 'warning',
      status: 'draft' as const,
      date: new Date().toISOString().slice(0, 10),
      audience: newAudience,
    }, ...prev]);
    setNewTitle('');
    setShowForm(false);
  };

  const handleDelete = (id: number) => setNotices(prev => prev.filter(n => n.id !== id));

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BellRing size={15} style={{ color: c.primary }} />
          <h2 style={{ color: c.text, fontSize: '1.05rem', fontWeight: 700 }}>공지 / 점검 관리</h2>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl"
          style={{ background: 'linear-gradient(135deg, #6366F1, #818CF8)', color: 'white', fontSize: '0.82rem', fontWeight: 600, boxShadow: '0 0 14px rgba(99,102,241,0.3)' }}>
          <Plus size={14} /> 공지 작성
        </button>
      </div>

      {/* Quick form */}
      {showForm && (
        <div className="rounded-2xl p-5 space-y-4"
          style={{ background: c.card, border: `1.5px solid ${c.primaryBorder}`, boxShadow: `0 0 20px ${c.primaryBg}` }}>
          <div className="flex items-center justify-between">
            <h3 style={{ color: c.text, fontSize: '0.92rem', fontWeight: 600 }}>새 공지 작성</h3>
            <button onClick={() => setShowForm(false)} style={{ color: c.textMuted }}><XCircle size={16} /></button>
          </div>
          <input
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="공지 제목 입력..."
            className="w-full px-4 py-2.5 rounded-xl outline-none"
            style={{ background: c.inputBg, border: `1px solid ${c.inputBorder}`, color: c.text, fontSize: '0.88rem' }}
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={{ color: c.textSec, fontSize: '0.78rem', display: 'block', marginBottom: '6px' }}>유형</label>
              <select value={newType} onChange={e => setNewType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl outline-none"
                style={{ background: c.inputBg, border: `1px solid ${c.inputBorder}`, color: c.text, fontSize: '0.85rem' }}>
                <option value="info">안내</option>
                <option value="update">업데이트</option>
                <option value="warning">점검</option>
              </select>
            </div>
            <div>
              <label style={{ color: c.textSec, fontSize: '0.78rem', display: 'block', marginBottom: '6px' }}>대상</label>
              <select value={newAudience} onChange={e => setNewAudience(e.target.value)}
                className="w-full px-3 py-2 rounded-xl outline-none"
                style={{ background: c.inputBg, border: `1px solid ${c.inputBorder}`, color: c.text, fontSize: '0.85rem' }}>
                {['전체', '청년기', '신혼·출산기', '노년기'].map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl"
              style={{ background: c.badgeBg, color: c.textSec, border: `1px solid ${c.border}`, fontSize: '0.85rem' }}>취소</button>
            <button onClick={handleAdd} className="flex-1 py-2.5 rounded-xl font-semibold"
              style={{ background: 'linear-gradient(135deg, #6366F1, #818CF8)', color: 'white', fontSize: '0.85rem' }}>등록 (초안)</button>
          </div>
        </div>
      )}

      {/* Notices list */}
      <div className="space-y-2">
        {notices.map(notice => {
          const ti = typeInfo[notice.type];
          const si = statusInfo[notice.status];
          return (
            <div key={notice.id}
              className="flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all"
              style={{ background: c.card, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: ti.bg, border: `1px solid ${ti.border}` }}>
                <ti.Icon size={14} style={{ color: ti.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p style={{ color: c.text, fontSize: '0.88rem', fontWeight: 500 }}>{notice.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span style={{ color: c.textMuted, fontSize: '0.68rem' }}>{notice.date}</span>
                  <span style={{ color: c.textMuted, fontSize: '0.68rem' }}>·</span>
                  <span style={{ color: c.textMuted, fontSize: '0.68rem' }}>대상: {notice.audience}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2 py-0.5 rounded-full"
                  style={{ background: `${si.color}18`, color: si.color, border: `1px solid ${si.color}30`, fontSize: '0.68rem' }}>
                  {si.label}
                </span>
                <span className="px-2 py-0.5 rounded-full"
                  style={{ background: ti.bg, color: ti.color, border: `1px solid ${ti.border}`, fontSize: '0.68rem' }}>
                  {ti.label}
                </span>
                <button className="p-1.5 rounded-lg" style={{ color: c.textMuted, background: c.badgeBg }}>
                  <Edit2 size={12} />
                </button>
                <button className="p-1.5 rounded-lg" onClick={() => handleDelete(notice.id)}
                  style={{ color: c.error, background: c.errorBg }}>
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
