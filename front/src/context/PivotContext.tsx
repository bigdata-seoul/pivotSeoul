import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  runIntegratedSimulation,
  type AiGatewayStatus,
  type IntegratedSimulationRun,
  type SimulationPayload,
} from '../lib/pivot-api';

export type LifeStage = 'youth' | 'family' | 'senior';

export interface UserProfile {
  lifeStage: LifeStage | null;
  name: string;
  currentDistrict: string;
  compareDistrict: string;
  monthlyIncome: number;
  monthlyHousing: number;
  monthlyLiving: number;
  commuteTime: number;
  childcareCost: number;
  returnToWorkMonths: number;
  retirementAge: number;
  savings: number;
}

export interface ScenarioConditions {
  district: string;
  monthlyHousing: number;
  commuteTime: number;
  childcareCost: number;
  applyPolicy: boolean;
  downsizing: boolean;
  returnToWorkMonths: number;
  extraIncome: number;
}

export interface RiskAnalysis {
  overallScore: number;
  status: 'safe' | 'warning' | 'danger';
  housingRatio: number;
  housingStatus: 'safe' | 'warning' | 'danger';
  commuteStatus: 'safe' | 'warning' | 'danger';
  childcareRatio: number;
  childcareStatus: 'safe' | 'warning' | 'danger';
  monthlySurplus: number;
  surplusStatus: 'safe' | 'warning' | 'danger';
}

// ===== AI 분석 상태 섹션 =====
// Spring /api/simulation/runs 응답을 UI가 바로 읽을 수 있도록 평탄화해 보관합니다.
export interface AiAnalysisState {
  status: 'idle' | 'loading' | 'success' | 'error';
  error?: string;
  gatewayStatus?: AiGatewayStatus;
  scenarioA?: unknown;
  scenarioB?: unknown;
  modules?: Record<string, unknown>;
  explanation?: unknown;
  dataSources?: unknown;
  backendRun?: IntegratedSimulationRun;
  backendVerification?: unknown;
  lastUpdated?: string;
}

