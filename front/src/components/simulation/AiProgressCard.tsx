import type { RunSimulationResponse } from '../../api/simulationRunApi';

type AiProgressCardProps = {
    data: RunSimulationResponse;
};

export default function AiProgressCard({ data }: AiProgressCardProps) {
    const threshold = data.thresholdResults?.[0];
    const rir = data.aiResult?.rir;

    return (
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold">AI 계산 결과</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Spring `/run` API와 FastAPI housing 분석 모듈 연동 결과입니다.
                    </p>
                </div>

                <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-800">
                    {data.resultStatus}
                </span>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border p-4">
                    <p className="text-sm text-gray-500">RIR</p>
                    <p className="mt-1 text-2xl font-bold">
                        {rir !== null && rir !== undefined ? rir : '-'}
                    </p>
                </div>

                <div className="rounded-xl border p-4">
                    <p className="text-sm text-gray-500">위험 점수</p>
                    <p className="mt-1 text-2xl font-bold">{data.riskScore}</p>
                </div>

                <div className="rounded-xl border p-4">
                    <p className="text-sm text-gray-500">신뢰도</p>
                    <p className="mt-1 text-2xl font-bold">{data.confidenceScore}</p>
                </div>
            </div>

            {threshold && (
                <div className="mt-6 rounded-xl border bg-gray-50 p-4">
                    <h3 className="font-semibold">임계치 결과</h3>

                    <div className="mt-3 grid gap-2 text-sm md:grid-cols-2">
                        <p>유형: {threshold.thresholdType}</p>
                        <p>상태: {threshold.status}</p>
                        <p>계산값: {threshold.calculatedValue}</p>
                        <p>기준값: {threshold.thresholdValue}</p>
                        <p>Red Zone: {threshold.isRedZone ? '예' : '아니오'}</p>
                    </div>
                </div>
            )}
        </section>
    );
}