// src/components/scenario/ScenarioForm.tsx

import React, { useState } from 'react';
import CompareConditionForm, { type CompareCondition } from './CompareConditionForm';
import { type District } from './DistrictSelector';
import { type VarKey, VAR_KEY } from '../../types/scenario';
import { createScenario, saveVariablesBulk } from '../../api/scenarioApi';

/**
 * [컴포넌트] 시나리오 생성 폼
 *
 * 시나리오 생성 전체 흐름을 담당한다.
 * 1. CompareConditionForm으로 조건 입력
 * 2. 제출 시 POST /api/simulations/{sessionId}/scenarios 호출
 * 3. 생성된 scenarioId로 변수 bulk 저장
 *
 * TODO: 수정 모드(initialData props) 추가 시 PATCH 흐름으로 분기
 * TODO: 폼 유효성 검사 라이브러리(react-hook-form 등) 연동 권장
 */

interface ScenarioFormProps {
  sessionId: number;
  districts: District[];
  /** 생성 완료 후 부모에게 scenarioId 전달 */
  onSuccess: (scenarioId: number) => void;
  onCancel?: () => void;
}

/** 초기 조건 상태 */
const INITIAL_CONDITION: CompareCondition = {
  scenarioType: null,
  currentDistrictId: null,
  compareDistrictId: null,
  variables: {},
};

const ScenarioForm: React.FC<ScenarioFormProps> = ({
  sessionId,
  districts,
  onSuccess,
  onCancel,
}) => {
  const [condition, setCondition] = useState<CompareCondition>(INITIAL_CONDITION);
  const [scenarioTitle, setScenarioTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /** 폼 유효성 검사 */
  const validate = (): string | null => {
    if (!condition.scenarioType) return '생애 단계를 선택해 주세요.';
    if (!condition.currentDistrictId) return '현재 거주 자치구를 선택해 주세요.';
    if (!condition.compareDistrictId) return '비교 자치구를 선택해 주세요.';
    return null;
  };

  /** 제출 핸들러 */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const validationError = validate();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      // 1단계: 시나리오 생성
      const created = await createScenario(sessionId, {
        scenarioType: condition.scenarioType!,
        currentDistrictId: condition.currentDistrictId!,
        compareDistrictId: condition.compareDistrictId!,
        scenarioTitle: scenarioTitle.trim() || undefined,
      });

      // 2단계: 입력된 변수 bulk 저장 (값이 있는 변수만 전송)
      const variables = (Object.keys(condition.variables) as VarKey[])
        .filter((key) => condition.variables[key] !== '')
        .map((key) => ({ varKey: key, varValue: condition.variables[key]! }));

      if (variables.length > 0) {
        await saveVariablesBulk(created.scenarioId, { variables });
      }

      onSuccess(created.scenarioId);
    } catch (err) {
      setErrorMessage('시나리오 저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="scenario-form" onSubmit={handleSubmit}>

      {/* 시나리오 제목 (선택 입력) */}
      <div className="form-section">
        <label className="form-label">시나리오 제목 (선택)</label>
        <input
          type="text"
          value={scenarioTitle}
          placeholder="미입력 시 자동 생성됩니다"
          maxLength={50}
          onChange={(e) => setScenarioTitle(e.target.value)}
          className="form-input"
          disabled={isSubmitting}
        />
      </div>

      {/* 조건 입력 */}
      <CompareConditionForm
        condition={condition}
        districts={districts}
        onChange={setCondition}
        disabled={isSubmitting}
      />

      {/* 에러 메시지 */}
      {errorMessage && (
        <p className="form-error">{errorMessage}</p>
      )}

      {/* 버튼 */}
      <div className="form-actions">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="btn-cancel"
          >
            취소
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-submit"
        >
          {isSubmitting ? '저장 중...' : '시나리오 저장'}
        </button>
      </div>

    </form>
  );
};

export default ScenarioForm;
