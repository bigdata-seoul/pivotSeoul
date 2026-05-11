import type { ScenarioConditions } from '../context/PivotContext';
import { getMockResultDataSources } from './dataApi';
import type { DataSource } from './dataApi';
import { buildMockRecommendations, type ResultRecommendation } from './recommendationApi';
import { fetchJson, postJson } from './http';

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

export function fetchResultHistory(): Promise<ResultHistoryItem[]> {
  return fetchJson<ResultHistoryItem[]>('/results/history');
}

export function shareResult(request: ResultShareRequest): Promise<{ shareUrl: string }> {
  return postJson<{ shareUrl: string }, ResultShareRequest>('/results/share', request);
}
