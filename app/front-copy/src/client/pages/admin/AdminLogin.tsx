import { useState } from 'react';
import { useNavigate } from 'react-router';
import { MapPin, Lock, User, Eye, EyeOff, AlertCircle, Shield } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export function AdminLogin() {
  const navigate = useNavigate();
  const { c, isDark } = useTheme();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600)); // simulate
    if (id === 'admin' && pw === 'admin1234') {
      localStorage.setItem('pivot-admin-auth', 'true');
      navigate('/admin');
    } else {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
    setLoading(false);
  };

  return (
    <div
      className="h-screen overflow-hidden flex items-center justify-center p-4"
      style={{ background: c.bg }}
    >
      <div className="fixed inset-0 pointer-events-none" style={{ background: c.bgGradient }} />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
            style={{ background: 'linear-gradient(135deg, #6366F1, #818CF8)', boxShadow: '0 0 32px rgba(99,102,241,0.45)' }}
          >
            <MapPin size={26} color="white" strokeWidth={2.5} />
          </div>
          <h1 style={{ color: c.text, fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>피벗서울</h1>
          <div className="flex items-center gap-1.5 mt-1">
            <Shield size={12} style={{ color: c.primary }} />
            <span style={{ color: c.textMuted, fontSize: '0.78rem' }}>Admin Console</span>
          </div>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-7"
          style={{ background: c.card, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow }}
        >
          <h2 style={{ color: c.text, fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>관리자 로그인</h2>
          <p style={{ color: c.textMuted, fontSize: '0.78rem', marginBottom: '24px' }}>관리자 계정으로 로그인하세요</p>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* ID field */}
            <div>
              <label style={{ color: c.textSec, fontSize: '0.8rem', display: 'block', marginBottom: '6px' }}>아이디</label>
              <div
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
                style={{ background: c.inputBg, border: `1px solid ${id ? c.primaryBorder : c.inputBorder}`, transition: 'border-color 0.2s' }}
              >
                <User size={15} style={{ color: c.textMuted, flexShrink: 0 }} />
                <input
                  type="text"
                  value={id}
                  onChange={e => setId(e.target.value)}
                  placeholder="admin"
                  className="flex-1 bg-transparent outline-none"
                  style={{ color: c.text, fontSize: '0.9rem' }}
                  autoComplete="username"
                />
              </div>
            </div>

            {/* PW field */}
            <div>
              <label style={{ color: c.textSec, fontSize: '0.8rem', display: 'block', marginBottom: '6px' }}>비밀번호</label>
              <div
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
                style={{ background: c.inputBg, border: `1px solid ${pw ? c.primaryBorder : c.inputBorder}`, transition: 'border-color 0.2s' }}
              >
                <Lock size={15} style={{ color: c.textMuted, flexShrink: 0 }} />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={pw}
                  onChange={e => setPw(e.target.value)}
                  placeholder="비밀번호 입력"
                  className="flex-1 bg-transparent outline-none"
                  style={{ color: c.text, fontSize: '0.9rem' }}
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPw(p => !p)} style={{ color: c.textMuted }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                style={{ background: c.errorBg, border: `1px solid ${c.errorBorder}` }}
              >
                <AlertCircle size={14} style={{ color: c.error, flexShrink: 0 }} />
                <span style={{ color: c.error, fontSize: '0.8rem' }}>{error}</span>
              </div>
            )}

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold transition-all duration-200"
              style={{
                background: loading ? c.badgeBg : 'linear-gradient(135deg, #6366F1, #818CF8)',
                color: loading ? c.textMuted : 'white',
                fontSize: '0.92rem',
                boxShadow: loading ? 'none' : '0 0 20px rgba(99,102,241,0.4)',
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  로그인 중...
                </span>
              ) : '로그인'}
            </button>
          </form>

          {/* Demo hint */}
          <div
            className="mt-5 p-3 rounded-xl"
            style={{ background: isDark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.06)', border: `1px solid ${c.primaryBorder}` }}
          >
            <p style={{ color: c.accent, fontSize: '0.72rem', fontWeight: 600, marginBottom: '4px' }}>🔑 데모 계정</p>
            <p style={{ color: c.textSec, fontSize: '0.72rem' }}>아이디: <code style={{ color: c.primary }}>admin</code></p>
            <p style={{ color: c.textSec, fontSize: '0.72rem' }}>비밀번호: <code style={{ color: c.primary }}>admin1234</code></p>
          </div>
        </div>

        <p
          className="text-center mt-5 cursor-pointer"
          style={{ color: c.textMuted, fontSize: '0.78rem' }}
          onClick={() => navigate('/')}
        >
          ← 사용자 화면으로 돌아가기
        </p>
      </div>
    </div>
  );
}