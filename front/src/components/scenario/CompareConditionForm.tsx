// src/components/scenario/CompareConditionForm.tsx

import React from 'react';
import DistrictSelector, { type District } from './DistrictSelector';
import ScenarioVariableInput from './ScenarioVariableInput';
import { VAR_KEY, SCENARIO_TYPE, type ScenarioType, type VarKey } from '../../types/scenario';

/**
 * [컴포넌트] 비교 조건 입력 폼
 *
 * 시나리오 비교에 필요한 조건 전체를 한 화면에서 입력받는다.
 * - 생애 단계(scenarioType) 선택
 * - 현재/비교 자치구 선택 (DistrictSelector)
 * - 조건 변수 입력 (ScenarioVariableInput × 4)
 *
 * ScenarioForm 내부에서 사용되거나 단독으로 사용 가능하다.
 * TODO: 다중 시나리오 비교 구현 시 조건 세트를 N개 동적으로 추가하는 구조로 확장
 */

// 생애 단계 선택지 라벨
const SCENARIO_TYPE_LABELS: Record<ScenarioType, string> = {
  [SCENARIO_TYPE.YOUTH]:    '청년',
  [SCENARIO_TYPE.NEWLYWED]: '신혼·출산',
  [SCENARIO_TYPE.SENIOR]:   '노년',
};

/** 현재 입력 중인 조건 상태 타입 */
export interface CompareCondition {
  scenarioType: ScenarioType | null;
  currentDistrictId: number | null;
  compareDistrictId: number | null;
  variables: Partial<Record<VarKey, string>>;
}

interface CompareConditionFormProps {
  condition: CompareCondition;
  districts: District[];
  onChange: (updated: CompareCondition) => void;
  disabled?: boolean;
}

const CompareConditionForm: React.FC<CompareConditionFormProps> = ({
  condition,
  districts,
  onChange,
  disabled = false,
}) => {

  /** 생애 단계 변경 핸들러 */
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...condition, scenarioType: e.target.value as ScenarioType });
  };

  /** 자치구 변경 핸들러 */
  const handleCurrentDistrictChange = (districtId: number) => {
    onChange({ ...condition, currentDistrictId: districtId });
  };
  const handleCompareDistrictChange = (districtId: number) => {
    onChange({ ...condition, compareDistrictId: districtId });
  };

  /** 변수 값 변경 핸들러 */
  const handleVariableChange = (varKey: VarKey, value: string) => {
    onChange({
      ...condition,
      variables: { ...condition.variables, [varKey]: value },
    });
  };

  return (
    <div className="compare-condition-form">

      {/* 생애 단계 선택 */}
      <div className="condition-section">
        <label className="condition-label">생애 단계</label>
        <select
          value={condition.scenarioType ?? ''}
          disabled={disabled}
          onChange={handleTypeChange}
          className="condition-select"
        >
          <option value="" disabled>생애 단계를 선택하세요</option>
          {(Object.keys(SCENARIO_TYPE_LABELS) as ScenarioType[]).map((type) => (
            <option key={type} value={type}>
              {SCENARIO_TYPE_LABELS[type]}
            </option>
          ))}
        </select>
      </div>

      {/* 자치구 선택 */}
      <div className="condition-section">
        <DistrictSelector
          districts={districts}
          currentDistrictId={condition.currentDistrictId}
          compareDistrictId={condition.compareDistrictId}
          onCurrentChange={handleCurrentDistrictChange}
          onCompareChange={handleCompareDistrictChange}
          disabled={disabled}
        />
      </div>

      {/* 조건 변수 입력 */}
      <div className="condition-section">
        <p className="condition-label">조건 변수</p>
        <div className="variable-input-list">
          {(Object.values(VAR_KEY) as VarKey[]).map((key) => (
            <ScenarioVariableInput
              key={key}
              varKey={key}
              value={condition.variables[key] ?? ''}
              onChange={handleVariableChange}
              disabled={disabled}
            />
          ))}
        </div>
      </div>

    </div>
  );
};

export default CompareConditionForm;
