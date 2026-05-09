import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Zap, Baby, Sunset, ArrowRight, CheckCircle2, ChevronLeft } from 'lucide-react';
import { usePivot, LifeStage } from '../context/PivotContext';
import { useTheme } from '../context/ThemeContext';

const stages = [
  {
    id: 'youth' as LifeStage,
    path: '/onboarding/youth',
    label: '청년기',
    sub: '20–35세',
    icon: Zap,
    color: '#6366F1',
    glow: 'rgba(99,102,241,0.3)',
    desc: '직장·자취·전세로 시작하는 서울 생활.\n첫 10년의 선택이 이후 삶의 방향을 결정합니다.',
    scenarios: ['자치구별 전월세 비교', '통근 vs 주거비 트레이드오프', '저축률 최적화', '청년 정책 혜택 분석'],
    stats: [
      { label: '서울 청년 주거비율', value: '41%', warn: true },
      { label: '평균 통근 시간', value: '52분', warn: false },
    ],
  },
  {
    id: 'family' as LifeStage,
    path: '/onboarding/family',
    label: '신혼·출산기',
    sub: '30–45세',
    icon: Baby,
    color: '#F59E0B',
    glow: 'rgba(245,158,11,0.3)',
    desc: '보육비·복직·주거의 삼중 압박 시기.\n자치구 이동과 정책 활용으로 숨통을 틔워보세요.',
    scenarios: ['보육비 부담 분석', '복직 시점별 현금흐름', '정책 지원금 수령', '자치구별 보육시설 비교'],
    stats: [
      { label: '보육비 가구 부담률', value: '18%', warn: true },
      { label: '복직 평균 시점', value: '14개월', warn: false },
    ],
  },
  {
    id: 'senior' as LifeStage,
    path: '/onboarding/senior',
    label: '노년기',
    sub: '55세 이상',
    icon: Sunset,
    color: '#10B981',
    glow: 'rgba(16,185,129,0.3)',
    desc: '안정적인 노후 현금흐름을 위한 준비.\n다운사이징과 자치구 재배치로 삶의 질을 지키세요.',
    scenarios: ['노후 현금흐름 시뮬레이션', '다운사이징 효과 분석', '연금 수령 최적화', '의료비 지출 예측'],
    stats: [
      { label: '서울 고령자 주거비율', value: '34%', warn: true },
      { label: '평균 연금 수령액', value: '98만원', warn: false },
    ],
  },
];

export function StageSelection() {
  const navigate = useNavigate();
  const { updateProfile } = usePivot();
  const { c, isDark } = useTheme();
  const [hoveredId, setHoveredId] = useState<LifeStage | null>(null);

  const handleSelect = (stage: LifeStage, path: string) => {
    updateProfile({ lifeStage: stage });
    navigate(path);
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-none p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/')} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all" style={{ background: c.card, border: `1px solid ${c.border}`, color: c.textSec }}>
          <ChevronLeft size={16} />
        </button>
        <div>
          <p style={{ color: c.textMuted, fontSize: '0.78rem' }}>STEP 1 / 5</p>
          <h2 style={{ color: c.text, fontSize: '1.3rem', fontWeight: 700, letterSpacing: '-0.01em' }}>나의 생애 단계를 선택하세요</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {stages.map((stage) => {
          const Icon = stage.icon;
          const isHovered = hoveredId === stage.id;

          return (
            <div
              key={stage.id}
              className="relative rounded-2xl p-6 cursor-pointer transition-all duration-300 group"
              style={{
                background: isHovered ? (isDark ? `${stage.color}18` : `${stage.color}0D`) : c.card,
                border: `2px solid ${isHovered ? stage.color + '55' : c.cardBorder}`,
                boxShadow: isHovered ? `0 0 32px ${stage.glow}` : c.cardShadow,
                transform: isHovered ? 'translateY(-2px)' : 'none',
              }}
              onClick={() => handleSelect(stage.id, stage.path)}
              onMouseEnter={() => setHoveredId(stage.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300"
                style={{ background: isHovered ? stage.color : (isDark ? 'rgba(51,65,85,0.5)' : '#F1F5F9'), boxShadow: isHovered ? `0 0 20px ${stage.glow}` : 'none' }}>
                <Icon size={26} color={isHovered ? 'white' : c.textMuted} />
              </div>

              <div style={{ color: c.text, fontSize: '1.15rem', fontWeight: 700, marginBottom: '2px' }}>{stage.label}</div>
              <div style={{ color: stage.color, fontSize: '0.8rem', marginBottom: '10px', fontWeight: 500 }}>{stage.sub}</div>
              <p style={{ color: c.textSec, fontSize: '0.83rem', lineHeight: 1.6, marginBottom: '16px', whiteSpace: 'pre-line' }}>{stage.desc}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {stage.stats.map((s) => (
                  <div key={s.label} className="p-2.5 rounded-xl" style={{ background: isDark ? 'rgba(15,23,42,0.4)' : '#F8FAFC', border: `1px solid ${s.warn ? c.warningBorder : c.border}` }}>
                    <div style={{ color: s.warn ? c.warning : c.text, fontSize: '1rem', fontWeight: 700 }}>{s.value}</div>
                    <div style={{ color: c.textMuted, fontSize: '0.65rem' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Scenario tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {stage.scenarios.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded-md" style={{ background: isDark ? 'rgba(15,23,42,0.5)' : '#F1F5F9', color: c.textMuted, fontSize: '0.68rem', border: `1px solid ${c.borderSoft}` }}>{s}</span>
                ))}
              </div>

              <button
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium transition-all duration-200"
                style={{
                  background: isHovered ? stage.color : c.primaryBg,
                  color: isHovered ? 'white' : c.primary,
                  border: `1px solid ${isHovered ? stage.color : c.primaryBorder}`,
                  fontSize: '0.88rem',
                  boxShadow: isHovered ? `0 0 16px ${stage.glow}` : 'none',
                }}
              >
                {isHovered ? '이 단계로 시작하기' : '선택하기'}
                <ArrowRight size={15} />
              </button>
            </div>
          );
        })}
      </div>

      <p style={{ color: c.textMuted, fontSize: '0.78rem', textAlign: 'center', marginTop: '20px' }}>
        언제든지 생애 단계를 변경할 수 있습니다. 현재 조건에 가장 가까운 단계를 선택하세요.
      </p>
    </div>
  );
}