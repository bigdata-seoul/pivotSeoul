export default function LoadingState() {
    return (
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <p className="font-semibold text-blue-900">AI 계산을 실행 중입니다.</p>
            <p className="mt-2 text-sm text-blue-700">
                FastAPI housing 분석 모듈에서 RIR, 위험 점수, 임계치 결과를 계산하고 있습니다.
            </p>
        </div>
    );
}