// src/pages/ScenarioCompare.tsx

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { GitCompare, ArrowLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { getScenariosBySession } from '../api/scenarioApi';
import { type ScenarioSummaryResponse, VAR_KEY } from '../types/scenario';

/**
 * [페이지] 시나리오 비교
 *
 * 세션 내 저장된 시나리오 목록을 불러와 나란히 비교 표시한다.
 * URL 쿼리 파라미터 ?sessionId={id} 로 세션을 특정한다.
 *
 * 현재 기능:
 * - 세션 내 시나리오 목록 조회 (GET /api/simulations/{sessionId}/scenarios)
 * - 시나리오 2개 선택 후 변수 항목별 비교
 * - 항목별 우위 시나리오 하이라이트
 *
 * TODO: 다중 시나리오 비교(3개 이상) 구현 시 MultiScenarioCompare.tsx로 확장
 * TODO: 자치구 ID → 자치구 이름 변환 (district API 연동)
 * TODO: 시나리오 없을 때 ScenarioForm으로 바로 연결하는 CTA 추가
 */

// 변수 키별 표시 메타 (라벨, 단위, 낮을수록 좋은지 여부)
const VAR_META: Record<string, { label: string; unit: string; lowerIsBetter: boolean }> = {
  [VAR_KEY.INCOME]:       { label: '월 소득',   unit: '만원', lowerIsBetter: false },
  [VAR_KEY.DEPOSIT]:      { label: '보증금',    unit: '만원', lowerIsBetter: true },
  [VAR_KEY.MONTHLY_RENT]: { label: '월세',      unit: '만원', lowerIsBetter: true },
  [VAR_KEY.COMMUTE_TIME]: { label: '통근시간',  unit: '분',   lowerIsBetter: true },
};

export function ScenarioCompare() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { c, isDark } = useTheme();

  const sessionId = Number(searchParams.get('sessionId'));

  const [scenarios, setScenarios] = useState<ScenarioSummaryResponse[]>([]);
  const [selectedIds, setSelectedIds] = useState<[number | null, number | null]>([null, null]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 세션 내 시나리오 목록 로딩
  useEffect(() => {
    if (!sessionId) {
      setError('sessionId가 없습니다.');
      setIsLoading(false);
      return;
    }

    getScenariosBySession(sessionId)
      .then((data) => {
        setScenarios(data);
        // 시나리오가 2개 이상이면 첫 두 개를 기본 선택
        if (data.length >= 2) {
          setSelectedIds([data[0].scenarioId, data[1].scenarioId]);
        } else if (data.length === 1) {
          setSelectedIds([data[0].scenarioId, null]);
        }
      })
      .catch(() => setError('시나리오 목록을 불러오지 못했습니다.'))
      .finally(() => setIsLoading(false));
  }, [sessionId]);

  // 선택된 시나리오 객체 추출
  const scenarioLeft  = scenarios.find(s => s.scenarioId === selectedIds[0]) ?? null;
  const scenarioRight = scenarios.find(s => s.scenarioId === selectedIds[1]) ?? null;

  /** 셀렉트 변경 핸들러 (left: 0, right: 1) */
  const handleSelect = (side: 0 | 1, id: number) => {
    setSelectedIds(prev => {
      const next: [number | null, number | null] = [...prev] as [number | null, number | null];
      next[side] = id;
      return next;
    });
  };

  /** 두 값 비교 → 우위 측 반환 ('left' | 'right' | 'tie') */
  const getWinner = (leftVal: string | undefined, rightVal: string | undefined, lowerIsBetter: boolean) => {
    const l = Number(leftVal ?? 0);
    const r = Number(rightVal ?? 0);
    if (l === r) return 'tie';
    return (lowerIsBetter ? l < r : l > r) ? 'left' : 'right';
  };

  // ── 렌더 분기 ──

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p style={{ color: c.textMuted, fontSize: '0.9rem' }}>불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3">
        <p style={{ color: c.error, fontSize: '0.9rem' }}>{error}</p>
        <button onClick={() => navigate(-1)} style={{ color: c.primary, fontSize: '0.85rem' }}>
          돌아가기
        </button>
      </div>
    );
  }

  if (scenarios.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3 p-6 text-center">
        <GitCompare size={36} style={{ color: c.textMuted }} />
        <p style={{ color: c.text, fontWeight: 600 }}>저장된 시나리오가 없어요</p>
        <p style={{ color: c.textMuted, fontSize: '0.85rem' }}>
          시나리오를 먼저 생성해 주세요.
        </p>
        {/* TODO: ScenarioForm 모달 또는 /scenario 페이지로 이동 CTA 추가 */}
        <button
          onClick={() => navigate('/scenario')}
          className="px-4 py-2 rounded-xl font-medium"
          style={{ background: c.primaryBg, color: c.primary, border: `1px solid ${c.primaryBorder}`, fontSize: '0.85rem' }}
        >
          시나리오 만들기
        </button>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto scrollbar-none p-4 md:p-6 space-y-4 md:space-y-5">

      {/* 페이지 헤더 */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl transition-all"
          style={{ background: c.card, border: `1px solid ${c.borderSoft}` }}
        >
          <ArrowLeft size={16} style={{ color: c.textSec }} />
        </button>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <GitCompare size={14} style={{ color: c.primary }} />
            <span style={{ color: c.textSec, fontSize: '0.73rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              시나리오 비교
            </span>
          </div>
          <h2 style={{ color: c.text, fontSize: 'clamp(1rem, 3vw, 1.22rem)', fontWeight: 700 }}>
            두 시나리오를 항목별로 비교해보세요
          </h2>
        </div>
      </div>

      {/* 시나리오 선택 드롭다운 */}
      <div className="grid grid-cols-2 gap-3">
        {([0, 1] as const).map((side) => (
          <div key={side}>
            <label
              style={{ color: c.textMuted, fontSize: '0.72rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}
            >
              {side === 0 ? '비교 대상 A' : '비교 대상 B'}
            </label>
            <select
              value={selectedIds[side] ?? ''}
              onChange={(e) => handleSelect(side, Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl outline-none appearance-none cursor-pointer"
              style={{
                background: c.inputBg,
                border: `1px solid ${side === 0 ? c.primaryBorder : c.successBorder}`,
                color: c.text,
                fontSize: '0.88rem',
              }}
            >
              <option value="" disabled>시나리오 선택</option>
              {scenarios.map(s => (
                <option
                  key={s.scenarioId}
                  value={s.scenarioId}
                  disabled={s.scenarioId === selectedIds[side === 0 ? 1 : 0]} // 반대쪽에서 선택된 항목 비활성화
                  style={{ background: isDark ? '#1E293B' : '#fff' }}
                >
                  {s.scenarioTitle}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* 비교 테이블 — 두 시나리오 모두 선택됐을 때만 표시 */}
      {scenarioLeft && scenarioRight ? (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow }}
        >
          {/* 테이블 헤더 */}
          <div
            className="grid grid-cols-3 px-4 py-3 text-center"
            style={{ background: isDark ? 'rgba(15,23,42,0.6)' : '#F1F5F9' }}
          >
            <span style={{ color: c.primary, fontWeight: 700, fontSize: '0.85rem' }}>
              {scenarioLeft.scenarioTitle}
            </span>
            <span style={{ color: c.textMuted, fontSize: '0.75rem', alignSelf: 'center' }}>항목</span>
            <span style={{ color: c.success, fontWeight: 700, fontSize: '0.85rem' }}>
              {scenarioRight.scenarioTitle}
            </span>
          </div>

          {/* 자치구 비교 행 */}
          <CompareRow
            leftContent={`${scenarioLeft.currentDistrictId}구 → ${scenarioLeft.compareDistrictId}구`}
            rightContent={`${scenarioRight.currentDistrictId}구 → ${scenarioRight.compareDistrictId}구`}
            label="자치구"
            winner="tie"
            c={c}
          />

          {/* 변수 항목별 비교 행 */}
          {Object.entries(VAR_META).map(([key, meta]) => {
            const lv = scenarioLeft.variables[key as keyof typeof scenarioLeft.variables];
            const rv = scenarioRight.variables[key as keyof typeof scenarioRight.variables];
            const winner = getWinner(lv, rv, meta.lowerIsBetter);

            return (
              <CompareRow
                key={key}
                leftContent={lv ? `${Number(lv).toLocaleString()} ${meta.unit}` : '-'}
                rightContent={rv ? `${Number(rv).toLocaleString()} ${meta.unit}` : '-'}
                label={meta.label}
                winner={winner}
                c={c}
              />
            );
          })}
        </div>
      ) : (
        // 선택 미완료 안내
        <div
          className="rounded-2xl p-8 text-center"
          style={{ background: c.card, border: `1px solid ${c.borderSoft}` }}
        >
          <p style={{ color: c.textMuted, fontSize: '0.88rem' }}>
            비교할 시나리오 두 개를 선택해 주세요.
          </p>
        </div>
      )}

    </div>
  );
}

// ========================
// CompareRow — 항목별 비교 행
// ========================

interface CompareRowProps {
  leftContent: string;
  rightContent: string;
  label: string;
  winner: 'left' | 'right' | 'tie';
  c: ReturnType<typeof useTheme>['c'];
}

/**
 * [서브 컴포넌트] 비교 테이블 1행
 * 좌(A) / 항목명 / 우(B) 3열 구조로 표시하고
 * 우위 측에 아이콘 + 배경 하이라이트를 적용
 */
function CompareRow({ leftContent, rightContent, label, winner, c }: CompareRowProps) {
  const WinIcon   = () => <TrendingDown size={11} style={{ color: c.success }} />;
  const LoseIcon  = () => <TrendingUp   size={11} style={{ color: c.error }}   />;
  const TieIcon   = () => <Minus        size={11} style={{ color: c.textMuted }} />;

  return (
    <div
      className="grid grid-cols-3 px-4 py-3 text-center items-center"
      style={{ borderTop: `1px solid ${c.borderSoft}` }}
    >
      {/* 왼쪽(A) 값 */}
      <div
        className="flex items-center justify-center gap-1 rounded-lg px-2 py-1"
        style={{
          background: winner === 'left' ? c.successBg : 'transparent',
          fontWeight: winner === 'left' ? 700 : 400,
          color: winner === 'left' ? c.success : winner === 'right' ? c.error : c.text,
          fontSize: '0.85rem',
        }}
      >
        {winner === 'left' && <WinIcon />}
        {winner === 'right' && <LoseIcon />}
        {winner === 'tie' && <TieIcon />}
        {leftContent}
      </div>

      {/* 항목명 (가운데) */}
      <span style={{ color: c.textMuted, fontSize: '0.72rem' }}>{label}</span>

      {/* 오른쪽(B) 값 */}
      <div
        className="flex items-center justify-center gap-1 rounded-lg px-2 py-1"
        style={{
          background: winner === 'right' ? c.successBg : 'transparent',
          fontWeight: winner === 'right' ? 700 : 400,
          color: winner === 'right' ? c.success : winner === 'left' ? c.error : c.text,
          fontSize: '0.85rem',
        }}
      >
        {winner === 'right' && <WinIcon />}
        {winner === 'left' && <LoseIcon />}
        {winner === 'tie' && <TieIcon />}
        {rightContent}
      </div>
    </div>
  );
}
