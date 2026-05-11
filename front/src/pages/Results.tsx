import { useMemo, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BarChart3, CheckCircle2, Circle, RefreshCw } from 'lucide-react';
import { usePivot } from '../context/PivotContext';
import { useTheme } from '../context/ThemeContext';
import { GaugeChart } from '../components/GaugeChart';
import { DataSourceBadge } from '../components/result/DataSourceBadge';
import { RecommendationCard } from '../components/result/RecommendationCard';
import { ResultShareButton } from '../components/result/ResultShareButton';
import { ResultSummaryCard } from '../components/result/ResultSummaryCard';
import { ThresholdCard } from '../components/result/ThresholdCard';
import { WeeklyActionList } from '../components/result/WeeklyActionList';
import { PdfDownloadButton } from '../components/result/PdfDownloadButton';
import { buildRecommendations, getResultDataSources, getWeeklyActions, type ResultChartPoint } from '../api/resultApi';
import type { RiskAnalysis, ScenarioConditions } from '../context/PivotContext';
type ChartMode = 'monthly' | 'cumulative';

interface TooltipPayload {
  name?: string;
  value?: number;
  color?: string;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

const LIVING_COST_BY_SCENARIO = {
  A: 130,
  B: 110,
} as const;

function generateCashFlow(
  income: number,
  scenario: ScenarioConditions,
  fixedLivingCost: number,
  months = 12,
): ResultChartPoint[] {
  const policyBonus = scenario.applyPolicy ? 30 : 0;

  return Array.from({ length: months }, (_, index) => {
    const variation = Math.sin(index * 0.7) * 8;
    const surplus = income - scenario.monthlyHousing - scenario.childcareCost - fixedLivingCost + policyBonus + scenario.extraIncome + variation;
    const cumulative = surplus * (index + 1) + variation * 5;

    return {
      month: `${index + 1}월`,
      surplus: Math.round(surplus),
      cumulative: Math.round(cumulative),
    };
  });
}

function buildCashFlowComparison(
  income: number,
  scenarioA: ScenarioConditions,
  scenarioB: ScenarioConditions,
) {
  const cashFlowA = generateCashFlow(income, scenarioA, LIVING_COST_BY_SCENARIO.A);
  const cashFlowB = generateCashFlow(income, scenarioB, LIVING_COST_BY_SCENARIO.B);

  return cashFlowA.map((point, index) => ({
    month: point.month,
    A_surplus: point.surplus,
    B_surplus: cashFlowB[index]?.surplus ?? 0,
    A_cum: point.cumulative,
    B_cum: cashFlowB[index]?.cumulative ?? 0,
  }));
}

function buildMonthlyBreakdown(riskA: RiskAnalysis, riskB: RiskAnalysis, scenarioA: ScenarioConditions, scenarioB: ScenarioConditions) {
  return [
    { name: '주거', A: scenarioA.monthlyHousing, B: scenarioB.monthlyHousing },
    { name: '보육', A: scenarioA.childcareCost, B: scenarioB.childcareCost },
    { name: '생활', A: LIVING_COST_BY_SCENARIO.A, B: LIVING_COST_BY_SCENARIO.B },
    { name: '여유', A: Math.max(0, riskA.monthlySurplus), B: Math.max(0, riskB.monthlySurplus) },
  ];
}

function buildThresholds(riskA: RiskAnalysis, riskB: RiskAnalysis, scenarioA: ScenarioConditions, scenarioB: ScenarioConditions) {
  return [
    {
      id: 'housing',
      title: '주거비 과부담',
      description: '소득 대비 주거비 비율',
      valueA: `${riskA.housingRatio.toFixed(0)}%`,
      valueB: `${riskB.housingRatio.toFixed(0)}%`,
      statusA: riskA.housingStatus,
      statusB: riskB.housingStatus,
      threshold: '30% 초과 위험',
    },
    {
      id: 'commute',
      title: '통근 시간',
      description: '편도 통근 시간',
      valueA: `${scenarioA.commuteTime}분`,
      valueB: `${scenarioB.commuteTime}분`,
      statusA: riskA.commuteStatus,
      statusB: riskB.commuteStatus,
      threshold: '60분 이상 경계',
    },
    {
      id: 'childcare',
      title: '보육비 부담',
      description: '소득 대비 보육비 비율',
      valueA: `${riskA.childcareRatio.toFixed(0)}%`,
      valueB: `${riskB.childcareRatio.toFixed(0)}%`,
      statusA: riskA.childcareStatus,
      statusB: riskB.childcareStatus,
      threshold: '15% 초과 위험',
    },
    {
      id: 'cashflow',
      title: '월 현금흐름',
      description: '지출 후 잔여 금액',
      valueA: `${riskA.monthlySurplus}만`,
      valueB: `${riskB.monthlySurplus}만`,
      statusA: riskA.surplusStatus,
      statusB: riskB.surplusStatus,
      threshold: '20만원 이하 위험',
    },
  ];
}

export function Results() {
  const { profile, scenarioA, scenarioB, calculateRisk } = usePivot();
  const { c, isDark } = useTheme();
  const [checkedActionIds, setCheckedActionIds] = useState<number[]>([3]);
  const [activeTab, setActiveTab] = useState<ChartMode>('monthly');

  const riskA = useMemo(
    () => calculateRisk(scenarioA, profile.monthlyIncome),
    [calculateRisk, scenarioA, profile.monthlyIncome],
  );
  const riskB = useMemo(
    () => calculateRisk(scenarioB, profile.monthlyIncome),
    [calculateRisk, scenarioB, profile.monthlyIncome],
  );

  const cashFlowData = useMemo(
    () => buildCashFlowComparison(profile.monthlyIncome, scenarioA, scenarioB),
    [profile.monthlyIncome, scenarioA, scenarioB],
  );
  const monthlyBreakdown = useMemo(
    () => buildMonthlyBreakdown(riskA, riskB, scenarioA, scenarioB),
    [riskA, riskB, scenarioA, scenarioB],
  );
  const thresholds = useMemo(
    () => buildThresholds(riskA, riskB, scenarioA, scenarioB),
    [riskA, riskB, scenarioA, scenarioB],
  );
  const recommendations = useMemo(
    () => buildRecommendations(scenarioA, scenarioB),
    [scenarioA, scenarioB],
  );
  const weeklyActions = useMemo(() => getWeeklyActions(), []);
  const dataSources = useMemo(() => getResultDataSources(), []);

  const chartTooltip = ({ active, payload, label }: ChartTooltipProps) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="px-3 py-2 rounded-xl" style={{ background: isDark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.98)', border: `1px solid ${c.border}`, boxShadow: c.cardShadow }}>
        <p style={{ color: c.textSec, fontSize: '0.72rem', marginBottom: '4px' }}>{label}</p>
        {payload.map((item) => (
          <p key={item.name} style={{ color: item.color, fontSize: '0.82rem', fontWeight: 600 }}>
            {item.name?.startsWith('A') ? 'A' : 'B'}: {(item.value ?? 0) > 0 ? '+' : ''}{item.value}만원
          </p>
        ))}
      </div>
    );
  };

