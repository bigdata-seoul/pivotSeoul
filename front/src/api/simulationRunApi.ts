export type RunSimulationRequest = {
    district: string;
    monthly_income: number;
    monthly_housing_cost: number;
};

export type ThresholdResult = {
    thresholdType: string;
    calculatedValue: number | null;
    thresholdValue: number;
    status: string;
    isRedZone: boolean;
};

export type AiResult = {
    district?: string;
    monthly_income?: number;
    monthly_housing_cost?: number;
    rir?: number | null;
    housing_status?: string;
    is_red_zone?: boolean;
    risk_score?: number;
    confidence_score?: number;
    error?: string;
    detail?: string;
    upstream?: string;
};

export type RunSimulationResponse = {
    sessionId: string;
    runStatus: 'COMPLETED' | 'FAILED';
    resultStatus: string;
    riskScore: number;
    confidenceScore: number;
    thresholdResults: ThresholdResult[];
    aiResult: AiResult;
};

const API_BASE_URL =
    (import.meta as any).env?.VITE_API_BASE_URL ?? 'http://localhost:8080';

export async function runSimulation(
    sessionId: string,
    body: RunSimulationRequest
): Promise<RunSimulationResponse> {
    const response = await fetch(
        `${API_BASE_URL}/api/simulation-sessions/${sessionId}/run`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        }
    );

    const data = (await response.json()) as RunSimulationResponse;

    return data;
}