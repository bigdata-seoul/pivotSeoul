import type { ScenarioConditions } from '../context/PivotContext';
import { getMockResultDataSources } from './dataApi';
import type { DataSource } from './dataApi';
import { buildMockRecommendations, type ResultRecommendation } from './recommendationApi';
import { fetchJson } from './http';

export type RiskStatus = 'safe' | 'warning' | 'danger';
export type { ResultRecommendation } from './recommendationApi';

export type ThresholdId = 'housing' | 'commute' | 'childcare' | 'cashflow';

export interface ResultChartPoint {
  month: string;
  surplus: number;
  cumulative: number;
}

export interface ResultThreshold {
  id: ThresholdId;
  title: string;
  description: string;
  valueA: string;
  valueB: string;
  statusA: RiskStatus;
  statusB: RiskStatus;
  threshold: string;
}

export interface WeeklyAction {
  id: number;
  title: string;
  sourceLabel: string;
  actionType?: string;
  description?: string;
  priorityOrder?: number;
  serviceLinkId?: number;
}

export interface ResultHistoryItem {
  id: string;
  stage: string;
  fromDistrict: string;
  toDistrict: string;
  score: number;
  status: RiskStatus;
  createdAt: string;
}

export interface ResultShareRequest {
  resultId: string;
}

export interface SpringResultSummaryResponse {
  resultId: number;
  simulationRunId: number | null;
  scenarioId: number | null;
  resultStatus: string;
  riskStatus: string;
  totalScore: number | null;
  riskScore: number | null;
  confidenceScore: number | null;
  redZoneCount: number;
  message: string;
}

export interface SpringThresholdResultResponse {
  thresholdResultId: number;
  thresholdTypeId: number;
  status: string;
  calculatedValue: number | null;
  thresholdValue: number | null;
  redZone: boolean;
  summary: string | null;
}

export interface SpringEvidenceResponse {
  usageId: number;
  dataSnapshotId: number;
  usedFor: string | null;
  usedFieldList: string | null;
  sourceWeight: number | null;
}

export interface SpringSimulationResultResponse {
  resultId: number;
  simulationRunId: number | null;
  scenarioId: number | null;
  resultStatus: string;
  riskStatus: string;
  summary: SpringResultSummaryResponse;
  scores: Record<string, number | null>;
  thresholds: SpringThresholdResultResponse[];
  dataSources: SpringEvidenceResponse[];
}

export interface SpringWeeklyActionResponse {
  id: number;
  title: string;
  sourceLabel: string;
  actionType: string | null;
  description: string | null;
  priorityOrder: number | null;
  serviceLinkId: number | null;
}

export const MOCK_WEEKLY_ACTIONS: WeeklyAction[] = [
  { id: 1, title: '서울 주거비 지원 정책 조회하기', sourceLabel: '서울주거포털' },
  { id: 2, title: '비교 자치구의 월세 매물 확인', sourceLabel: '부동산 앱' },
  { id: 3, title: '육아종합지원센터 상담 예약', sourceLabel: '서울시 포털' },
  { id: 4, title: '국민연금 예상 수령액 조회', sourceLabel: 'NPS' },
  { id: 5, title: '복직 후 실수령액 계산', sourceLabel: '4대보험 계산기' },
];

export function buildRecommendations(scenarioA: ScenarioConditions, scenarioB: ScenarioConditions): ResultRecommendation[] {
  return buildMockRecommendations(scenarioA, scenarioB);
}

export function getWeeklyActions(): WeeklyAction[] {
  return MOCK_WEEKLY_ACTIONS;
}

export function getResultDataSources(): DataSource[] {
  return getMockResultDataSources();
}

function normalizeRiskStatus(status: string | null | undefined): RiskStatus {
  if (status === 'safe' || status === 'warning' || status === 'danger') return status;
  return 'warning';
}

function toHistoryItem(result: SpringResultSummaryResponse): ResultHistoryItem {
  return {
    id: String(result.resultId),
    stage: result.scenarioId == null ? '-' : `Scenario ${result.scenarioId}`,
    fromDistrict: '-',
    toDistrict: '-',
    score: Math.round(result.riskScore ?? result.totalScore ?? 0),
    status: normalizeRiskStatus(result.riskStatus),
    createdAt: '',
  };
}

function toWeeklyAction(action: SpringWeeklyActionResponse): WeeklyAction {
  return {
    id: action.id,
    title: action.title,
    sourceLabel: action.sourceLabel,
    actionType: action.actionType ?? undefined,
    description: action.description ?? undefined,
    priorityOrder: action.priorityOrder ?? undefined,
    serviceLinkId: action.serviceLinkId ?? undefined,
  };
}

export function fetchResultDetail(scenarioResultId: number): Promise<SpringSimulationResultResponse> {
  return fetchJson<SpringSimulationResultResponse>(`/simulation/results/${scenarioResultId}`);
}

export function fetchResultSummary(scenarioResultId: number): Promise<SpringResultSummaryResponse> {
  return fetchJson<SpringResultSummaryResponse>(`/simulation/results/${scenarioResultId}/summary`);
}

export function fetchResultHistory(): Promise<ResultHistoryItem[]> {
  return fetchJson<SpringResultSummaryResponse[]>('/simulation/results')
    .then((results) => results.map(toHistoryItem));
}

export function fetchWeeklyActions(scenarioResultId: number): Promise<WeeklyAction[]> {
  return fetchJson<SpringWeeklyActionResponse[]>(`/simulation/results/${scenarioResultId}/weekly-actions`)
    .then((actions) => actions.map(toWeeklyAction));
}

export function shareResult(request: ResultShareRequest): Promise<{ shareUrl: string }> {
  const baseUrl = typeof window === 'undefined' ? '' : window.location.origin;
  return Promise.resolve({ shareUrl: `${baseUrl}/results?resultId=${encodeURIComponent(request.resultId)}` });
}
