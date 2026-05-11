type RunButtonProps = {
    onClick: () => void;
    disabled?: boolean;
};

export default function RunButton({ onClick, disabled }: RunButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
            {disabled ? 'AI 계산 실행 중...' : 'AI 시뮬레이션 실행'}
        </button>
    );
}