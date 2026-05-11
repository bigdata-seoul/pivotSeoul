// src/pages/Scenario.tsx

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

/**
 * 서울 25개 자치구 목록
 * TODO: 추후 /api/districts API 연동으로 동적 로딩 전환
 *       DistrictSelector 컴포넌트 교체 시 제거
 */
const SEOUL_DISTRICTS = [
  '강남구','강동구','강북구','강서구','관악구','광진구','구로구','금천구',
  '노원구','도봉구','동대문구','동작구','마포구','서대문구','서초구',
  '성동구','성북구','송파구','양천구','영등포구','용산구','은평구',
  '종로구','중구','중랑구',
];

// ========================
// Sub-components
// 부모 리렌더링 시 재마운트 방지를 위해 파일 최상단에 정의
// ========================

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

/**
 * [서브 컴포넌트] 슬라이더 입력 행
 * 라벨 + 아이콘 + range 슬라이더 + 현재값/범위 표시를 하나의 행으로 제공
 */
function SliderRow({
  label, icon: Icon, value, min, max, step, unit, onChange,
  color = '#6366F1', c,
}: SliderRowProps) {
  // 슬라이더 채움 퍼센트 계산 (CSS background gradient에 활용)
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Icon size={13} style={{ color }} />
          <span style={{ color: c.textSec, fontSize: '0.8rem' }}>{label}</span>
        </div>
        <span style={{ color: c.text, fontSize: '0.9rem', fontWeight: 600 }}>
          {value.toLocaleString()}{unit}
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, ${c.borderSoft} ${pct}%, ${c.borderSoft} 100%)`,
          outline: 'none',
        }}
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
  /** 토글 ON 시 표시할 혜택 설명 문구 */
  benefit?: string;
  c: ThemeColors;
}

/**
 * [서브 컴포넌트] 토글 스위치 행
 * 정책 신청 / 다운사이징 등 boolean 옵션을 토글 UI로 표현
 */
function ToggleRow({ label, icon: Icon, value, onChange, benefit, c }: ToggleRowProps) {
  return (
    <div
      className="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200"
      style={{
        background: value ? c.primaryBg : (c.isDark ? 'rgba(15,23,42,0.4)' : '#F8FAFC'),
        border: `1px solid ${value ? c.primaryBorder : c.borderSoft}`,
      }}
      onClick={() => onChange(!value)}
    >
      <div className="flex items-center gap-2">
        <Icon size={14} style={{ color: value ? c.primary : c.textMuted }} />
        <div>
          <span style={{ color: value ? c.text : c.textSec, fontSize: '0.82rem' }}>{label}</span>
          {/* 토글 ON 상태에서만 혜택 안내 문구 표시 */}
          {benefit && value && (
            <p style={{ color: c.success, fontSize: '0.68rem' }}>{benefit}</p>
          )}
        </div>
      </div>
      {/* 커스텀 토글 스위치 */}
      <div
        className="w-9 h-5 rounded-full flex items-center px-0.5 transition-all duration-300"
        style={{ background: value ? c.primary : c.borderSoft }}
      >
        <div
          className="w-4 h-4 rounded-full transition-all duration-300"
          style={{
            background: 'white',
            transform: value ? 'translateX(16px)' : 'translateX(0)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
          }}
        />
      </div>
    </div>
  );
}

interface ScenarioCardProps {
  /** true면 B 카드(바꿔보는 조건), false면 A 카드(현재 조건) */
  isB: boolean;
  scenario: ScenarioConditions;
  risk: RiskAnalysis;
  /** 생애 단계 — 'family'일 때 보육비 슬라이더 표시 */
  lifeStage: string | null;
  update: (updates: Partial<ScenarioConditions>) => void;
  c: ThemeColors;
}

/**
 * [서브 컴포넌트] 시나리오 입력 카드 (A/B 공용)
 *
 * A 카드: 현재 조건 입력 (파란 계열 accent)
 * B 카드: 바꿔보는 조건 입력 (초록 계열 accent)
 *
 * TODO: PivotContext 의존성 제거 후 scenarioApi.ts 연동으로 전환 시
 *       update 콜백을 PATCH /api/scenarios/{scenarioId} 호출로 교체
 */
function ScenarioCard({ isB, scenario, risk, lifeStage, update, c }: ScenarioCardProps) {
  const accentColor = isB ? c.success : c.primary;
  const label = isB ? 'B' : 'A';
  const sublabel = isB ? '바꿔보는 조건' : '현재 조건';

  /** 리스크 상태별 스타일 반환 */
  const statusStyle = (s: 'safe' | 'warning' | 'danger') => {
    if (s === 'safe')    return { bg: c.successBg, color: c.success, border: c.successBorder };
    if (s === 'warning') return { bg: c.warningBg, color: c.warning, border: c.warningBorder };
    return               { bg: c.errorBg,   color: c.error,   border: c.errorBorder };
  };
  const statusLabel = (s: 'safe' | 'warning' | 'danger') =>
    s === 'safe' ? '안전' : s === 'warning' ? '경계' : '위험';

  return (
    <div
      className="rounded-2xl p-4 md:p-5 space-y-3 md:space-y-4"
      style={{
        background: c.card,
        border: `1px solid ${isB ? c.successBorder : c.primaryBorder}`,
        boxShadow: c.cardShadow,
        height: '100%',
      }}
    >
      {/* 카드 헤더 — 라벨 + 리스크 뱃지 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="px-2.5 py-0.5 rounded-lg font-bold"
            style={{
              background: isB ? c.successBg : c.primaryBg,
              color: accentColor,
              border: `1px solid ${isB ? c.successBorder : c.primaryBorder}`,
              fontSize: '0.88rem',
            }}
          >
            {label}
          </div>
          <h3 style={{ color: c.text, fontSize: '0.95rem', fontWeight: 600 }}>{sublabel}</h3>
        </div>
        {/* 리스크 상태 + 종합 점수 */}
        <div
          className="px-2.5 py-1 rounded-full"
          style={{
            background: statusStyle(risk.status).bg,
            color: statusStyle(risk.status).color,
            border: `1px solid ${statusStyle(risk.status).border}`,
            fontSize: '0.72rem',
            fontWeight: 500,
          }}
        >
          {statusLabel(risk.status)} · {risk.overallScore}점
        </div>
      </div>

      {/* 자치구 선택 드롭다운 */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <MapPin size={13} style={{ color: accentColor }} />
          <span style={{ color: c.textSec, fontSize: '0.8rem' }}>자치구</span>
        </div>
        <select
          value={scenario.district}
          onChange={e => update({ district: e.target.value })}
          className="w-full px-3 py-2 rounded-xl outline-none appearance-none cursor-pointer"
          style={{
            background: c.inputBg,
            border: `1px solid ${c.inputBorder}`,
            color: c.text,
            fontSize: '0.88rem',
          }}
        >
          {SEOUL_DISTRICTS.map(d => (
            <option key={d} value={d} style={{ background: c.isDark ? '#1E293B' : '#fff' }}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* 조건 변수 슬라이더 */}
      <SliderRow label="월 주거비" icon={Home} value={scenario.monthlyHousing} min={30} max={300} step={5} unit="만원" onChange={v => update({ monthlyHousing: v })} color={accentColor} c={c} />
      <SliderRow
        label="편도 통근 시간" icon={Clock}
        value={scenario.commuteTime} min={10} max={120} step={5} unit="분"
        onChange={v => update({ commuteTime: v })}
        // 통근 70분 초과 시 경고 색상으로 전환
        color={scenario.commuteTime > 70 ? c.error : accentColor}
        c={c}
      />
      {/* 생애 단계가 'family'일 때만 보육비 슬라이더 노출 */}
      {lifeStage === 'family' && (
        <SliderRow label="월 보육비" icon={Baby} value={scenario.childcareCost} min={0} max={150} step={5} unit="만원" onChange={v => update({ childcareCost: v })} color={c.warning} c={c} />
      )}

      {/* 정책/다운사이징 토글 */}
      <ToggleRow label="정책 신청 (서울형 지원금)" icon={FileText} value={scenario.applyPolicy} onChange={v => update({ applyPolicy: v })} benefit="월 최대 30만원 지원 적용" c={c} />
      <ToggleRow label="다운사이징 (면적 축소)" icon={Minimize2} value={scenario.downsizing} onChange={v => update({ downsizing: v })} benefit="주거비 20~30% 절감 예상" c={c} />

      {/* 게이지 차트 + 미니 통계 */}
      <div
        className="pt-1 rounded-xl"
        style={{
          background: c.isDark ? 'rgba(15,23,42,0.35)' : '#F8FAFC',
          border: `1px solid ${c.borderSoft}`,
        }}
      >
        <div className="flex justify-center py-2">
          <GaugeChart score={risk.overallScore} size={120} />
        </div>
        <div className="grid grid-cols-3 gap-2 px-3 pb-3 text-center">
          {[
            { label: '주거비율', value: `${risk.housingRatio.toFixed(0)}%`, color: c.text },
            {
              label: '월 잔여',
              value: `${risk.monthlySurplus > 0 ? '+' : ''}${risk.monthlySurplus}만`,
              color: risk.monthlySurplus > 0 ? c.success : c.error,
            },
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

// ========================
// DiffBadge — A → B 변화 방향 뱃지
// ========================

interface DiffBadgeProps {
  a: number;
  b: number;
  unit: string;
  /** true면 값이 낮을수록 개선 (주거비, 통근시간 등) */
  lowerIsBetter?: boolean;
  c: ThemeColors;
}

/**
 * [서브 컴포넌트] A → B 변화 방향 뱃지
 * 개선 여부에 따라 초록/빨강으로 색상 분기
 */
function DiffBadge({ a, b, unit, lowerIsBetter = true, c }: DiffBadgeProps) {
  const diff = b - a;

  // 변화량이 1 미만이면 변화 없음으로 표시
  if (Math.abs(diff) < 1) {
    return <span style={{ color: c.textMuted, fontSize: '0.72rem' }}>변화 없음</span>;
  }

  const isImproved = lowerIsBetter ? diff < 0 : diff > 0;

  return (
    <span
      className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full"
      style={{
        background: isImproved ? c.successBg : c.errorBg,
        color: isImproved ? c.success : c.error,
        fontSize: '0.7rem',
        border: `1px solid ${isImproved ? c.successBorder : c.errorBorder}`,
      }}
    >
      {isImproved ? <TrendingDown size={10} /> : <TrendingUp size={10} />}
      {Math.abs(diff).toLocaleString()}{unit} {isImproved ? '개선' : '악화'}
    </span>
  );
}

// ========================
// Main Page Component
// ========================

/**
 * [페이지] 시나리오 설정
 *
 * A/B 두 조건을 나란히 입력하고 실시간 리스크 비교를 제공하는 핵심 페이지.
 * - 모바일: 스냅 스크롤로 A/B 카드 전환
 * - 데스크탑: 좌우 2열 동시 표시
 * - 하단 diff 요약으로 A → B 변화량 한눈에 확인
 *
 * 현재 데이터 흐름: PivotContext (로컬 상태) 기반
 * TODO: scenarioApi.ts 연동으로 전환 시 아래 작업 필요
 *   - usePivot → useEffect + getScenario() 로 초기 데이터 로딩
 *   - updateScenarioA/B → debounce 후 PATCH /api/scenarios/{scenarioId} 호출
 *   - sessionId는 AuthContext 또는 URL params에서 주입
 */
export function Scenario() {
  const navigate = useNavigate();
  const { profile, scenarioA, scenarioB, updateScenarioA, updateScenarioB, calculateRisk } = usePivot();
  const { c, isDark } = useTheme();

  // 모바일에서 현재 표시 중인 카드 탭 상태 ('A' | 'B')
  const [mobileCard, setMobileCard] = useState<'A' | 'B'>('A');
  const scrollRef = useRef<HTMLDivElement>(null);

  // 각 시나리오의 리스크 지표 계산
  const riskA = calculateRisk(scenarioA, profile.monthlyIncome);
  const riskB = calculateRisk(scenarioB, profile.monthlyIncome);

  /** 모바일 탭 클릭 시 해당 카드로 스크롤 이동 */
  const scrollToCard = (card: 'A' | 'B') => {
    setMobileCard(card);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: card === 'B' ? scrollRef.current.offsetWidth : 0,
        behavior: 'smooth',
      });
    }
  };

  /** A → B 변화 요약 항목 목록 */
  const diffItems = [
    { label: '월 주거비',   a: scenarioA.monthlyHousing,  b: scenarioB.monthlyHousing,  unit: '만원', lower: true },
    { label: '편도 통근',   a: scenarioA.commuteTime,      b: scenarioB.commuteTime,      unit: '분',   lower: true },
    { label: '월 보육비',   a: scenarioA.childcareCost,    b: scenarioB.childcareCost,    unit: '만원', lower: true },
    { label: '리스크 점수', a: riskA.overallScore,         b: riskB.overallScore,         unit: '점',   lower: true },
  ];

  return (
    <div className="h-full overflow-y-auto scrollbar-none p-4 md:p-6 space-y-4 md:space-y-5">

      {/* 페이지 헤더 */}
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
        {/* 결과 보기 버튼 — /results 페이지로 이동 */}
        <button
          onClick={() => navigate('/results')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all shrink-0"
          style={{ background: 'linear-gradient(135deg, #6366F1, #818CF8)', color: 'white', fontSize: '0.82rem', boxShadow: '0 0 16px rgba(99,102,241,0.3)' }}
        >
          결과 보기 <ArrowRight size={14} />
        </button>
      </div>

      {/* ── 모바일: 스냅 스크롤 카드 ── */}
      <div className="md:hidden">
        {/* A/B 탭 버튼 */}
        <div className="flex gap-2 mb-3">
          {(['A', 'B'] as const).map(card => (
            <button
              key={card}
              onClick={() => scrollToCard(card)}
              className="flex-1 py-2.5 rounded-xl font-semibold transition-all"
              style={{
                background: mobileCard === card
                  ? (card === 'A' ? c.primaryBg : c.successBg)
                  : (isDark ? 'rgba(15,23,42,0.4)' : '#F8FAFC'),
                color: mobileCard === card
                  ? (card === 'A' ? c.primary : c.success)
                  : c.textMuted,
                border: `1.5px solid ${mobileCard === card
                  ? (card === 'A' ? c.primaryBorder : c.successBorder)
                  : c.borderSoft}`,
                fontSize: '0.85rem',
              }}
            >
              시나리오 {card} {card === 'A' ? '(현재)' : '(변경)'}
            </button>
          ))}
        </div>

        {/* 가로 스냅 스크롤 컨테이너 */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-3"
          style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
          onScroll={e => {
            const el = e.currentTarget;
            // 스크롤 위치로 현재 카드 탭 자동 동기화
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

        {/* 페이지 인디케이터 도트 */}
        <div className="flex justify-center gap-2 mt-3">
          {(['A', 'B'] as const).map(card => (
            <div
              key={card}
              className="rounded-full transition-all duration-300"
              style={{
                width: mobileCard === card ? '20px' : '6px',
                height: '6px',
                background: mobileCard === card ? c.primary : c.borderSoft,
              }}
            />
          ))}
        </div>
      </div>

      {/* ── 데스크탑: 2열 나란히 ── */}
      <div className="hidden md:grid md:grid-cols-2 gap-4">
        <ScenarioCard isB={false} scenario={scenarioA} risk={riskA} lifeStage={profile.lifeStage} update={updateScenarioA} c={c} />
        <ScenarioCard isB={true} scenario={scenarioB} risk={riskB} lifeStage={profile.lifeStage} update={updateScenarioB} c={c} />
      </div>

      {/* ── A → B 변화 요약 ── */}
      <div
        className="rounded-2xl p-4 md:p-5"
        style={{ background: c.card, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow }}
      >
        <div className="flex items-center gap-2 mb-4">
          <RefreshCw size={13} style={{ color: c.primary }} />
          <span style={{ color: c.textSec, fontSize: '0.73rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            A → B 변화 요약
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {diffItems.map(({ label, a, b, unit, lower }) => (
            <div
              key={label}
              className="p-3 rounded-xl"
              style={{ background: isDark ? 'rgba(15,23,42,0.5)' : '#F8FAFC', border: `1px solid ${c.borderSoft}` }}
            >
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
