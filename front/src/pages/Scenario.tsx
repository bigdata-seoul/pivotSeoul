import { useState, useRef } from 'react';
import type { ElementType } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowRight, GitCompare, MapPin, Home, Clock, Baby, FileText,
  Minimize2, TrendingUp, TrendingDown, RefreshCw
} from 'lucide-react';
import { usePivot, type ScenarioConditions, type RiskAnalysis } from '../context/PivotContext';
import { useTheme, type ThemeColors } from '../context/ThemeContext';
import { GaugeChart } from '../components/GaugeChart';

const SEOUL_DISTRICTS = ['강남구','강동구','강북구','강서구','관악구','광진구','구로구','금천구','노원구','도봉구','동대문구','동작구','마포구','서대문구','서초구','성동구','성북구','송파구','양천구','영등포구','용산구','은평구','종로구','중구','중랑구'];

// ── Sub-components (top-level to avoid re-mount on parent re-render) ──

interface SliderRowProps {
  label: string;
  icon: ElementType;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
  color?: string;
  c: ThemeColors;
}

function SliderRow({ label, icon: Icon, value, min, max, step, unit, onChange, color = '#6366F1', c }: SliderRowProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Icon size={13} style={{ color }} />
          <span style={{ color: c.textSec, fontSize: '0.8rem' }}>{label}</span>
        </div>
        <span style={{ color: c.text, fontSize: '0.9rem', fontWeight: 600 }}>{value.toLocaleString()}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1 rounded-full appearance-none cursor-pointer"
        style={{ background: `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, ${c.borderSoft} ${pct}%, ${c.borderSoft} 100%)`, outline: 'none' }}
      />
      <div className="flex justify-between">
        <span style={{ color: c.textMuted, fontSize: '0.62rem' }}>{min}{unit}</span>
        <span style={{ color: c.textMuted, fontSize: '0.62rem' }}>{max}{unit}</span>
      </div>
    </div>
  );
}

interface ToggleRowProps {
  label: string;
  icon: ElementType;
  value: boolean;
  onChange: (v: boolean) => void;
  benefit?: string;
  c: ThemeColors;
}

