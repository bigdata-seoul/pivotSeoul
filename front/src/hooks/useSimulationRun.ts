import { useState } from 'react';
import {
    runSimulation,
    RunSimulationRequest,
    RunSimulationResponse,
} from '../api/simulationRunApi';

export function useSimulationRun(sessionId: string) {
    const [data, setData] = useState<RunSimulationResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const execute = async (body: RunSimulationRequest) => {
        setIsLoading(true);
        setError(null);
        setData(null);

        try {
            const result = await runSimulation(sessionId, body);
            setData(result);

            if (result.runStatus === 'FAILED') {
                setError(
                    result.aiResult?.detail ??
                    result.aiResult?.error ??
                    'AI 분석 서버 호출에 실패했습니다.'
                );
            }
        } catch (e) {
            setError(
                e instanceof Error
                    ? e.message
                    : '알 수 없는 오류가 발생했습니다.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return {
        data,
        error,
        isLoading,
        execute,
    };
}