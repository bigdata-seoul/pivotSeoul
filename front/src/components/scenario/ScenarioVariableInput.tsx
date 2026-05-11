// src/components/scenario/ScenarioVariableInput.tsx

import React from 'react';
import { VAR_KEY, type VarKey } from '../../types/scenario';

/**
 * [컴포넌트] 시나리오 변수 입력 필드 단건
 *
 * varKey에 따라 라벨, 단위, placeholder를 자동으로 표시한다.
 * 부모(ScenarioForm)에서 varKey + value + onChange를 주입받아 사용한다.
 */

// ========================
// 변수 키별 UI 메타 정보
// TODO: 사용자 직접 변수 추가 기능 구현 시 동적 메타 처리 방식 검토
// ========================
const VAR_META: Record<VarKey, { label: string; unit: string; placeholder: string }> = {
  [VAR_KEY.INCOME]:       { label: '월 소득',   unit: '만원', placeholder: '예: 300' },
  [VAR_KEY.DEPOSIT]:      { label: '보증금',    unit: '만원', placeholder: '예: 5000' },
  [VAR_KEY.MONTHLY_RENT]: { label: '월세',      unit: '만원', placeholder: '예: 60' },
  [VAR_KEY.COMMUTE_TIME]: { label: '통근시간',  unit: '분',   placeholder: '예: 45' },
};

interface ScenarioVariableInputProps {
  varKey: VarKey;
  value: string;
  onChange: (varKey: VarKey, value: string) => void;
  disabled?: boolean;
}

const ScenarioVariableInput: React.FC<ScenarioVariableInputProps> = ({
  varKey,
  value,
  onChange,
  disabled = false,
}) => {
  const meta = VAR_META[varKey];

  return (
    <div className="scenario-variable-input">
      <label className="variable-label">
        {meta.label}
      </label>
      <div className="variable-input-wrapper">
        <input
          type="number"
          value={value}
          placeholder={meta.placeholder}
          disabled={disabled}
          min={0}
          onChange={(e) => onChange(varKey, e.target.value)}
          className="variable-input"
        />
        <span className="variable-unit">{meta.unit}</span>
      </div>
    </div>
  );
};

export default ScenarioVariableInput;
