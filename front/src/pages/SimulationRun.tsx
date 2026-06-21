import RunButton from '../components/simulation/RunButton';
import LoadingState from '../components/simulation/LoadingState';
import AiProgressCard from '../components/simulation/AiProgressCard';
import SimulationErrorCard from '../components/simulation/SimulationErrorCard';
import { useSimulationRun } from '../hooks/useSimulationRun';

export function SimulationRun() {
    const sessionId = '1';

    const { data, error, isLoading, execute } = useSimulationRun(sessionId);

    const handleRun = () => {
        execute({
            district: '강남구',
            monthly_income: 2500000,
            monthly_housing_cost: 800000,
        });
    };

    return (
        <main className="mx-auto max-w-4xl px-6 py-10">
            <section className="rounded-3xl bg-gray-50 p-8">
                <p className="text-sm font-semibold text-blue-600">AI 계산 엔진</p>
                <h1 className="mt-2 text-3xl font-bold">시뮬레이션 실행 상태 UI</h1>
                <p className="mt-3 text-gray-600">
                    Spring `/run` API를 통해 FastAPI housing 분석 모듈을 호출하고,
                    RIR·위험 점수·임계치 결과를 확인합니다.
                </p>

                <div className="mt-6 rounded-2xl border bg-white p-5">
                    <h2 className="font-semibold">테스트 입력값</h2>
                    <div className="mt-3 grid gap-2 text-sm text-gray-700 md:grid-cols-3">
                        <p>지역: 강남구</p>
                        <p>월소득: 2,500,000원</p>
                        <p>월주거비: 800,000원</p>
                    </div>
                </div>

                <div className="mt-6">
                    <RunButton onClick={handleRun} disabled={isLoading} />
                </div>
            </section>

            <section className="mt-6 space-y-4">
                {isLoading && <LoadingState />}
                {error && <SimulationErrorCard message={error} />}
                {data && data.runStatus === 'COMPLETED' && <AiProgressCard data={data} />}
            </section>
        </main>
    );
}