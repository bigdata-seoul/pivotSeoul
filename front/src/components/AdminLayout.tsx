import { Outlet, useNavigate, useLocation } from 'react-router';
import {
  LayoutDashboard, Activity, Database, FileText, BellRing,
  AlertOctagon, Users, LogOut, Shield, Sun, Moon,
  ChevronDown, Bell, MapPin
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useEffect } from 'react';

const adminNav = [
  { icon: LayoutDashboard, label: '대시보드', path: '/admin' },
  { icon: Activity, label: '사용 현황', path: '/admin/monitoring' },
  { icon: Database, label: '데이터셋 관리', path: '/admin/datasets' },
  { icon: FileText, label: '콘텐츠 관리', path: '/admin/content' },
  { icon: BellRing, label: '공지/점검', path: '/admin/notices' },
  { icon: AlertOctagon, label: '로그/오류', path: '/admin/logs' },
  { icon: Users, label: '계정/권한', path: '/admin/accounts' },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme, c } = useTheme();

  // ── Auth guard ──
  useEffect(() => {
    const auth = localStorage.getItem('pivot-admin-auth');
    if (!auth) navigate('/admin/login', { replace: true });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('pivot-admin-auth');
    navigate('/admin/login');
  };

  const isActive = (path: string) => location.pathname === path || (path !== '/admin' && location.pathname.startsWith(path));

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: c.bg, transition: 'background 0.3s' }}>
      <div className="fixed inset-0 pointer-events-none" style={{ background: c.bgGradient }} />

      {/* Admin Sidebar */}
      <aside
        className="relative z-10 w-52 flex flex-col shrink-0 border-r"
        style={{ background: c.sidebarBg, borderColor: c.sidebarBorder, backdropFilter: 'blur(20px)', boxShadow: isDark ? 'none' : '2px 0 12px rgba(15,23,42,0.06)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-4 border-b" style={{ borderColor: c.sidebarBorder }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366F1, #818CF8)' }}>
            <MapPin size={14} color="white" />
          </div>
          <div>
            <div style={{ color: c.text, fontSize: '0.85rem', fontWeight: 700, lineHeight: 1.2 }}>피벗서울</div>
            <div style={{ color: c.textMuted, fontSize: '0.65rem' }}>Admin Console</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-0.5">
          {adminNav.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-200 text-left"
                style={{
                  background: active ? c.primaryBg : 'transparent',
                  color: active ? c.primary : c.textSec,
                  border: active ? `1px solid ${c.primaryBorder}` : '1px solid transparent',
                  fontWeight: active ? 600 : 400,
                  fontSize: '0.83rem',
                }}
              >
                <item.icon size={15} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t space-y-1" style={{ borderColor: c.sidebarBorder }}>
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-200"
            style={{ color: c.textSec, background: c.primaryBg, border: `1px solid ${c.primaryBorder}`, fontSize: '0.83rem' }}
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
            {isDark ? '라이트 모드' : '다크 모드'}
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-200"
            style={{ color: c.textSec, fontSize: '0.83rem' }}
          >
            <Shield size={15} />
            사용자 화면
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-200"
            style={{ color: c.error, fontSize: '0.83rem' }}
          >
            <LogOut size={15} />
            로그아웃
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Admin Header */}
        <header
          className="relative z-10 h-14 flex items-center px-5 gap-4 shrink-0 border-b"
          style={{ background: c.headerBg, borderColor: c.headerBorder, backdropFilter: 'blur(20px)', boxShadow: isDark ? 'none' : '0 1px 8px rgba(15,23,42,0.06)' }}
        >
          <div>
            <span style={{ color: c.textMuted, fontSize: '0.72rem' }}>관리자 콘솔 /</span>
            <span style={{ color: c.text, fontSize: '0.88rem', fontWeight: 600, marginLeft: 6 }}>
              {adminNav.find(n => isActive(n.path))?.label ?? '대시보드'}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: c.successBg, border: `1px solid ${c.successBorder}` }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: c.success }} />
              <span style={{ color: c.success, fontSize: '0.72rem' }}>시스템 정상</span>
            </div>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center relative" style={{ background: c.primaryBg, color: c.textSec }}>
              <Bell size={15} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: c.warning }} />
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl cursor-pointer" style={{ background: c.badgeBg, border: `1px solid ${c.border}` }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366F1, #818CF8)', color: 'white', fontSize: '0.65rem', fontWeight: 700 }}>A</div>
              <span style={{ color: c.textSec, fontSize: '0.8rem' }}>admin</span>
              <ChevronDown size={12} style={{ color: c.textMuted }} />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto" style={{ color: c.text }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}