interface PivotContextType {
  sessionId: number | null;
  setSessionId: (sessionId: number | null) => void;
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  scenarioA: ScenarioConditions;
  scenarioB: ScenarioConditions;
  updateScenarioA: (updates: Partial<ScenarioConditions>) => void;
  updateScenarioB: (updates: Partial<ScenarioConditions>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isOnboarded: boolean;
  setIsOnboarded: (v: boolean) => void;
  calculateRisk: (scenario: ScenarioConditions, income: number) => RiskAnalysis;
  aiAnalysis: AiAnalysisState;
  runAiAnalysis: () => Promise<AiAnalysisState>;
}

// ===== 기본 입력값 섹션: 데모/초기 화면에서 사용할 비식별 예시 값 =====
const defaultProfile: UserProfile = {
  lifeStage: null,
  name: '김서울',
  currentDistrict: '마포구',
  compareDistrict: '노원구',
  monthlyIncome: 350,
  monthlyHousing: 120,
  monthlyLiving: 150,
  commuteTime: 55,
  childcareCost: 60,
  returnToWorkMonths: 12,
  retirementAge: 65,
  savings: 5000,
};

const defaultScenarioA: ScenarioConditions = {
  district: '마포구',
  monthlyHousing: 120,
  commuteTime: 55,
  childcareCost: 60,
  applyPolicy: false,
  downsizing: false,
  returnToWorkMonths: 12,
  extraIncome: 0,
};

const defaultScenarioB: ScenarioConditions = {
  district: '노원구',
  monthlyHousing: 72,
  commuteTime: 75,
  childcareCost: 40,
  applyPolicy: true,
  downsizing: true,
  returnToWorkMonths: 6,
  extraIncome: 30,
};

const PivotContext = createContext<PivotContextType | null>(null);
const SESSION_ID_STORAGE_KEY = 'pivotseoul-session-id';

function readStoredSessionId() {
  if (typeof window === 'undefined') return null;

  const storedSessionId = window.localStorage.getItem(SESSION_ID_STORAGE_KEY);
  if (!storedSessionId) return null;

  const parsedSessionId = Number(storedSessionId);
  if (Number.isFinite(parsedSessionId) && parsedSessionId > 0) {
    return parsedSessionId;
  }

  window.localStorage.removeItem(SESSION_ID_STORAGE_KEY);
  return null;
}

/**
 * 프로토타입 UI용 가벼운 도메인 리스크 계산기입니다.
 *
 * 참고:
 * - 이 함수는 의도적으로 결정적이며 로컬에서만 동작합니다.
 * - 백엔드 연동 시 UI 호환성을 위해 반환 형태(`RiskAnalysis`)는 유지하고,
 *   고정 상수만 모델 출력값으로 교체하면 됩니다.
 */
function calculateRisk(scenario: ScenarioConditions, income: number): RiskAnalysis {
  const housingRatio = (scenario.monthlyHousing / income) * 100;
  const childcareRatio = (scenario.childcareCost / income) * 100;
  const policyBonus = scenario.applyPolicy ? 30 : 0;
  const monthlySurplus = income - scenario.monthlyHousing - scenario.childcareCost - 130 + policyBonus + scenario.extraIncome;

  const housingStatus: 'safe' | 'warning' | 'danger' =
    housingRatio < 28 ? 'safe' : housingRatio < 38 ? 'warning' : 'danger';
  const commuteStatus: 'safe' | 'warning' | 'danger' =
    scenario.commuteTime < 50 ? 'safe' : scenario.commuteTime < 70 ? 'warning' : 'danger';
  const childcareStatus: 'safe' | 'warning' | 'danger' =
    childcareRatio < 12 ? 'safe' : childcareRatio < 18 ? 'warning' : 'danger';
  const surplusStatus: 'safe' | 'warning' | 'danger' =
    monthlySurplus > 80 ? 'safe' : monthlySurplus > 20 ? 'warning' : 'danger';

  const toScore = (s: 'safe' | 'warning' | 'danger') => s === 'safe' ? 15 : s === 'warning' ? 45 : 85;

  const overallScore = Math.round(
    toScore(housingStatus) * 0.3 +
    toScore(commuteStatus) * 0.2 +
    toScore(childcareStatus) * 0.2 +
    toScore(surplusStatus) * 0.3
  );

  const status: 'safe' | 'warning' | 'danger' =
    overallScore < 35 ? 'safe' : overallScore < 65 ? 'warning' : 'danger';

  return {
    overallScore,
    status,
    housingRatio,
    housingStatus,
    commuteStatus,
    childcareRatio,
    childcareStatus,
    monthlySurplus,
    surplusStatus,
  };
}

// ===== 요청 변환 섹션: UI 상태를 FastAPI가 이해하는 생애단계별 payload로 바꿉니다. =====
function targetJobFor(stage: LifeStage | null): string {
  if (stage === 'senior') return '노후 생활 안정';
  if (stage === 'family') return '복직 및 돌봄 병행';
  return '커리어 전환';
}

function childAgeFor(profile: UserProfile): number | null {
  if (profile.lifeStage !== 'family') return null;
  return Math.max(0, Math.min(7, 7 - Math.round(profile.returnToWorkMonths / 3)));
}

function toSimulationPayload(profile: UserProfile, scenario: ScenarioConditions): SimulationPayload {
  return {
    life_stage: profile.lifeStage ?? 'family',
    district: scenario.district,
    monthly_income: profile.monthlyIncome,
    target_job: targetJobFor(profile.lifeStage),
    weekly_study_hours: profile.lifeStage === 'youth' ? 8 : 2,
    child_age: childAgeFor(profile),
  };
}

// ===== 응답 정규화 섹션: Spring run 결과 envelope에서 body/errors만 꺼내 UI 상태로 변환합니다. =====
function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function settledValue(result: PromiseSettledResult<unknown>): unknown {
  return result.status === 'fulfilled' ? result.value : undefined;
}

function settledError(result: PromiseSettledResult<unknown>): string | undefined {
  return result.status === 'rejected' ? errorMessage(result.reason) : undefined;
}

function responseBody(value: unknown): unknown {
  if (!value || typeof value !== 'object') return value;
  const body = (value as Record<string, unknown>).body;
  return body === undefined ? value : body;
}

function responseError(value: unknown): string | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const errors = (value as Record<string, unknown>).errors;
  return Array.isArray(errors) && errors.length ? JSON.stringify(errors) : undefined;
}

