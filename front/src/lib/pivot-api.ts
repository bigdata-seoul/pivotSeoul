/**
 * 브라우저 → Spring Boot(`back`) → FastAPI(`lifePivot_`) 연결.
 * 절대 FastAPI 포트를 프론트에서 직접 치지 않고, 항상 Spring `/api/ai/*` 만 사용.
 *
 * 환경변수: NEXT_PUBLIC_API_BASE (기본 http://localhost:8080)
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") ?? "http://localhost:8080";

const AI = `${API_BASE}/api/ai`;

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${AI}${path}`, {
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

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${AI}${path}`, { method: "GET" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} ${path}: ${text}`);
  }
  return res.json() as Promise<T>;
}

/** 게이트웨이·FastAPI 헬스 메타 */
export function getAiGatewayStatus() {
  return getJson<Record<string, unknown>>("/status");
}

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

export function simulationRun(body: unknown) {
  return postJson("/simulation/run", body);
}

export function llmExplanationGenerate(body: unknown) {
  return postJson("/llm-explanation/generate", body);
}

export function dataSourceSources() {
  return getJson<unknown[]>("/data-source/sources");
}

export function dataSourceIngest(body: unknown) {
  return postJson("/data-source/ingest", body);
}

export { API_BASE };
