import { useEffect, useState } from 'react';
import {
  Shield, AlertTriangle, XCircle, TrendingUp, TrendingDown,
  Home, Clock, Baby, DollarSign, MapPin, FileText,
  CheckCircle2, Circle, BarChart3, RefreshCw, Info
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, RadarChart, Radar,
  PolarGrid, PolarAngleAxis
} from 'recharts';
import { usePivot } from '../context/PivotContext';
import { useTheme } from '../context/ThemeContext';
import { GaugeChart } from '../components/GaugeChart';
import { getSimulationSession, SimulationSessionDetail } from '../lib/sessionApi';

/**
 * 이 파일은 시뮬레이션의 최종 결과 리포트 페이지를 담당합니다.
 * 
 * 비전공자를 위한 설명:
 * 사용자가 입력한 정보를 바탕으로 계산된 '성적표'와 같은 페이지입니다.
 * 현재 살고 있는 곳과 이사 갈 곳(또는 다른 시나리오)을 비교하여, 
 * 경제적 위험도는 어떤지, 현금 흐름은 어떻게 변하는지를 각종 차트와 그래프로 보여줍니다.
 */

// 현금 흐름(내 통장 잔고의 변화)을 가상으로 계산해보는 함수입니다.
function generateCashFlow(income: number, housing: number, childcare: number, applyPolicy: boolean, extraIncome: number, months = 12) {
  const policyBonus = applyPolicy ? 30 : 0; // 정책 지원금이 있다면 추가
  return Array.from({ length: months }, (_, i) => {
    const variation = Math.sin(i * 0.7) * 8; // 약간의 현실적인 변동폭 추가
    // 수입에서 주거비, 보육비, 생활비 등을 뺀 남는 돈(surplus)을 계산합니다.
    const surplus = income - housing - childcare - 130 + policyBonus + extraIncome + variation;
    // 매달 남는 돈이 쌓여가는 과정(cumulative)을 계산합니다.
    const cumulative = surplus * (i + 1) + variation * 5;
    return { month: `${i + 1}월`, surplus: Math.round(surplus), cumulative: Math.round(cumulative) };
  });
}

// 오각형 모양의 레이더 차트에 들어갈 비교 데이터입니다.
const districtRadarData = [
  { subject: '주거비', A: 80, B: 45 },
  { subject: '통근', A: 55, B: 75 },
  { subject: '보육', A: 70, B: 80 },
  { subject: '편의', A: 90, B: 55 },
  { subject: '정책', A: 40, B: 85 },
  { subject: '환경', A: 60, B: 75 },
];