function ToggleRow({ label, icon: Icon, value, onChange, benefit, c }: ToggleRowProps) {
  return (
    <div
      className="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200"
      style={{ background: value ? c.primaryBg : (c.isDark ? 'rgba(15,23,42,0.4)' : '#F8FAFC'), border: `1px solid ${value ? c.primaryBorder : c.borderSoft}` }}
      onClick={() => onChange(!value)}
    >
      <div className="flex items-center gap-2">
        <Icon size={14} style={{ color: value ? c.primary : c.textMuted }} />
        <div>
          <span style={{ color: value ? c.text : c.textSec, fontSize: '0.82rem' }}>{label}</span>
          {benefit && value && <p style={{ color: c.success, fontSize: '0.68rem' }}>{benefit}</p>}
        </div>
      </div>
      <div className="w-9 h-5 rounded-full flex items-center px-0.5 transition-all duration-300"
        style={{ background: value ? c.primary : c.borderSoft }}>
        <div className="w-4 h-4 rounded-full transition-all duration-300"
          style={{ background: 'white', transform: value ? 'translateX(16px)' : 'translateX(0)', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
      </div>
    </div>
  );
}

// Card props (passed from parent to avoid re-mount)
interface ScenarioCardProps {
  isB: boolean;
  scenario: ScenarioConditions;
  risk: RiskAnalysis;
  lifeStage: string | null;
  update: (updates: Partial<ScenarioConditions>) => void;
  c: ThemeColors;
}

function ScenarioCard({ isB, scenario, risk, lifeStage, update, c }: ScenarioCardProps) {
  const accentColor = isB ? c.success : c.primary;
  const label = isB ? 'B' : 'A';
  const sublabel = isB ? '바꿔보는 조건' : '현재 조건';

  const statusStyle = (s: 'safe' | 'warning' | 'danger') => {
    if (s === 'safe') return { bg: c.successBg, color: c.success, border: c.successBorder };
    if (s === 'warning') return { bg: c.warningBg, color: c.warning, border: c.warningBorder };
    return { bg: c.errorBg, color: c.error, border: c.errorBorder };
  };
  const statusLabel = (s: 'safe' | 'warning' | 'danger') => s === 'safe' ? '안전' : s === 'warning' ? '경계' : '위험';

  return (
    <div className="rounded-2xl p-4 md:p-5 space-y-3 md:space-y-4"
      style={{ background: c.card, border: `1px solid ${isB ? c.successBorder : c.primaryBorder}`, boxShadow: c.cardShadow, height: '100%' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-0.5 rounded-lg font-bold"
            style={{ background: isB ? c.successBg : c.primaryBg, color: accentColor, border: `1px solid ${isB ? c.successBorder : c.primaryBorder}`, fontSize: '0.88rem' }}>
            {label}
          </div>
          <h3 style={{ color: c.text, fontSize: '0.95rem', fontWeight: 600 }}>{sublabel}</h3>
        </div>
        <div className="px-2.5 py-1 rounded-full"
          style={{ background: statusStyle(risk.status).bg, color: statusStyle(risk.status).color, border: `1px solid ${statusStyle(risk.status).border}`, fontSize: '0.72rem', fontWeight: 500 }}>
          {statusLabel(risk.status)} · {risk.overallScore}점
        </div>
      </div>

      {/* District */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <MapPin size={13} style={{ color: accentColor }} />
          <span style={{ color: c.textSec, fontSize: '0.8rem' }}>자치구</span>
        </div>
        <select value={scenario.district} onChange={e => update({ district: e.target.value })}
          className="w-full px-3 py-2 rounded-xl outline-none appearance-none cursor-pointer"
          style={{ background: c.inputBg, border: `1px solid ${c.inputBorder}`, color: c.text, fontSize: '0.88rem' }}>
          {SEOUL_DISTRICTS.map(d => (
            <option key={d} value={d} style={{ background: c.isDark ? '#1E293B' : '#fff' }}>{d}</option>
          ))}
        </select>
      </div>

      <SliderRow label="월 주거비" icon={Home} value={scenario.monthlyHousing} min={30} max={300} step={5} unit="만원" onChange={v => update({ monthlyHousing: v })} color={accentColor} c={c} />
      <SliderRow label="편도 통근 시간" icon={Clock} value={scenario.commuteTime} min={10} max={120} step={5} unit="분" onChange={v => update({ commuteTime: v })} color={scenario.commuteTime > 70 ? c.error : accentColor} c={c} />
      {lifeStage === 'family' && (
        <SliderRow label="월 보육비" icon={Baby} value={scenario.childcareCost} min={0} max={150} step={5} unit="만원" onChange={v => update({ childcareCost: v })} color={c.warning} c={c} />
      )}

      <ToggleRow label="정책 신청 (서울형 지원금)" icon={FileText} value={scenario.applyPolicy} onChange={v => update({ applyPolicy: v })} benefit="월 최대 30만원 지원 적용" c={c} />
      <ToggleRow label="다운사이징 (면적 축소)" icon={Minimize2} value={scenario.downsizing} onChange={v => update({ downsizing: v })} benefit="주거비 20~30% 절감 예상" c={c} />

      {/* Gauge + mini stats */}
      <div className="pt-1 rounded-xl" style={{ background: c.isDark ? 'rgba(15,23,42,0.35)' : '#F8FAFC', border: `1px solid ${c.borderSoft}` }}>
        <div className="flex justify-center py-2">
          <GaugeChart score={risk.overallScore} size={120} />
        </div>
        <div className="grid grid-cols-3 gap-2 px-3 pb-3 text-center">
          {[
            { label: '주거비율', value: `${risk.housingRatio.toFixed(0)}%`, color: c.text },
            { label: '월 잔여', value: `${risk.monthlySurplus > 0 ? '+' : ''}${risk.monthlySurplus}만`, color: risk.monthlySurplus > 0 ? c.success : c.error },
            { label: '통근', value: `${scenario.commuteTime}분`, color: c.text },
          ].map(m => (
            <div key={m.label}>
              <div style={{ color: c.textMuted, fontSize: '0.58rem' }}>{m.label}</div>
              <div style={{ color: m.color, fontSize: '0.8rem', fontWeight: 600 }}>{m.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Scenario component ──

function DiffBadge({ a, b, unit, lowerIsBetter = true, c }: { a: number; b: number; unit: string; lowerIsBetter?: boolean; c: ThemeColors }) {
  const diff = b - a;
  if (Math.abs(diff) < 1) return <span style={{ color: c.textMuted, fontSize: '0.72rem' }}>변화 없음</span>;
  const isImproved = lowerIsBetter ? diff < 0 : diff > 0;
  return (
    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full"
      style={{ background: isImproved ? c.successBg : c.errorBg, color: isImproved ? c.success : c.error, fontSize: '0.7rem', border: `1px solid ${isImproved ? c.successBorder : c.errorBorder}` }}>
      {isImproved ? <TrendingDown size={10} /> : <TrendingUp size={10} />}
      {Math.abs(diff).toLocaleString()}{unit} {isImproved ? '개선' : '악화'}
    </span>
  );
}

export function Scenario() {
  const navigate = useNavigate();
  const { profile, scenarioA, scenarioB, updateScenarioA, updateScenarioB, calculateRisk } = usePivot();
  const { c, isDark } = useTheme();
  const [mobileCard, setMobileCard] = useState<'A' | 'B'>('A');
  const scrollRef = useRef<HTMLDivElement>(null);

  const riskA = calculateRisk(scenarioA, profile.monthlyIncome);
  const riskB = calculateRisk(scenarioB, profile.monthlyIncome);

  const scrollToCard = (card: 'A' | 'B') => {
    setMobileCard(card);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: card === 'B' ? scrollRef.current.offsetWidth : 0, behavior: 'smooth' });
    }
  };

  const diffItems = [
    { label: '월 주거비', a: scenarioA.monthlyHousing, b: scenarioB.monthlyHousing, unit: '만원', lower: true },
    { label: '편도 통근', a: scenarioA.commuteTime, b: scenarioB.commuteTime, unit: '분', lower: true },
    { label: '월 보육비', a: scenarioA.childcareCost, b: scenarioB.childcareCost, unit: '만원', lower: true },
    { label: '리스크 점수', a: riskA.overallScore, b: riskB.overallScore, unit: '점', lower: true },
  ];

  return (
    <div className="h-full overflow-y-auto scrollbar-none p-4 md:p-6 space-y-4 md:space-y-5">

      {/* Header */}
      <div className="flex items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GitCompare size={14} style={{ color: c.primary }} />
            <span style={{ color: c.textSec, fontSize: '0.73rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              A/B 시나리오 설정
            </span>
          </div>
          <h2 style={{ color: c.text, fontSize: 'clamp(1rem, 3vw, 1.22rem)', fontWeight: 700, letterSpacing: '-0.01em' }}>
            두 조건을 비교하고 최선의 선택을 찾아보세요
          </h2>
        </div>
        <button onClick={() => navigate('/results')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all shrink-0"
          style={{ background: 'linear-gradient(135deg, #6366F1, #818CF8)', color: 'white', fontSize: '0.82rem', boxShadow: '0 0 16px rgba(99,102,241,0.3)' }}>
          결과 보기 <ArrowRight size={14} />
        </button>
      </div>

      {/* ── Mobile: swipeable cards ── */}
      <div className="md:hidden">
        {/* Tab pills */}
        <div className="flex gap-2 mb-3">
          {(['A', 'B'] as const).map(card => (
            <button key={card} onClick={() => scrollToCard(card)}
              className="flex-1 py-2.5 rounded-xl font-semibold transition-all"
              style={{
                background: mobileCard === card ? (card === 'A' ? c.primaryBg : c.successBg) : (isDark ? 'rgba(15,23,42,0.4)' : '#F8FAFC'),
                color: mobileCard === card ? (card === 'A' ? c.primary : c.success) : c.textMuted,
                border: `1.5px solid ${mobileCard === card ? (card === 'A' ? c.primaryBorder : c.successBorder) : c.borderSoft}`,
                fontSize: '0.85rem',
              }}>
              시나리오 {card} {card === 'A' ? '(현재)' : '(변경)'}
            </button>
          ))}
        </div>

        {/* Snap scroll container */}
        <div ref={scrollRef}
          className="flex overflow-x-auto gap-3"
          style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
          onScroll={e => {
            const el = e.currentTarget;
            const idx = Math.round(el.scrollLeft / el.offsetWidth);
            setMobileCard(idx === 0 ? 'A' : 'B');
          }}
        >
          <div style={{ minWidth: '100%', scrollSnapAlign: 'center' }}>
            <ScenarioCard isB={false} scenario={scenarioA} risk={riskA} lifeStage={profile.lifeStage} update={updateScenarioA} c={c} />
          </div>
          <div style={{ minWidth: '100%', scrollSnapAlign: 'center' }}>
            <ScenarioCard isB={true} scenario={scenarioB} risk={riskB} lifeStage={profile.lifeStage} update={updateScenarioB} c={c} />
          </div>
        </div>

        {/* Swipe dots */}
        <div className="flex justify-center gap-2 mt-3">
          {(['A', 'B'] as const).map(card => (
            <div key={card} className="rounded-full transition-all duration-300"
              style={{ width: mobileCard === card ? '20px' : '6px', height: '6px', background: mobileCard === card ? c.primary : c.borderSoft }} />
          ))}
        </div>
      </div>

      {/* ── Desktop: side-by-side ── */}
      <div className="hidden md:grid md:grid-cols-2 gap-4">
        <ScenarioCard isB={false} scenario={scenarioA} risk={riskA} lifeStage={profile.lifeStage} update={updateScenarioA} c={c} />
        <ScenarioCard isB={true} scenario={scenarioB} risk={riskB} lifeStage={profile.lifeStage} update={updateScenarioB} c={c} />
      </div>

      {/* ── Diff Summary ── */}
      <div className="rounded-2xl p-4 md:p-5"
        style={{ background: c.card, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow }}>
        <div className="flex items-center gap-2 mb-4">
          <RefreshCw size={13} style={{ color: c.primary }} />
          <span style={{ color: c.textSec, fontSize: '0.73rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            A → B 변화 요약
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {diffItems.map(({ label, a, b, unit, lower }) => (
            <div key={label} className="p-3 rounded-xl"
              style={{ background: isDark ? 'rgba(15,23,42,0.5)' : '#F8FAFC', border: `1px solid ${c.borderSoft}` }}>
              <p style={{ color: c.textMuted, fontSize: '0.68rem', marginBottom: '6px' }}>{label}</p>
              <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                <span style={{ color: c.textSec, fontSize: '0.83rem' }}>{a}{unit}</span>
                <span style={{ color: c.textMuted, fontSize: '0.62rem' }}>→</span>
                <span style={{ color: c.text, fontSize: '0.83rem', fontWeight: 600 }}>{b}{unit}</span>
              </div>
              <DiffBadge a={a} b={b} unit={unit} lowerIsBetter={lower} c={c} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}