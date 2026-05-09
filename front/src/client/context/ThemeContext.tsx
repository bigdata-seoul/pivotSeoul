import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ThemeColors {
  isDark: boolean;
  bg: string;
  bgGradient: string;
  surface: string;
  card: string;
  cardBorder: string;
  cardShadow: string;
  text: string;
  textSec: string;
  textMuted: string;
  primary: string;
  primaryHover: string;
  primaryBg: string;
  primaryBorder: string;
  accent: string;
  border: string;
  borderSoft: string;
  sidebarBg: string;
  sidebarBorder: string;
  headerBg: string;
  headerBorder: string;
  inputBg: string;
  inputBorder: string;
  success: string;
  successBg: string;
  successBorder: string;
  warning: string;
  warningBg: string;
  warningBorder: string;
  error: string;
  errorBg: string;
  errorBorder: string;
  chartGrid: string;
  chartAxis: string;
  badgeBg: string;
  hoverBg: string;
}

const darkColors: ThemeColors = {
  isDark: true,
  bg: '#0F172A',
  bgGradient: 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(99,102,241,0.18) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(129,140,248,0.10) 0%, transparent 60%)',
  surface: 'rgba(30,41,59,0.75)',
  card: 'rgba(30,41,59,0.75)',
  cardBorder: 'rgba(99,102,241,0.15)',
  cardShadow: '0 4px 24px rgba(0,0,0,0.3)',
  text: '#F1F5F9',
  textSec: '#94A3B8',
  textMuted: '#475569',
  primary: '#6366F1',
  primaryHover: '#818CF8',
  primaryBg: 'rgba(99,102,241,0.15)',
  primaryBorder: 'rgba(99,102,241,0.35)',
  accent: '#A5B4FC',
  border: 'rgba(99,102,241,0.18)',
  borderSoft: 'rgba(51,65,85,0.55)',
  sidebarBg: 'rgba(15,23,42,0.92)',
  sidebarBorder: 'rgba(99,102,241,0.18)',
  headerBg: 'rgba(15,23,42,0.82)',
  headerBorder: 'rgba(99,102,241,0.15)',
  inputBg: 'rgba(15,23,42,0.65)',
  inputBorder: 'rgba(99,102,241,0.22)',
  success: '#10B981',
  successBg: 'rgba(16,185,129,0.12)',
  successBorder: 'rgba(16,185,129,0.3)',
  warning: '#F59E0B',
  warningBg: 'rgba(245,158,11,0.12)',
  warningBorder: 'rgba(245,158,11,0.3)',
  error: '#EF4444',
  errorBg: 'rgba(239,68,68,0.12)',
  errorBorder: 'rgba(239,68,68,0.3)',
  chartGrid: 'rgba(51,65,85,0.45)',
  chartAxis: '#475569',
  badgeBg: 'rgba(51,65,85,0.6)',
  hoverBg: 'rgba(99,102,241,0.08)',
};

const lightColors: ThemeColors = {
  isDark: false,
  bg: '#F1F5F9',
  bgGradient: 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(99,102,241,0.06) 0%, transparent 70%)',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  cardBorder: '#E2E8F0',
  cardShadow: '0 1px 8px rgba(15,23,42,0.08), 0 0 0 1px rgba(15,23,42,0.04)',
  text: '#0F172A',
  textSec: '#475569',
  textMuted: '#94A3B8',
  primary: '#6366F1',
  primaryHover: '#4F46E5',
  primaryBg: 'rgba(99,102,241,0.08)',
  primaryBorder: 'rgba(99,102,241,0.25)',
  accent: '#6366F1',
  border: '#E2E8F0',
  borderSoft: '#F1F5F9',
  sidebarBg: 'rgba(255,255,255,0.97)',
  sidebarBorder: '#E2E8F0',
  headerBg: 'rgba(255,255,255,0.97)',
  headerBorder: '#E2E8F0',
  inputBg: '#F8FAFC',
  inputBorder: '#CBD5E1',
  success: '#059669',
  successBg: 'rgba(5,150,105,0.08)',
  successBorder: 'rgba(5,150,105,0.22)',
  warning: '#D97706',
  warningBg: 'rgba(217,119,6,0.08)',
  warningBorder: 'rgba(217,119,6,0.22)',
  error: '#DC2626',
  errorBg: 'rgba(220,38,38,0.08)',
  errorBorder: 'rgba(220,38,38,0.22)',
  chartGrid: '#E2E8F0',
  chartAxis: '#94A3B8',
  badgeBg: '#F1F5F9',
  hoverBg: 'rgba(99,102,241,0.04)',
};

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  c: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('pivotseoul-theme');
    return stored !== null ? stored === 'dark' : true;
  });

  useEffect(() => {
    localStorage.setItem('pivotseoul-theme', isDark ? 'dark' : 'light');
    document.documentElement.style.setProperty('--app-bg', isDark ? '#0F172A' : '#F1F5F9');
    document.body.style.background = isDark ? '#0F172A' : '#F1F5F9';
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);
  const c = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, c }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
