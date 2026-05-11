export interface CreateSessionRequest {
  lifeStageCode: string; // YOUTH, FAMILY, SENIOR
  currentDistrict: string;
  compareDistrict?: string;
  monthlyIncome: number;
  monthlyHousing: number;
  monthlyLiving: number;
  commuteTime: number;
  childcareCost: number;
  returnToWorkMonths: number;
  retirementAge: number;
  savings: number;
}

export interface CreateSessionResponse {
  sessionId: string; // sessionUuid 대신 프론트엔드와 통일된 명칭
}

export interface UserConditionData {
  currentDistrict: string;
  compareDistrict?: string;
  monthlyIncome: number;
  monthlyHousing: number;
  monthlyLiving: number;
  commuteTime: number;
  childcareCost: number;
  returnToWorkMonths: number;
  retirementAge: number;
  savings: number;
}

export interface SimulationSessionDetail {
  sessionId: string;
  lifeStageCode: string;
  sessionStatus: string;
  userCondition: UserConditionData;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080';

export async function createSimulationSession(data: CreateSessionRequest): Promise<CreateSessionResponse> {
  const response = await fetch(`${API_BASE}/api/simulations/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create simulation session');
  }

  return response.json();
}

export async function getSimulationSession(sessionId: string): Promise<SimulationSessionDetail> {
  const response = await fetch(`${API_BASE}/api/simulations/sessions/${sessionId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch session details');
  }
  return response.json();
}