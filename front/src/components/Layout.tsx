import { Outlet, useNavigate, useLocation } from 'react-router';
import {
  LayoutDashboard, Users, GitCompare, BarChart3,
  Bell, Search, Sun, Moon, MapPin, ChevronRight, Settings, Shield
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { usePivot } from '../context/PivotContext';
import { useIsMobile } from './ui-use-mobile';

const navItems = [
  { icon: LayoutDashboard, label: '홈', path: '/', mobileLabel: '홈' },
  { icon: Users, label: '내 조건', path: '/stage', mobileLabel: '조건' },
  { icon: GitCompare, label: 'A/B 시나리오', path: '/scenario', mobileLabel: 'A/B' },
  { icon: BarChart3, label: '결과 분석', path: '/results', mobileLabel: '결과' },
  { icon: Settings, label: '설정', path: '/settings', mobileLabel: '설정' },
];

const lifeStageLabel: Record<string, string> = {
  youth: '청년기',
  family: '신혼·출산기',
  senior: '노년기',
};

// Which path does each nav item match (for active state)
function isNavActive(pathname: string, navPath: string) {
  if (navPath === '/') return pathname === '/';
  if (navPath === '/stage') return pathname === '/stage' || pathname.startsWith('/onboarding');
  return pathname === navPath;
}

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { c, isDark, toggleTheme } = useTheme();
  const { profile } = usePivot();
  const isMobile = useIsMobile();

  const pageTitle = () => {
    const p = location.pathname;
    if (p === '/') return '홈 대시보드';
    if (p === '/stage') return '생애 단계 선택';
    if (p.startsWith('/onboarding')) return '내 조건 입력';
    if (p === '/scenario') return 'A/B 시나리오';
    if (p === '/results') return '결과 분석';
    return '피벗서울';
  };

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ background: c.bg, transition: 'background 0.35s, color 0.35s' }}
    >
      {/* Background gradient overlay */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{ background: c.bgGradient }} />

      {/* ───── Desktop layout (md+) ───── */}
      <div className="hidden md:flex flex-1 min-h-0 overflow-hidden relative z-10">

        {/* Sidebar */}
        <aside
          className="w-16 flex flex-col items-center py-5 gap-4 shrink-0 border-r"
          style={{
            background: c.sidebarBg,
            borderColor: c.sidebarBorder,
            backdropFilter: 'blur(20px)',
            boxShadow: isDark ? 'none' : '2px 0 12px rgba(15,23,42,0.06)',
          }}
        >
          {/* Logo */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366F1, #818CF8)', boxShadow: '0 0 16px rgba(99,102,241,0.35)' }}
            onClick={() => navigate('/')}
          >
            <MapPin size={18} color="white" strokeWidth={2.5} />
          </div>

          {/* Nav items */}
          <div className="flex-1 flex flex-col gap-1 w-full px-2">
            {navItems.slice(0, 4).map((item) => {
              const active = isNavActive(location.pathname, item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="w-full h-10 rounded-xl flex items-center justify-center transition-all duration-200 relative group"
                  style={{
                    background: active ? c.primaryBg : 'transparent',
                    color: active ? c.primary : c.textMuted,
                    border: active ? `1px solid ${c.primaryBorder}` : '1px solid transparent',
                  }}
                  title={item.label}
                >
                  <item.icon size={18} />
                  {/* Tooltip */}
                  <span
                    className="absolute left-12 z-50 px-2 py-1 rounded-lg text-xs whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      background: c.card,
                      color: c.text,
                      border: `1px solid ${c.border}`,
                      boxShadow: c.cardShadow,
                      backdropFilter: 'blur(12px)',
                    }}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom: theme toggle */}
          <div className="flex flex-col gap-1 w-full px-2">
            <button
              onClick={toggleTheme}
              className="w-full h-10 rounded-xl flex items-center justify-center transition-all duration-200 group relative"
              style={{ color: c.textMuted }}
              title={isDark ? '라이트 모드' : '다크 모드'}
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
              <span
                className="absolute left-12 z-50 px-2 py-1 rounded-lg text-xs whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: c.card, color: c.text, border: `1px solid ${c.border}`, boxShadow: c.cardShadow }}
              >
                {isDark ? '라이트 모드' : '다크 모드'}
              </span>
            </button>
          </div>
        </aside>

        {/* Main content column */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Desktop Header */}
          <header
            className="h-14 flex items-center px-6 gap-4 shrink-0 border-b relative z-10"
            style={{
              background: c.headerBg,
              borderColor: c.headerBorder,
              backdropFilter: 'blur(20px)',
              boxShadow: isDark ? 'none' : '0 1px 8px rgba(15,23,42,0.06)',
            }}
          >
            <div className="flex items-center gap-2">
              <span style={{ color: c.primary, fontSize: '1.05rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
                피벗서울
              </span>
              <span style={{ color: c.textMuted, fontSize: '0.8rem' }}>·</span>
              <span style={{ color: c.textMuted, fontSize: '0.78rem' }}>Pivot Seoul</span>
              {profile.lifeStage && (
                <>
                  <ChevronRight size={12} style={{ color: c.textMuted }} />
                  <span
                    className="px-2 py-0.5 rounded-full"
                    style={{ background: c.primaryBg, color: c.accent, fontSize: '0.72rem', border: `1px solid ${c.primaryBorder}` }}
                  >
                    {lifeStageLabel[profile.lifeStage]}
                  </span>
                </>
              )}
            </div>

            {/* Search bar */}
            <div className="flex-1 max-w-sm mx-4">
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
                style={{ background: c.inputBg, border: `1px solid ${c.inputBorder}` }}
              >
                <Search size={13} style={{ color: c.textMuted }} />
                <input
                  placeholder="자치구, 정책, 시나리오 검색..."
                  className="bg-transparent flex-1 outline-none"
                  style={{ color: c.textSec, fontSize: '0.8rem' }}
                />
                <span
                  className="px-1.5 py-0.5 rounded"
                  style={{ background: c.badgeBg, color: c.textMuted, fontSize: '0.62rem' }}
                >
                  ⌘K
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <button
                className="w-8 h-8 rounded-lg flex items-center justify-center relative"
                style={{ background: c.primaryBg, color: c.textSec, border: `1px solid ${c.border}` }}
              >
                <Bell size={15} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: c.warning }} />
              </button>
              <button
                onClick={() => navigate('/admin/login')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all"
                style={{ background: c.primaryBg, color: c.textSec, border: `1px solid ${c.border}`, fontSize: '0.78rem' }}
                title="관리자 콘솔"
              >
                <Shield size={13} style={{ color: c.primary }} />
                <span className="hidden lg:inline">관리자</span>
              </button>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #6366F1, #818CF8)', color: 'white', fontSize: '0.8rem', fontWeight: 600 }}
              >
                {profile.name?.charAt(0) ?? '김'}
              </div>
            </div>
          </header>

          {/* Desktop page content */}
          <main
            className="flex-1 min-h-0 overflow-hidden"
            style={{ color: c.text }}
          >
            <Outlet />
          </main>
        </div>
      </div>

      {/* ───── Mobile layout (<md) ───── */}
      <div className="md:hidden flex flex-col flex-1 min-h-0 relative z-10">
        {/* Mobile Header */}
        <header
          className="flex items-center justify-between px-4 shrink-0 border-b sticky top-0 z-50"
          style={{
            height: '56px',
            background: c.headerBg,
            borderColor: c.headerBorder,
            backdropFilter: 'blur(20px)',
            boxShadow: isDark ? 'none' : '0 1px 8px rgba(15,23,42,0.06)',
          }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366F1, #818CF8)' }}
            >
              <MapPin size={14} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <span style={{ color: c.primary, fontSize: '0.95rem', fontWeight: 700, letterSpacing: '-0.01em' }}>피벗서울</span>
            </div>
          </div>

          {/* Page title */}
          <span style={{ color: c.textSec, fontSize: '0.82rem', fontWeight: 500 }}>{pageTitle()}</span>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: c.primaryBg, color: c.textSec, border: `1px solid ${c.border}` }}
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center relative"
              style={{ background: c.primaryBg, color: c.textSec, border: `1px solid ${c.border}` }}
            >
              <Bell size={15} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full" style={{ background: c.error }} />
            </button>
          </div>
        </header>

        {/* Mobile page content */}
        <main
          className="flex-1 min-h-0 overflow-hidden"
          style={{ color: c.text, paddingBottom: '72px' }}
        >
          <Outlet />
        </main>

        {/* Mobile Bottom Tab Bar */}
        <nav
          className="fixed bottom-0 left-0 right-0 border-t z-50 flex items-center"
          style={{
            height: '60px',
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            background: c.headerBg,
            borderColor: c.headerBorder,
            backdropFilter: 'blur(20px)',
            boxShadow: isDark ? '0 -1px 20px rgba(0,0,0,0.35)' : '0 -1px 12px rgba(15,23,42,0.08)',
          }}
        >
          {navItems.map((item) => {
            const active = isNavActive(location.pathname, item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1 transition-all duration-200"
                style={{ color: active ? c.primary : c.textMuted }}
              >
                <div
                  className="w-10 h-7 rounded-xl flex items-center justify-center transition-all duration-200"
                  style={{
                    background: active ? c.primaryBg : 'transparent',
                  }}
                >
                  <item.icon size={18} strokeWidth={active ? 2.5 : 1.8} />
                </div>
                <span
                  style={{
                    fontSize: '0.62rem',
                    fontWeight: active ? 600 : 400,
                    color: active ? c.primary : c.textMuted,
                  }}
                >
                  {item.mobileLabel}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}