  const toggleAction = (id: number) => {
    setCheckedActionIds((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]));
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-none p-4 md:p-6 space-y-4 md:space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ResultSummaryCard scenarioLabel="A" district={scenarioA.district} risk={riskA} />
        <ResultSummaryCard scenarioLabel="B" district={scenarioB.district} risk={riskB} />
        <ResultSummaryCard scenarioLabel="B-A" district={scenarioB.district} risk={riskB} comparedRisk={riskA} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 rounded-2xl p-4 md:p-5" style={{ background: c.card, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 size={13} style={{ color: c.primary }} />
                <span style={{ color: c.textSec, fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>A/B 시나리오 현금흐름 비교</span>
              </div>
              <p style={{ color: c.text, fontSize: '0.92rem', fontWeight: 600 }}>월별 여유 현금흐름 (12개월)</p>
            </div>
            <div className="flex gap-1.5">
              {(['monthly', 'cumulative'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="px-2.5 py-1 rounded-lg transition-all"
                  style={{ background: activeTab === tab ? c.primaryBg : (isDark ? 'rgba(15,23,42,0.4)' : '#F8FAFC'), color: activeTab === tab ? c.primary : c.textMuted, border: `1px solid ${activeTab === tab ? c.primaryBorder : c.borderSoft}`, fontSize: '0.72rem' }}
                >
                  {tab === 'monthly' ? '월별' : '누적'}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={cashFlowData} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
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
              <YAxis tick={{ fill: c.chartAxis, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(value) => `${value}만`} />
              <Tooltip content={chartTooltip} />
              <Legend wrapperStyle={{ fontSize: '0.72rem', paddingTop: '8px' }} formatter={(value) => <span style={{ color: c.textSec }}>{String(value).startsWith('A') ? `A: ${scenarioA.district}` : `B: ${scenarioB.district}`}</span>} />
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
        </div>

        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="rounded-2xl p-4 flex items-center justify-around" style={{ background: c.card, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow }}>
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

          <div className="rounded-2xl p-4 flex-1" style={{ background: c.card, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow }}>
            <span style={{ color: c.textSec, fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '12px' }}>
              월별 지출 구조
            </span>
            <ResponsiveContainer width="100%" height={135}>
              <BarChart data={monthlyBreakdown} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={c.chartGrid} />
                <XAxis dataKey="name" tick={{ fill: c.chartAxis, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: c.chartAxis, fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip content={chartTooltip} />
                <Bar dataKey="A" name="A" fill="#6366F1" fillOpacity={0.7} radius={[3, 3, 0, 0]} />
                <Bar dataKey="B" name="B" fill={c.success} fillOpacity={0.7} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <span style={{ color: c.textSec, fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>위험도 진단</span>
          <span style={{ color: c.textMuted, fontSize: '0.68rem' }}>임계점 초과 항목 점검</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {thresholds.map((threshold) => (
            <ThresholdCard key={threshold.id} threshold={threshold} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 rounded-2xl overflow-hidden" style={{ background: c.card, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow }}>
          <div className="px-5 py-3.5 border-b flex items-center gap-2" style={{ borderColor: c.border }}>
            <RefreshCw size={13} style={{ color: c.primary }} />
            <span style={{ color: c.textSec, fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              추천 회복 전략
            </span>
          </div>
          {recommendations.map((recommendation, index) => (
            <RecommendationCard key={recommendation.id} recommendation={recommendation} isLast={index === recommendations.length - 1} />
          ))}
        </div>

        <div className="lg:col-span-2 rounded-2xl p-4 md:p-5" style={{ background: c.card, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow }}>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 size={13} style={{ color: c.primary }} />
            <span style={{ color: c.textSec, fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              이번 주 액션
            </span>
            <span className="ml-auto px-2 py-0.5 rounded-full" style={{ background: c.primaryBg, color: c.accent, fontSize: '0.65rem', border: `1px solid ${c.primaryBorder}` }}>
              {checkedActionIds.length}/{weeklyActions.length}
            </span>
          </div>
          <WeeklyActionList actions={weeklyActions} checkedIds={checkedActionIds} onToggle={toggleAction} checkedIcon={CheckCircle2} uncheckedIcon={Circle} />
        </div>
      </div>

      <div className="rounded-2xl p-4" style={{ background: isDark ? 'rgba(15,23,42,0.5)' : '#F8FAFC', border: `1px solid ${c.borderSoft}` }}>
        <div className="flex items-center justify-between gap-3 mb-3">
          <span style={{ color: c.textMuted, fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>데이터 근거</span>
          <div className="flex gap-2">
            <ResultShareButton resultId="latest-result" />
            <PdfDownloadButton resultId="latest-result" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {dataSources.map((source) => (
            <DataSourceBadge key={source.id} source={source} />
          ))}
        </div>
      </div>
    </div>
  );
}
