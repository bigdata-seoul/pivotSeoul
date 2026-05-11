// src/api/scenarioApi.ts

import type {
  CreateScenarioRequest,
  CreateScenarioResponse,
  UpdateScenarioRequest,
  ScenarioSummaryResponse,
  ScenarioVariableRequest,
  ScenarioVariableBulkRequest,
  ScenarioVariableResponse,
} from '../types/scenario';

/**
 * [API] 시나리오 관련 백엔드 호출 함수 모음
 *
 * 현재 엔드포인트:
 *   POST   /api/simulations/{sessionId}/scenarios
 *   GET    /api/simulations/{sessionId}/scenarios
 *   GET    /api/scenarios/{scenarioId}
 *   PATCH  /api/scenarios/{scenarioId}
 *   DELETE /api/scenarios/{scenarioId}
 *   POST   /api/scenarios/{scenarioId}/variables
 *   POST   /api/scenarios/{scenarioId}/variables/bulk
 *   GET    /api/scenarios/{scenarioId}/variables
 */

/**
 * API 기본 URL
 *
 * Next.js 기준:
 * .env.local
 * NEXT_PUBLIC_API_URL=http://localhost:8080
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

/**
 * 공통 fetch 래퍼
 */
async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!res.ok) {
    const message = await res.text();

    throw new Error(
      `[${res.status}] ${path} - ${message}`
    );
  }

  /**
   * DELETE 등 204 응답 처리
   */
  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

// ========================
// 시나리오 CRUD
// ========================

/**
 * 시나리오 생성
 * POST /api/simulations/{sessionId}/scenarios
 */
export const createScenario = (
  sessionId: number,
  body: CreateScenarioRequest
): Promise<CreateScenarioResponse> =>
  request(`/api/simulations/${sessionId}/scenarios`, {
    method: 'POST',
    body: JSON.stringify(body),
  });

/**
 * 세션 내 시나리오 목록 조회
 * GET /api/simulations/{sessionId}/scenarios
 */
export const getScenariosBySession = (
  sessionId: number
): Promise<ScenarioSummaryResponse[]> =>
  request(`/api/simulations/${sessionId}/scenarios`);

/**
 * 시나리오 단건 조회
 * GET /api/scenarios/{scenarioId}
 */
export const getScenario = (
  scenarioId: number
): Promise<ScenarioSummaryResponse> =>
  request(`/api/scenarios/${scenarioId}`);

/**
 * 시나리오 수정
 * PATCH /api/scenarios/{scenarioId}
 */
export const updateScenario = (
  scenarioId: number,
  body: UpdateScenarioRequest
): Promise<ScenarioSummaryResponse> =>
  request(`/api/scenarios/${scenarioId}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });

/**
 * 시나리오 삭제
 * DELETE /api/scenarios/{scenarioId}
 */
export const deleteScenario = (
  scenarioId: number
): Promise<void> =>
  request(`/api/scenarios/${scenarioId}`, {
    method: 'DELETE',
  });

// ========================
// 시나리오 변수
// ========================

/**
 * 변수 단건 저장
 * POST /api/scenarios/{scenarioId}/variables
 */
export const saveVariable = (
  scenarioId: number,
  body: ScenarioVariableRequest
): Promise<ScenarioVariableResponse> =>
  request(`/api/scenarios/${scenarioId}/variables`, {
    method: 'POST',
    body: JSON.stringify(body),
  });

/**
 * 변수 복수 저장
 * POST /api/scenarios/{scenarioId}/variables/bulk
 */
export const saveVariablesBulk = (
  scenarioId: number,
  body: ScenarioVariableBulkRequest
): Promise<ScenarioVariableResponse[]> =>
  request(`/api/scenarios/${scenarioId}/variables/bulk`, {
    method: 'POST',
    body: JSON.stringify(body),
  });

/**
 * 변수 목록 조회
 * GET /api/scenarios/{scenarioId}/variables
 */
export const getVariables = (
  scenarioId: number
): Promise<ScenarioVariableResponse[]> =>
  request(`/api/scenarios/${scenarioId}/variables`);