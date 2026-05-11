// src/types/scenario.ts

/**
 * [Types] 시나리오 관련 TypeScript 타입 정의
 *
 * 백엔드 DTO와 1:1 대응되도록 유지한다.
 * - CreateScenarioRequest.java
 * - CreateScenarioResponse.java
 * - ScenarioVariableRequest.java
 * - ScenarioVariableResponse.java
 * - ScenarioSummaryResponse.java
 */

// ========================
// 공통 상수
// ========================

/**
 * 시나리오 유형 — 생애 단계 구분
 * 백엔드 scenarioType 문자열과 일치시켜야 한다.
 * TODO: 청년/신혼·출산/노년 외 생애 단계 추가 시 여기에 값 추가
 */
export const SCENARIO_TYPE = {
    YOUTH: 'YOUTH',         // 청년
    NEWLYWED: 'NEWLYWED',   // 신혼·출산
    SENIOR: 'SENIOR',       // 노년
  } as const;
  
  export type ScenarioType = typeof SCENARIO_TYPE[keyof typeof SCENARIO_TYPE];
  
  /**
   * 시나리오 변수 키 — 조건 변수 종류 구분
   * 백엔드 ScenarioVariable.varKey 문자열과 일치시켜야 한다.
   * TODO: 사용자 직접 변수 추가 기능 구현 시 동적 키 처리 방식 검토
   */
  export const VAR_KEY = {
    INCOME: 'INCOME',               // 소득 (만원)
    DEPOSIT: 'DEPOSIT',             // 보증금 (만원)
    MONTHLY_RENT: 'MONTHLY_RENT',   // 월세 (만원)
    COMMUTE_TIME: 'COMMUTE_TIME',   // 통근시간 (분)
  } as const;
  
  export type VarKey = typeof VAR_KEY[keyof typeof VAR_KEY];
  
  // ========================
  // 요청 타입 (Request)
  // ========================
  
  /**
   * 시나리오 생성 요청
   * POST /api/simulations/{sessionId}/scenarios
   * 대응 백엔드: CreateScenarioRequest.java
   */
  export interface CreateScenarioRequest {
    scenarioType: ScenarioType;
    currentDistrictId: number;
    compareDistrictId: number;
    /** 미입력 시 백엔드에서 자동 생성 ("시나리오 N") */
    scenarioTitle?: string;
    /** 미입력 시 백엔드에서 자동 부여 */
    displayOrder?: number;
  }
  
  /**
   * 시나리오 수정 요청
   * PATCH /api/scenarios/{scenarioId}
   * 수정 가능한 필드만 포함 (scenarioId, sessionId 제외)
   */
  export interface UpdateScenarioRequest {
    scenarioTitle?: string;
    currentDistrictId?: number;
    compareDistrictId?: number;
    displayOrder?: number;
  }
  
  /**
   * 시나리오 변수 단건 저장 요청
   * POST /api/scenarios/{scenarioId}/variables
   * 대응 백엔드: ScenarioVariableRequest.java
   */
  export interface ScenarioVariableRequest {
    varKey: VarKey;
    varValue: string; // 수치도 문자열로 전송 (백엔드 저장 방식과 일치)
  }
  
  /**
   * 시나리오 변수 복수 저장 요청
   * POST /api/scenarios/{scenarioId}/variables/bulk
   * TODO: 복수 저장 API 연동 시 사용
   */
  export interface ScenarioVariableBulkRequest {
    variables: ScenarioVariableRequest[];
  }
  
  // ========================
  // 응답 타입 (Response)
  // ========================
  
  /**
   * 시나리오 생성 응답
   * 대응 백엔드: CreateScenarioResponse.java
   */
  export interface CreateScenarioResponse {
    scenarioId: number;
    sessionId: number;
    scenarioType: ScenarioType;
    currentDistrictId: number;
    compareDistrictId: number;
    scenarioTitle: string;
    displayOrder: number;
  }
  
  /**
   * 시나리오 요약 응답 (변수 포함)
   * GET /api/simulations/{sessionId}/scenarios
   * GET /api/scenarios/{scenarioId}
   * 대응 백엔드: ScenarioSummaryResponse.java
   *
   * variables는 백엔드에서 { varKey: varValue } Map으로 변환해 제공
   * 예: { INCOME: "3000000", DEPOSIT: "50000000" }
   */
  export interface ScenarioSummaryResponse {
    scenarioId: number;
    sessionId: number;
    scenarioType: ScenarioType;
    currentDistrictId: number;
    compareDistrictId: number;
    scenarioTitle: string;
    displayOrder: number;
    variables: Partial<Record<VarKey, string>>;
  }
  
  /**
   * 시나리오 변수 단건 응답
   * 대응 백엔드: ScenarioVariableResponse.java
   */
  export interface ScenarioVariableResponse {
    variableId: number;
    scenarioId: number;
    varKey: VarKey;
    varValue: string;
  }
  