// ===== Provider 섹션: 입력 상태, 로컬 fallback 계산, Spring 통합 실행을 화면에 제공합니다. =====
export const PivotProvider = ({ children }: { children: React.ReactNode }) => {
  const [sessionId, setSessionIdState] = useState<number | null>(() => readStoredSessionId());
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [scenarioA, setScenarioA] = useState<ScenarioConditions>(defaultScenarioA);
  const [scenarioB, setScenarioB] = useState<ScenarioConditions>(defaultScenarioB);
  const [currentStep, setCurrentStep] = useState(0);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AiAnalysisState>({ status: 'idle' });

  useEffect(() => {
    setSessionIdState(readStoredSessionId());
  }, []);

  const setSessionId = (nextSessionId: number | null) => {
    setSessionIdState(nextSessionId);
    if (typeof window === 'undefined') return;

    if (nextSessionId) {
      window.localStorage.setItem(SESSION_ID_STORAGE_KEY, String(nextSessionId));
    } else {
      window.localStorage.removeItem(SESSION_ID_STORAGE_KEY);
    }
  };

  // 부분 업데이트로 각 입력 화면을 분리합니다. 각 화면은 자신이 담당하는 필드만 수정합니다.
  const updateProfile = (updates: Partial<UserProfile>) => setProfile(prev => ({ ...prev, ...updates }));
  const updateScenarioA = (updates: Partial<ScenarioConditions>) => setScenarioA(prev => ({ ...prev, ...updates }));
  const updateScenarioB = (updates: Partial<ScenarioConditions>) => setScenarioB(prev => ({ ...prev, ...updates }));

  const runAiAnalysis = useCallback(async (): Promise<AiAnalysisState> => {
    setAiAnalysis(prev => ({ ...prev, status: 'loading', error: undefined }));

    const payloadA = toSimulationPayload(profile, scenarioA);
    const payloadB = toSimulationPayload(profile, scenarioB);
    const riskA = calculateRisk(scenarioA, profile.monthlyIncome);
    const riskB = calculateRisk(scenarioB, profile.monthlyIncome);

    // 프론트는 운영 API(`/api/simulation/runs`)만 호출합니다.
    // Spring이 내부에서 AI 게이트웨이와 FastAPI 모듈들을 모두 호출하고, 결과를 검증/정규화한 형태로 돌려줍니다.
    const [backendRun] = await Promise.allSettled([
      runIntegratedSimulation({
        profile,
        scenarioA,
        scenarioB,
        scenarioPayloads: { A: payloadA, B: payloadB },
        localRisk: { A: riskA, B: riskB },
      }),
    ]);

    const backendValue = settledValue(backendRun) as IntegratedSimulationRun | undefined;
    const errors = [
      settledError(backendRun),
      responseError(backendValue),
    ].filter(Boolean);

    // Spring 응답은 모듈별 `{ httpStatus, ok, body }` envelope이므로
    // 화면이 쓰기 쉽게 body만 꺼내고, run 메타는 backendRun에 그대로 보존합니다.
    const next: AiAnalysisState = {
      status: errors.length ? 'error' : 'success',
      error: errors.join(' | ') || undefined,
      gatewayStatus: backendValue?.gatewayStatus,
      scenarioA: responseBody(backendValue?.ai?.scenarioA),
      scenarioB: responseBody(backendValue?.ai?.scenarioB),
      modules: Object.entries(backendValue?.ai?.modules ?? {}).reduce<Record<string, unknown>>((acc, [key, value]) => {
        acc[key] = responseBody(value);
        return acc;
      }, {}),
      explanation: responseBody(backendValue?.ai?.explanation),
      dataSources: responseBody(backendValue?.ai?.dataSources),
      backendRun: backendValue,
      backendVerification: backendValue?.backendVerification,
      lastUpdated: new Date().toISOString(),
    };

    setAiAnalysis(next);
    return next;
  }, [profile, scenarioA, scenarioB]);

  return (
    <PivotContext.Provider value={{
      sessionId, setSessionId,
      profile, updateProfile,
      scenarioA, scenarioB, updateScenarioA, updateScenarioB,
      currentStep, setCurrentStep,
      isOnboarded, setIsOnboarded,
      calculateRisk,
      aiAnalysis, runAiAnalysis,
    }}>
      {children}
    </PivotContext.Provider>
  );
};

export const usePivot = () => {
  const ctx = useContext(PivotContext);
  if (!ctx) throw new Error('usePivot must be used within PivotProvider');
  return ctx;
};
