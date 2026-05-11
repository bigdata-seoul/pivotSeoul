type SimulationErrorCardProps = {
    message: string;
};

export default function SimulationErrorCard({ message }: SimulationErrorCardProps) {
    return (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <h3 className="font-semibold text-red-700">AI 계산 실패</h3>
            <p className="mt-2 text-sm text-red-600">{message}</p>
        </div>
    );
}