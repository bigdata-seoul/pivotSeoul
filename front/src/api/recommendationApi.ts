import { postJson } from './http';
import type { ScenarioConditions } from '../context/PivotContext';

export type RecommendationPriority = 'high' | 'medium';
export type RecommendationKind = 'relocation' | 'policy' | 'work' | 'housing';

export interface ResultRecommendation {
  id: string;
  kind: RecommendationKind;
  title: string;
  from: string;
  to: string;
  effect: string;
  tradeoff: string;
  priority: RecommendationPriority;
  reason: string;
}

export interface RecommendationRequest {
  scenarioA: ScenarioConditions;
  scenarioB: ScenarioConditions;
}

export interface RecommendationResponse {
  recommendations: ResultRecommendation[];
}

export function buildMockRecommendations(scenarioA: ScenarioConditions, scenarioB: ScenarioConditions): ResultRecommendation[] {
  return [
    {
      id: 'relocation',
      kind: 'relocation',
      title: '자치구 이동',
      from: scenarioA.district,
      to: scenarioB.district,
      effect: `주거비 -${Math.max(0, scenarioA.monthlyHousing - scenarioB.monthlyHousing)}만원/월`,
      tradeoff: `통근 +${Math.max(0, scenarioB.commuteTime - scenarioA.commuteTime)}분`,
      priority: 'high',
      reason: '주거비 비율 개선 효과가 가장 큽니다',
    },
    {
      id: 'policy',
      kind: 'policy',
      title: '정책 지원 신청',
      from: '미신청',
      to: '서울시 지원금',
      effect: '월 30만원 지원',
      tradeoff: '서류 준비 필요',
      priority: 'high',
      reason: '현금흐름을 즉시 개선할 수 있습니다',
    },
    {
      id: 'work',
      kind: 'work',
      title: '복직 시점 조정',
      from: `${scenarioA.returnToWorkMonths}개월 후`,
      to: `${scenarioB.returnToWorkMonths}개월 후`,
      effect: `월 수입 +${Math.abs(scenarioA.returnToWorkMonths - scenarioB.returnToWorkMonths) * 10}만원`,
      tradeoff: '보육 부담 증가',
      priority: 'medium',
      reason: '소득 회복 시점을 앞당기는 선택지입니다',
    },
    {
      id: 'housing',
      kind: 'housing',
      title: '다운사이징',
      from: '현재 면적',
      to: '소형 전환',
      effect: '주거비 20~30% 절감',
      tradeoff: '공간 감소',
      priority: 'medium',
      reason: '고정비를 구조적으로 줄입니다',
    },
  ];
}

export function fetchRecommendations(request: RecommendationRequest): Promise<RecommendationResponse> {
  return postJson<RecommendationResponse, RecommendationRequest>('/recommendations', request);
}
