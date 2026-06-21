/**
 * Pivot Seoul AI 호출 플로우의 프론트 진입점.
 *
 * 1) 화면/컨텍스트는 이 파일의 함수만 호출한다.
 * 2) 화면은 Spring Boot(`back`)의 `/api/simulation/*` 운영 API를 우선 호출한다.
 * 3) Spring이 내부에서 `/api/ai/*` 게이트웨이를 통해 FastAPI(`lifePivot_`) `/api/v1/*`로 프록시한다.
 * 4) FastAPI는 기능별 파이프라인을 실행하고 JSON을 Spring으로 돌려준다.
 *
 * 브라우저에서 FastAPI 포트를 직접 호출하지 않는 이유:
 * - 인증/검증/저장 경계는 Spring에 둔다.
 * - FastAPI는 계산·추천·RAG·LLM 해설 같은 AI 파이프라인 책임만 가진다.
 *
 * 환경변수: NEXT_PUBLIC_API_BASE (기본 http://localhost:8080)
 */

// ===== 환경 설정 섹션 =====
// 브라우저는 FastAPI를 직접 호출하지 않고 Spring origin만 바라봅니다.
const API_BASE = process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") ?? "http://localhost:8080";

// ===== Spring endpoint 섹션 =====
// SIMULATION은 화면에서 쓰는 운영 API, AI는 Spring 내부 게이트웨이/디버그 API입니다.
const AI = `${API_BASE}/api/ai`;
const SIMULATION = `${API_BASE}/api/simulation`;

// ===== DTO 섹션: Front → Spring → FastAPI 사이에서 공유되는 최소 계약 =====
export interface SimulationPayload {
  life_stage: "youth" | "family" | "senior";
  district: string;
  monthly_income: number;
  target_job: string;
  weekly_study_hours: number;
  child_age?: number | null;
}

export interface LlmExplanationPayload {
  user_summary: string;
  metrics_summary: string;
  rag_snippets: string[];
}

export interface AiGatewayStatus {
  role?: string;
  fastapiBaseUrl?: string;
  fastapiHealthHttpStatus?: number | string;
  fastapiHealthError?: string;
  pipelines?: string;
}


/**
 * POST 계열 호출 공통 함수.
 * base에 따라 운영 API(`/api/simulation`) 또는 AI 게이트웨이(`/api/ai`)로 요청한다.
 */
async function postTo<T>(base: string, path: string, body: unknown): Promise<T> {
  const res = await fetch(`${base}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? "{}" : JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} ${path}: ${text}`);
  }
  return res.json() as Promise<T>;
}

/**
 * GET 계열 메타/조회 호출 공통 함수.
 */
async function getFrom<T>(base: string, path: string): Promise<T> {
  const res = await fetch(`${base}${path}`, { method: "GET" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} ${path}: ${text}`);
  }
  return res.json() as Promise<T>;
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  return postTo<T>(AI, path, body);
}

async function getJson<T>(path: string): Promise<T> {
  return getFrom<T>(AI, path);
}

// ===== 운영 시뮬레이션 요청/응답 섹션 =====
// Results 화면은 이 타입으로 Spring /api/simulation/runs에 한 번만 요청합니다.
export interface IntegratedSimulationRequest {
  profile: unknown;
  scenarioA: unknown;
  scenarioB: unknown;
  scenarioPayloads: { A: SimulationPayload; B: SimulationPayload };
  localRisk: unknown;
}

export interface IntegratedSimulationRun {
  runStatus?: string;
  runId?: string;
  gatewayStatus?: AiGatewayStatus;
  ai?: {
    scenarioA?: unknown;
    scenarioB?: unknown;
    modules?: Record<string, unknown>;
    explanation?: unknown;
    dataSources?: unknown;
  };
  backendVerification?: unknown;
  errors?: unknown[];
}

// ===== 운영 API 함수 섹션: 화면이 실제로 사용하는 주 진입점 =====
export function runIntegratedSimulation(body: IntegratedSimulationRequest) {
  return postTo<IntegratedSimulationRun>(SIMULATION, "/runs", body);
}

export function getLatestSimulationResult() {
  return getFrom<IntegratedSimulationRun>(SIMULATION, "/results/latest");
}

// ===== AI 게이트웨이 직접 호출 섹션 =====
// 운영 화면은 runIntegratedSimulation을 우선 사용하고, 아래 함수들은 Spring 내부 경로 확인/디버그에 남겨둡니다.
/** 게이트웨이·FastAPI 상태 메타 */
export function getAiGatewayStatus() {
  return getJson<AiGatewayStatus>("/status");
}

// 아래 함수명은 기능 모듈명과 1:1 대응한다.
// 예: housingAnalyze → Spring `/api/ai/housing/analyze` → FastAPI `/api/v1/housing/analyze`.
export function housingAnalyze(body: unknown) {
  return postJson("/housing/analyze", body);
}

export function careerRecommend(body: unknown) {
  return postJson("/career/recommend", body);
}

export function childcareAnalyze(body: unknown) {
  return postJson("/childcare/analyze", body);
}

export function seniorAnalyze(body: unknown) {
  return postJson("/senior/analyze", body);
}

export function policyRecommend(body: unknown) {
  return postJson("/policy/recommend", body);
}

export function simulationRun(body: SimulationPayload) {
  return postJson("/simulation/run", body);
}

export function llmExplanationGenerate(body: LlmExplanationPayload) {
  return postJson("/llm-explanation/generate", body);
}

export function dataSourceSources() {
  return getJson<unknown[]>("/data-source/sources");
}

export function dataSourceIngest(body: unknown) {
  return postJson("/data-source/ingest", body);
}

export { API_BASE };