export function Results() {
  const { profile, scenarioA, scenarioB, calculateRisk, aiAnalysis, runAiAnalysis, sessionId } = usePivot();
  const { c, isDark } = useTheme();
  const [checkedItems, setCheckedItems] = useState<number[]>([3]);
  const [activeTab, setActiveTab] = useState<'monthly' | 'cumulative'>('monthly');
  const [sessionData, setSessionData] = useState<SimulationSessionDetail | null>(null);

  // 페이지가 열리면 백엔드 서버에서 저장된 세션 정보(이전 계산 결과)를 가져옵니다.
  useEffect(() => {
    if (sessionId) {
      getSimulationSession(sessionId)
        .then(data => setSessionData(data))
        .catch(err => console.error('데이터를 불러오지 못했습니다:', err));
    }
  }, [sessionId]);

  // AI 분석 결과(해설 등)를 서버에 요청합니다.
  useEffect(() => {
    void runAiAnalysis();
  }, [runAiAnalysis]);

  // AI가 작성해준 최종 해설 텍스트를 가져옵니다.
  const aiExplanation = readStringField(aiAnalysis.explanation, 'final_explanation');

  // 위험도 계산 (A 시나리오 vs B 시나리오)
  const safeProfile = sessionData ? sessionData.userCondition : profile;
  const riskA = calculateRisk(scenarioA, safeProfile.monthlyIncome);
  const riskB = calculateRisk(scenarioB, safeProfile.monthlyIncome);

  const cashFlowA = generateCashFlow(
    safeProfile.monthlyIncome,
    scenarioA.monthlyHousing,
    scenarioA.childcareCost,
    scenarioA.applyPolicy,
    scenarioA.extraIncome
  );
  const cashFlowB = generateCashFlow(
    safeProfile.monthlyIncome,
    scenarioB.monthlyHousing,
    scenarioB.childcareCost,
    scenarioB.applyPolicy,
    scenarioB.extraIncome
  );

  const combinedData = cashFlowA.map((d, i) => ({
    month: d.month,
    A_surplus: d.surplus,
    B_surplus: cashFlowB[i].surplus,
    A_cum: d.cumulative,
    B_cum: cashFlowB[i].cumulative,
  }));

  const monthlyBreakdown = [
    { name: '주거', A: scenarioA.monthlyHousing, B: scenarioB.monthlyHousing },
    { name: '보육', A: scenarioA.childcareCost, B: scenarioB.childcareCost },
    { name: '생활', A: 130, B: 110 },
    { name: '잔여', A: Math.max(0, riskA.monthlySurplus), B: Math.max(0, riskB.monthlySurplus) },
  ];

  const statusInfo = (s: 'safe' | 'warning' | 'danger') => {
    if (s === 'safe') return { label: '안전', color: c.success, bg: c.successBg, border: c.successBorder, Icon: Shield, desc: '현재 생활 조건이 안정적입니다' };
    if (s === 'warning') return { label: '경계', color: c.warning, bg: c.warningBg, border: c.warningBorder, Icon: AlertTriangle, desc: '일부 지표가 임계점에 근접해 있습니다' };
    return { label: '위험', color: c.error, bg: c.errorBg, border: c.errorBorder, Icon: XCircle, desc: '즉각적인 조건 개선이 필요합니다' };
  };

  const riskStyle = (s: 'safe' | 'warning' | 'danger') => {
    if (s === 'safe') return { color: c.success, bg: c.successBg, border: c.successBorder };
    if (s === 'warning') return { color: c.warning, bg: c.warningBg, border: c.warningBorder };
    return { color: c.error, bg: c.errorBg, border: c.errorBorder };
  };

  const priorityStyle = {
    high: { color: c.error, bg: c.errorBg, label: '즉시' },
    medium: { color: c.warning, bg: c.warningBg, label: '권장' },
  };

  const statusA = statusInfo(riskA.status);
  const statusB = statusInfo(riskB.status);

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="px-3 py-2 rounded-xl"
        style={{ background: isDark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.98)', border: `1px solid ${c.border}`, boxShadow: c.cardShadow, backdropFilter: 'blur(12px)' }}>
        <p style={{ color: c.textSec, fontSize: '0.72rem', marginBottom: '4px' }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color, fontSize: '0.82rem', fontWeight: 600 }}>
            {p.name === 'A_surplus' || p.name === 'A_cum' ? 'A' : 'B'}: {p.value > 0 ? '+' : ''}{p.value}만원
          </p>
        ))}
      </div>
    );
  };

  const redZones = [
    { id: 'housing', title: '주거비 과부담', icon: Home, valueA: `${riskA.housingRatio.toFixed(0)}%`, valueB: `${riskB.housingRatio.toFixed(0)}%`, statusA: riskA.housingStatus, statusB: riskB.housingStatus, threshold: '30% 초과 위험', desc: '소득 대비 주거비 비율' },
    { id: 'commute', title: '통근 시간', icon: Clock, valueA: `${scenarioA.commuteTime}분`, valueB: `${scenarioB.commuteTime}분`, statusA: riskA.commuteStatus, statusB: riskB.commuteStatus, threshold: '60분 이상 경계', desc: '편도 통근 시간' },
    { id: 'childcare', title: '보육비 부담', icon: Baby, valueA: `${riskA.childcareRatio.toFixed(0)}%`, valueB: `${riskB.childcareRatio.toFixed(0)}%`, statusA: riskA.childcareStatus, statusB: riskB.childcareStatus, threshold: '15% 초과 위험', desc: '소득 대비 보육비 비율' },
    { id: 'cashflow', title: '월 현금흐름', icon: DollarSign, valueA: `${riskA.monthlySurplus}만`, valueB: `${riskB.monthlySurplus}만`, statusA: riskA.surplusStatus, statusB: riskB.surplusStatus, threshold: '20만원 이하 위험', desc: '지출 후 잔여 금액' },
  ];

  const recoveryLevers = [
    { action: '자치구 이사', icon: MapPin, from: scenarioA.district, to: scenarioB.district, effect: `주거비 -${Math.max(0, scenarioA.monthlyHousing - scenarioB.monthlyHousing)}만원/월`, tradeoff: `통근 +${Math.max(0, scenarioB.commuteTime - scenarioA.commuteTime)}분`, priority: 'high' as const },
    { action: '정책 신청', icon: FileText, from: '미신청', to: '서울형 지원금', effect: '월 30만원 지원', tradeoff: '서류 준비 필요', priority: 'high' as const },
    { action: '복직 시점 조정', icon: Clock, from: `${scenarioA.returnToWorkMonths}개월 후`, to: `${scenarioB.returnToWorkMonths}개월 후`, effect: `월 수입 +${Math.abs(scenarioA.returnToWorkMonths - scenarioB.returnToWorkMonths) * 10}만원`, tradeoff: '보육 부담 증가', priority: 'medium' as const },
    { action: '다운사이징', icon: Home, from: '현재 면적', to: '소형 전환', effect: '주거비 20~30% 절감', tradeoff: '공간 감소', priority: 'medium' as const },
  ];

  return (
    <div className="h-full overflow-y-auto scrollbar-none p-4 md:p-6 space-y-4 md:space-y-5">

      {/* ===== 설명 섹션: 프론트 → Spring 운영 API → AI 게이트웨이 → FastAPI 전체 연결 상태 ===== */}
      <div className="rounded-2xl p-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-4"
        style={{ background: c.card, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: aiAnalysis.status === 'error' ? c.errorBg : c.primaryBg }}>
          <RefreshCw size={16} className={aiAnalysis.status === 'loading' ? 'animate-spin' : ''}
            style={{ color: aiAnalysis.status === 'error' ? c.error : c.primary }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span style={{ color: c.text, fontSize: '0.86rem', fontWeight: 700 }}>운영 시뮬레이션 → AI 파이프라인 연결</span>
            <span className="px-2 py-0.5 rounded-full"
              style={{ background: aiAnalysis.status === 'error' ? c.errorBg : c.successBg, color: aiAnalysis.status === 'error' ? c.error : c.success, fontSize: '0.66rem', border: `1px solid ${aiAnalysis.status === 'error' ? c.errorBorder : c.successBorder}` }}>
              {aiAnalysis.status === 'loading' ? '연결 중' : aiAnalysis.status === 'error' ? '부분 실패' : aiAnalysis.status === 'success' ? '연결 완료' : '대기'}
            </span>
            {gatewayHealth !== undefined && (
              <span style={{ color: c.textMuted, fontSize: '0.68rem' }}>FastAPI health: {String(gatewayHealth)}</span>
            )}
          </div>
          <p style={{ color: c.textSec, fontSize: '0.74rem', marginTop: '3px' }}>
            결과 화면 진입 시 프론트는 Spring `/api/simulation/runs`만 호출하고, Spring이 내부에서 `/api/ai/*` → FastAPI `/api/v1/*` 전체 모듈을 연결합니다.
          </p>
          {backendRunStatus && (
            <p style={{ color: c.textMuted, fontSize: '0.68rem', marginTop: '2px' }}>Spring run 상태: {backendRunStatus}</p>
          )}
          {modulesUsed.length > 0 && (
            <p style={{ color: c.textMuted, fontSize: '0.68rem', marginTop: '2px' }}>사용 모듈: {modulesUsed.join(', ')}</p>
          )}
          {aiExplanation && (
            <p style={{ color: c.textMuted, fontSize: '0.68rem', marginTop: '2px' }}>LLM 해설: {aiExplanation}</p>
          )}
          {aiAnalysis.error && (
            <p style={{ color: c.error, fontSize: '0.68rem', marginTop: '2px' }}>{aiAnalysis.error}</p>
          )}
        </div>
        <button onClick={() => void runAiAnalysis()}
          className="px-3 py-2 rounded-xl font-medium transition-all shrink-0"
          style={{ background: c.primaryBg, color: c.primary, border: `1px solid ${c.primaryBorder}`, fontSize: '0.75rem' }}>
          다시 연결
        </button>
      </div>

      {/* ===== 결과 설명 섹션: 아직 점수/차트는 로컬 fallback 계산으로 표시 ===== */}
      {/* ── 상단 요약 영역 ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { info: statusA, risk: riskA, scenario: scenarioA, label: 'A' },
          { info: statusB, risk: riskB, scenario: scenarioB, label: 'B' },
        ].map(({ info, risk, scenario, label }) => (
          <div key={label} className="rounded-2xl p-4 flex items-center gap-3"
            style={{ background: info.bg, border: `1px solid ${info.border}`, backdropFilter: 'blur(12px)' }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${info.color}22` }}>
              <info.Icon size={20} style={{ color: info.color }} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span style={{ color: info.color, fontSize: '1rem', fontWeight: 700 }}>시나리오 {label}: {info.label}</span>
                <span style={{ color: info.color, fontSize: '0.72rem', opacity: 0.8 }}>{risk.overallScore}점</span>
              </div>
              <p style={{ color: c.textSec, fontSize: '0.75rem' }}>{info.desc}</p>
              <p style={{ color: c.textMuted, fontSize: '0.68rem' }}>{scenario.district} 기준</p>
            </div>
          </div>
        ))}

        {/* 점수 차이 */}
        <div className="rounded-2xl p-4 flex items-center gap-3"
          style={{ background: riskB.overallScore < riskA.overallScore ? c.successBg : c.errorBg, border: `1px solid ${riskB.overallScore < riskA.overallScore ? c.successBorder : c.errorBorder}`, backdropFilter: 'blur(12px)' }}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: riskB.overallScore < riskA.overallScore ? `${c.success}22` : `${c.error}22` }}>
            {riskB.overallScore < riskA.overallScore
              ? <TrendingDown size={20} style={{ color: c.success }} />
              : <TrendingUp size={20} style={{ color: c.error }} />
            }
          </div>
          <div>
            <div style={{ color: riskB.overallScore < riskA.overallScore ? c.success : c.error, fontSize: '1.35rem', fontWeight: 700 }}>
              {riskB.overallScore < riskA.overallScore ? '−' : '+'}{Math.abs(riskA.overallScore - riskB.overallScore)}점
            </div>
            <p style={{ color: c.textSec, fontSize: '0.75rem' }}>
              B 시나리오 {riskB.overallScore < riskA.overallScore ? '리스크 감소' : '리스크 증가'}
            </p>
            <p style={{ color: c.textMuted, fontSize: '0.68rem' }}>
              월 잔여: {riskB.monthlySurplus > 0 ? '+' : ''}{riskB.monthlySurplus}만원
            </p>
          </div>
        </div>
      </div>

      {/* ── 메인 차트 영역 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* A/B 현금 흐름 차트 */}
        <div className="lg:col-span-3 rounded-2xl p-4 md:p-5"
          style={{ background: c.card, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 size={13} style={{ color: c.primary }} />
                <span style={{ color: c.textSec, fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>A/B 시나리오 현금흐름 비교</span>
              </div>
              <p style={{ color: c.text, fontSize: '0.92rem', fontWeight: 600 }}>월별 잔여 현금흐름 (12개월)</p>
            </div>
            <div className="flex gap-1.5">
              {(['monthly', 'cumulative'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className="px-2.5 py-1 rounded-lg transition-all"
                  style={{ background: activeTab === tab ? c.primaryBg : (isDark ? 'rgba(15,23,42,0.4)' : '#F8FAFC'), color: activeTab === tab ? c.primary : c.textMuted, border: `1px solid ${activeTab === tab ? c.primaryBorder : c.borderSoft}`, fontSize: '0.72rem' }}>
                  {tab === 'monthly' ? '월별' : '누적'}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={combinedData} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
              <defs>
                <linearGradient id="gradA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gradB" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={c.success} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={c.success} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={c.chartGrid} />
              <XAxis dataKey="month" tick={{ fill: c.chartAxis, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: c.chartAxis, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}만`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '0.72rem', paddingTop: '8px' }}
                formatter={value => <span style={{ color: c.textSec }}>{value === 'A_surplus' || value === 'A_cum' ? `A: ${scenarioA.district}` : `B: ${scenarioB.district}`}</span>} />
              {activeTab === 'monthly' ? (
                <>
                  <Area type="monotone" dataKey="A_surplus" stroke="#6366F1" strokeWidth={2} fill="url(#gradA)" dot={false} />
                  <Area type="monotone" dataKey="B_surplus" stroke={c.success} strokeWidth={2} fill="url(#gradB)" dot={false} />
                </>
              ) : (
                <>
                  <Area type="monotone" dataKey="A_cum" stroke="#6366F1" strokeWidth={2} fill="url(#gradA)" dot={false} />
                  <Area type="monotone" dataKey="B_cum" stroke={c.success} strokeWidth={2} fill="url(#gradB)" dot={false} />
                </>
              )}
            </AreaChart>
          </ResponsiveContainer>

          <div className="flex items-center gap-4 pt-3 mt-1 border-t" style={{ borderColor: c.border }}>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 rounded" style={{ background: '#6366F1' }} />
              <span style={{ color: c.textSec, fontSize: '0.68rem' }}>A: {scenarioA.district}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 rounded" style={{ background: c.success }} />
              <span style={{ color: c.textSec, fontSize: '0.68rem' }}>B: {scenarioB.district}</span>
            </div>
            <span style={{ color: c.textMuted, fontSize: '0.62rem', marginLeft: 'auto' }}>* 월 130만원 고정 생활비 가정</span>
          </div>
        </div>

        {/* 오른쪽 묶음 */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* 게이지 쌍 */}
          <div className="rounded-2xl p-4 flex items-center justify-around"
            style={{ background: c.card, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow }}>
            {[
              { score: riskA.overallScore, label: '시나리오 A', district: scenarioA.district, color: c.accent },
              { score: riskB.overallScore, label: '시나리오 B', district: scenarioB.district, color: '#6EE7B7' },
            ].map(({ score, label, district, color }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <div style={{ color, fontSize: '0.7rem', fontWeight: 600 }}>{label}</div>
                <GaugeChart score={score} size={115} />
                <div style={{ color: c.textMuted, fontSize: '0.65rem' }}>{district}</div>
              </div>
            ))}
          </div>

          {/* 월별 상세 */}
          <div className="rounded-2xl p-4 flex-1"
            style={{ background: c.card, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow }}>
            <span style={{ color: c.textSec, fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '12px' }}>
              월별 지출 구조
            </span>
            <ResponsiveContainer width="100%" height={135}>
              <BarChart data={monthlyBreakdown} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={c.chartGrid} />
                <XAxis dataKey="name" tick={{ fill: c.chartAxis, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: c.chartAxis, fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="A" name="A" fill="#6366F1" fillOpacity={0.7} radius={[3, 3, 0, 0]} />
                <Bar dataKey="B" name="B" fill={c.success} fillOpacity={0.7} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── 위험 구간 카드 ── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={13} style={{ color: c.error }} />
          <span style={{ color: c.textSec, fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            리스크 진단
          </span>
          <span style={{ color: c.textMuted, fontSize: '0.68rem' }}>— 임계점 초과 항목 점검</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {redZones.map(({ id, title, icon: Icon, valueA, valueB, statusA: sA, statusB: sB, threshold, desc }) => {
            const styleA = riskStyle(sA);
            const styleB = riskStyle(sB);
            const improved = (sA === 'danger' && sB !== 'danger') || (sA === 'warning' && sB === 'safe');
            return (
              <div key={id} className="rounded-2xl p-3.5"
                style={{ background: sA === 'danger' ? c.errorBg : c.card, border: `1px solid ${sA === 'danger' ? c.errorBorder : c.cardBorder}`, boxShadow: c.cardShadow }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: isDark ? 'rgba(15,23,42,0.4)' : '#F8FAFC' }}>
                    <Icon size={13} style={{ color: styleA.color }} />
                  </div>
                  {improved && (
                    <span className="px-1.5 py-0.5 rounded-full"
                      style={{ background: c.successBg, color: c.success, fontSize: '0.6rem', border: `1px solid ${c.successBorder}` }}>
                      개선됨
                    </span>
                  )}
                </div>
                <h4 style={{ color: c.text, fontSize: '0.82rem', fontWeight: 600, marginBottom: '2px' }}>{title}</h4>
                <p style={{ color: c.textMuted, fontSize: '0.65rem', marginBottom: '8px' }}>{desc}</p>
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="flex-1 p-1.5 rounded-lg text-center"
                    style={{ background: styleA.bg, border: `1px solid ${styleA.border}` }}>
                    <div style={{ color: c.textMuted, fontSize: '0.55rem' }}>A</div>
                    <div style={{ color: styleA.color, fontSize: '0.82rem', fontWeight: 700 }}>{valueA}</div>
                  </div>
                  <span style={{ color: c.textMuted, fontSize: '0.6rem' }}>→</span>
                  <div className="flex-1 p-1.5 rounded-lg text-center"
                    style={{ background: styleB.bg, border: `1px solid ${styleB.border}` }}>
                    <div style={{ color: c.textMuted, fontSize: '0.55rem' }}>B</div>
                    <div style={{ color: styleB.color, fontSize: '0.82rem', fontWeight: 700 }}>{valueB}</div>
                  </div>
                </div>
                <p style={{ color: c.textMuted, fontSize: '0.6rem' }}>기준: {threshold}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 하단 영역 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* 회복 레버 */}
        <div className="lg:col-span-3 rounded-2xl overflow-hidden"
          style={{ background: c.card, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow }}>
          <div className="px-5 py-3.5 border-b flex items-center gap-2" style={{ borderColor: c.border }}>
            <RefreshCw size={13} style={{ color: c.primary }} />
            <span style={{ color: c.textSec, fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              회복 레버 — 실행 가능한 전략
            </span>
          </div>
          {recoveryLevers.map(({ action, icon: Icon, from, to, effect, tradeoff, priority }, idx) => (
            <div key={action}
              className="flex items-center px-4 md:px-5 py-3 gap-3 md:gap-4 transition-all"
              style={{ borderBottom: idx < recoveryLevers.length - 1 ? `1px solid ${c.border}` : 'none' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: c.primaryBg }}>
                <Icon size={13} style={{ color: c.primary }} />
              </div>
              <div className="flex-1 min-w-0">
                <div style={{ color: c.text, fontSize: '0.82rem', fontWeight: 500 }}>{action}</div>
                <div style={{ color: c.textMuted, fontSize: '0.68rem' }}>{from} → <span style={{ color: c.textSec }}>{to}</span></div>
              </div>
              <div className="text-right shrink-0 hidden sm:block">
                <div style={{ color: c.success, fontSize: '0.78rem', fontWeight: 600 }}>{effect}</div>
                <div style={{ color: c.textMuted, fontSize: '0.65rem' }}>↔ {tradeoff}</div>
              </div>
              <div className="px-2 py-0.5 rounded-full shrink-0"
                style={{ background: priorityStyle[priority].bg, color: priorityStyle[priority].color, fontSize: '0.65rem' }}>
                {priorityStyle[priority].label}
              </div>
            </div>
          ))}
        </div>

        {/* 오른쪽 컬럼 */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* 체크리스트 */}
          <div className="rounded-2xl p-4 md:p-5"
            style={{ background: c.card, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow }}>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 size={13} style={{ color: c.primary }} />
              <span style={{ color: c.textSec, fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                이번 주 할 일
              </span>
              <span className="ml-auto px-2 py-0.5 rounded-full"
                style={{ background: c.primaryBg, color: c.accent, fontSize: '0.65rem', border: `1px solid ${c.primaryBorder}` }}>
                {checkedItems.length}/{checklistItems.length}
              </span>
            </div>
            <div className="space-y-2">
              {checklistItems.map(item => {
                const isDone = checkedItems.includes(item.id);
                return (
                  <div key={item.id} className="flex items-center gap-2.5 cursor-pointer"
                    onClick={() => setCheckedItems(prev => prev.includes(item.id) ? prev.filter(i => i !== item.id) : [...prev, item.id])}>
                    {isDone ? <CheckCircle2 size={14} className="shrink-0" style={{ color: c.success }} /> : <Circle size={14} className="shrink-0" style={{ color: c.textMuted }} />}
                    <span style={{ color: isDone ? c.textMuted : c.textSec, fontSize: '0.78rem', textDecoration: isDone ? 'line-through' : 'none', flex: 1 }}>
                      {item.text}
                    </span>
                    <span style={{ color: c.textMuted, fontSize: '0.62rem', flexShrink: 0 }}>{item.link}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 자치구 레이더 */}
          <div className="rounded-2xl p-4 flex-1"
            style={{ background: c.card, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow }}>
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={12} style={{ color: c.primary }} />
              <span style={{ color: c.textSec, fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>자치구 생활환경 비교</span>
            </div>
            <ResponsiveContainer width="100%" height={155}>
              <RadarChart data={districtRadarData} margin={{ top: 8, right: 14, bottom: 8, left: 14 }}>
                <PolarGrid stroke={c.chartGrid} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: c.chartAxis, fontSize: 9 }} />
                <Radar name={scenarioA.district} dataKey="A" stroke="#6366F1" fill="#6366F1" fillOpacity={0.15} strokeWidth={1.5} />
                <Radar name={scenarioB.district} dataKey="B" stroke={c.success} fill={c.success} fillOpacity={0.15} strokeWidth={1.5} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-4">
              {[{ label: scenarioA.district, color: '#6366F1' }, { label: scenarioB.district, color: c.success }].map(item => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-0.5 rounded" style={{ background: item.color }} />
                  <span style={{ color: c.textMuted, fontSize: '0.62rem' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 데이터 출처 */}
      <div className="rounded-2xl p-4"
        style={{ background: isDark ? 'rgba(15,23,42,0.5)' : '#F8FAFC', border: `1px solid ${c.borderSoft}` }}>
        <div className="flex items-center gap-2 mb-3">
          <Info size={12} style={{ color: c.textMuted }} />
          <span style={{ color: c.textMuted, fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>데이터 근거</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {dataSources.map(ds => (
            <div key={ds.label} className="flex items-start gap-1.5">
              <div className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ background: c.textMuted }} />
              <div>
                <p style={{ color: c.textSec, fontSize: '0.68rem' }}>{ds.label}</p>
                <p style={{ color: c.textMuted, fontSize: '0.62rem' }}>{ds.source} ({ds.year})</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}