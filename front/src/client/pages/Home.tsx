import { useNavigate } from 'react-router';
import {
  ArrowRight, Sparkles, MapPin, TrendingUp, ChevronRight,
  Zap, Baby, Sunset, Shield, BarChart3, Users
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { usePivot } from '../context/PivotContext';
import { useState } from 'react';

const seoulStats = [
  { label: '서울 평균 주거비율', value: '36%', status: 'warning' as const },
  { label: '평균 통근 시간', value: '48분', status: 'safe' as const },
  { label: '영아 보육비 지원', value: '월 50만', status: 'safe' as const },
  { label: '25개 자치구', value: '분석 가능', status: 'safe' as const },
];

const districtPreview = [
  { name: '강남구', rent: '↑ 고', risk: 'danger' as const },
  { name: '마포구', rent: '↗ 중상', risk: 'warning' as const },
  { name: '서초구', rent: '↑ 고', risk: 'danger' as const },
  { name: '성동구', rent: '↗ 중상', risk: 'warning' as const },
  { name: '노원구', rent: '↓ 저', risk: 'safe' as const },
  { name: '은평구', rent: '↓ 저', risk: 'safe' as const },
  { name: '송파구', rent: '→ 중', risk: 'warning' as const },
  { name: '강서구', rent: '↓ 저', risk: 'safe' as const },
  { name: '관악구', rent: '↓ 저', risk: 'safe' as const },
  { name: '용산구', rent: '↑ 고', risk: 'danger' as const },
  { name: '성북구', rent: '→ 중', risk: 'warning' as const },
  { name: '양천구', rent: '→ 중', risk: 'safe' as const },
];

const stageCards = [
  {
    id: 'youth',
    label: '청년기',
    sub: '20–35세',
    icon: Zap,
    color: '#6366F1',
    desc: '직장·자취·전세로 시작하는 서울 생활',
  },
  {
    id: 'family',
    label: '신혼·출산기',
    sub: '30–45세',
    icon: Baby,
    color: '#F59E0B',
    desc: '보육비·복직·주거의 삼중 압박 시기',
  },
  {
    id: 'senior',
    label: '노년기',
    sub: '55세 이상',
    icon: Sunset,
    color: '#10B981',
    desc: '노후 현금흐름과 다운사이징 전략',
  },
];

export function Home() {
  const navigate = useNavigate();
  const { c, isDark } = useTheme();
  const { profile } = usePivot();
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);

  const getRiskStyle = (risk: 'safe' | 'warning' | 'danger') => {
    if (risk === 'safe') return { bg: c.successBg, border: c.successBorder, text: c.success };
    if (risk === 'warning') return { bg: c.warningBg, border: c.warningBorder, text: c.warning };
    return { bg: c.errorBg, border: c.errorBorder, text: c.error };
  };

  const getStatStyle = (status: 'safe' | 'warning') =>
    status === 'warning'
      ? { color: c.warning }
      : { color: c.success };

  return (
    <div className="h-full overflow-y-auto scrollbar-none p-4 md:p-6 space-y-4 md:space-y-6">

      {/* ── Hero Banner ── */}
      <div
        className="relative rounded-2xl overflow-hidden p-5 md:p-8"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, rgba(99,102,241,0.22) 0%, rgba(30,41,59,0.85) 55%, rgba(129,140,248,0.12) 100%)'
            : 'linear-gradient(135deg, rgba(99,102,241,0.10) 0%, rgba(255,255,255,0.95) 55%, rgba(165,180,252,0.08) 100%)',
          border: `1px solid ${c.primaryBorder}`,
          boxShadow: c.cardShadow,
        }}
      >
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${c.primary} 1px, transparent 0)`,
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="max-w-lg">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3"
              style={{ background: c.primaryBg, border: `1px solid ${c.primaryBorder}`, color: c.accent, fontSize: '0.75rem' }}
            >
              <Sparkles size={12} />
              서울 생활 선택 시뮬레이터
            </div>

            <h1 style={{ color: c.text, fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 800, lineHeight: 1.25, letterSpacing: '-0.025em', marginBottom: '10px' }}>
              서울에서의 선택,<br />
              <span style={{ color: c.primary }}>바꿔보면 달라집니다</span>
            </h1>

            <p style={{ color: c.textSec, fontSize: '0.88rem', lineHeight: 1.65, marginBottom: '20px' }}>
              거주지·소득·통근·보육 조건을 입력하고 A/B 시나리오로<br className="hidden md:block" />
              당신의 서울 생활 전환점을 한눈에 확인하세요.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <button
                onClick={() => navigate('/stage')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 w-full sm:w-auto justify-center"
                style={{
                  background: 'linear-gradient(135deg, #6366F1, #818CF8)',
                  color: 'white',
                  fontSize: '0.9rem',
                  boxShadow: '0 0 20px rgba(99,102,241,0.4)',
                }}
              >
                내 조건으로 시뮬레이션하기
                <ArrowRight size={15} />
              </button>
              {profile.lifeStage && (
                <span
                  className="px-3 py-1.5 rounded-xl text-sm"
                  style={{ background: c.primaryBg, color: c.accent, border: `1px solid ${c.primaryBorder}` }}
                >
                  현재: {profile.lifeStage === 'youth' ? '청년기' : profile.lifeStage === 'family' ? '신혼·출산기' : '노년기'} 진행 중
                </span>
              )}
            </div>
          </div>

          {/* Stats mini grid — desktop only */}
          <div className="hidden lg:grid grid-cols-2 gap-2.5 shrink-0">
            {seoulStats.map((stat) => (
              <div
                key={stat.label}
                className="p-3 rounded-xl"
                style={{
                  background: isDark ? 'rgba(15,23,42,0.55)' : 'rgba(255,255,255,0.85)',
                  border: `1px solid ${c.border}`,
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div style={{ ...getStatStyle(stat.status), fontSize: '1.15rem', fontWeight: 700 }}>{stat.value}</div>
                <div style={{ color: c.textSec, fontSize: '0.68rem', lineHeight: 1.4 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile: Stats row ── */}
      <div className="grid grid-cols-2 gap-2 md:hidden">
        {seoulStats.map((stat) => (
          <div
            key={stat.label}
            className="p-3 rounded-xl"
            style={{ background: c.card, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow }}
          >
            <div style={{ ...getStatStyle(stat.status), fontSize: '1.05rem', fontWeight: 700 }}>{stat.value}</div>
            <div style={{ color: c.textMuted, fontSize: '0.65rem', lineHeight: 1.4 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── Life Stage Cards ── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Users size={14} style={{ color: c.primary }} />
          <span style={{ color: c.textSec, fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            생애 단계 선택
          </span>
        </div>

        {/* Mobile: horizontal scroll cards */}
        <div className="flex gap-3 overflow-x-auto pb-2 md:hidden" style={{ scrollbarWidth: 'none' }}>
          {stageCards.map((stage) => {
            const Icon = stage.icon;
            const isActive = hoveredStage === stage.id;
            return (
              <div
                key={stage.id}
                onClick={() => navigate('/stage')}
                className="flex-shrink-0 rounded-2xl p-4 cursor-pointer transition-all duration-300"
                style={{
                  width: '180px',
                  background: isActive ? (isDark ? `${stage.color}18` : `${stage.color}0D`) : c.card,
                  border: `1.5px solid ${isActive ? stage.color + '55' : c.cardBorder}`,
                  boxShadow: isActive ? `0 0 24px ${stage.color}30` : c.cardShadow,
                }}
                onMouseEnter={() => setHoveredStage(stage.id)}
                onMouseLeave={() => setHoveredStage(null)}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: isActive ? stage.color : (isDark ? 'rgba(51,65,85,0.5)' : '#F1F5F9') }}
                >
                  <Icon size={20} color={isActive ? 'white' : c.textMuted} />
                </div>
                <div style={{ color: c.text, fontSize: '0.95rem', fontWeight: 700 }}>{stage.label}</div>
                <div style={{ color: stage.color, fontSize: '0.72rem', marginBottom: '4px' }}>{stage.sub}</div>
                <p style={{ color: c.textSec, fontSize: '0.72rem', lineHeight: 1.5 }}>{stage.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Desktop: 3-column grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-4">
          {stageCards.map((stage) => {
            const Icon = stage.icon;
            const isActive = hoveredStage === stage.id;
            return (
              <div
                key={stage.id}
                onClick={() => navigate('/stage')}
                className="rounded-2xl p-5 cursor-pointer transition-all duration-300 group"
                style={{
                  background: isActive ? (isDark ? `${stage.color}15` : `${stage.color}08`) : c.card,
                  border: `1.5px solid ${isActive ? stage.color + '55' : c.cardBorder}`,
                  boxShadow: isActive ? `0 0 28px ${stage.color}28` : c.cardShadow,
                  transform: isActive ? 'translateY(-2px)' : 'none',
                }}
                onMouseEnter={() => setHoveredStage(stage.id)}
                onMouseLeave={() => setHoveredStage(null)}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: isActive ? stage.color : (isDark ? 'rgba(51,65,85,0.5)' : '#F1F5F9'), transition: 'all 0.3s' }}
                >
                  <Icon size={22} color={isActive ? 'white' : c.textMuted} />
                </div>
                <div style={{ color: c.text, fontSize: '1.05rem', fontWeight: 700, marginBottom: '2px' }}>{stage.label}</div>
                <div style={{ color: stage.color, fontSize: '0.78rem', marginBottom: '8px', fontWeight: 500 }}>{stage.sub}</div>
                <p style={{ color: c.textSec, fontSize: '0.82rem', lineHeight: 1.6, marginBottom: '14px' }}>{stage.desc}</p>
                <button
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl transition-all"
                  style={{
                    background: isActive ? stage.color : c.primaryBg,
                    color: isActive ? 'white' : c.primary,
                    border: `1px solid ${isActive ? stage.color : c.primaryBorder}`,
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    boxShadow: isActive ? `0 0 14px ${stage.color}40` : 'none',
                  }}
                >
                  선택하기 <ChevronRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Bottom row: District + How-to ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* District grid */}
        <div
          className="lg:col-span-2 rounded-2xl p-4 md:p-5"
          style={{ background: c.card, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MapPin size={14} style={{ color: c.primary }} />
              <span style={{ color: c.textSec, fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                서울 자치구 주거 부담 현황
              </span>
            </div>
            <div className="flex items-center gap-3" style={{ color: c.textMuted, fontSize: '0.65rem' }}>
              {(['safe', 'warning', 'danger'] as const).map((r) => (
                <span key={r} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full inline-block" style={{ background: getRiskStyle(r).text }} />
                  {r === 'safe' ? '안전' : r === 'warning' ? '경계' : '위험'}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-6 gap-1.5">
            {districtPreview.map((d) => {
              const s = getRiskStyle(d.risk);
              return (
                <div
                  key={d.name}
                  className="p-2 rounded-xl flex flex-col items-center justify-center gap-0.5"
                  style={{ background: s.bg, border: `1px solid ${s.border}` }}
                >
                  <span style={{ color: c.text, fontSize: '0.7rem', fontWeight: 500 }}>{d.name}</span>
                  <span style={{ color: s.text, fontSize: '0.6rem' }}>{d.rent}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* How-to card */}
        <div
          className="rounded-2xl p-4 md:p-5 flex flex-col gap-3"
          style={{ background: c.card, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow }}
        >
          <div className="flex items-center gap-2">
            <TrendingUp size={14} style={{ color: c.primary }} />
            <span style={{ color: c.textSec, fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              이용 방법
            </span>
          </div>

          {[
            { step: '01', text: '생애 단계 선택', icon: Users },
            { step: '02', text: '내 조건 입력 (소득·주거·통근)', icon: MapPin },
            { step: '03', text: 'A/B 시나리오 설정', icon: Shield },
            { step: '04', text: '결과 분석 & 회복 전략', icon: BarChart3 },
          ].map(({ step, text, icon: Icon }) => (
            <div
              key={step}
              className="flex items-center gap-3 px-2 py-1.5 rounded-xl cursor-default transition-all duration-200"
              style={{ background: hoveredStage === `step-${step}` ? (isDark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.06)') : 'transparent' }}
              onMouseEnter={() => setHoveredStage(`step-${step}`)}
              onMouseLeave={() => setHoveredStage(null)}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200"
                style={{
                  background: hoveredStage === `step-${step}` ? c.primary : c.primaryBg,
                  color: hoveredStage === `step-${step}` ? 'white' : c.primary,
                  fontSize: '0.62rem',
                  fontWeight: 700,
                }}
              >
                {step}
              </div>
              <span style={{ color: hoveredStage === `step-${step}` ? c.text : c.textSec, fontSize: '0.8rem', transition: 'color 0.2s' }}>{text}</span>
            </div>
          ))}

          <button
            onClick={() => navigate('/stage')}
            className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 rounded-xl transition-all duration-200"
            style={{
              background: hoveredStage === 'cta' ? 'linear-gradient(135deg, #4F46E5, #6366F1)' : 'linear-gradient(135deg, #6366F1, #818CF8)',
              color: 'white',
              fontSize: '0.85rem',
              fontWeight: 600,
              boxShadow: hoveredStage === 'cta' ? '0 0 24px rgba(99,102,241,0.5)' : '0 0 16px rgba(99,102,241,0.3)',
              transform: hoveredStage === 'cta' ? 'translateY(-1px)' : 'none',
            }}
            onMouseEnter={() => setHoveredStage('cta')}
            onMouseLeave={() => setHoveredStage(null)}
          >
            시뮬레이션 시작하기 <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}