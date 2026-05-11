// src/components/scenario/DistrictSelector.tsx

import React from 'react';

/**
 * [컴포넌트] 자치구 선택기
 *
 * 현재 거주 자치구 / 비교 자치구 선택 드롭다운을 제공한다.
 * district 목록은 props로 주입받아 사용한다.
 * TODO: 추후 /api/districts API 연동으로 목록 동적 로딩 전환
 * TODO: 자치구별 비교 기능 구현 시 다중 선택 지원 추가
 */

export interface District {
  districtId: number;
  districtName: string;
}

interface DistrictSelectorProps {
  /** 선택 가능한 자치구 목록 */
  districts: District[];
  /** 현재 거주 자치구 ID */
  currentDistrictId: number | null;
  /** 비교 대상 자치구 ID */
  compareDistrictId: number | null;
  onCurrentChange: (districtId: number) => void;
  onCompareChange: (districtId: number) => void;
  disabled?: boolean;
}

const DistrictSelector: React.FC<DistrictSelectorProps> = ({
  districts,
  currentDistrictId,
  compareDistrictId,
  onCurrentChange,
  onCompareChange,
  disabled = false,
}) => {
  return (
    <div className="district-selector">

      {/* 현재 거주 자치구 */}
      <div className="district-selector-item">
        <label className="district-label">현재 거주 자치구</label>
        <select
          value={currentDistrictId ?? ''}
          disabled={disabled}
          onChange={(e) => onCurrentChange(Number(e.target.value))}
          className="district-select"
        >
          <option value="" disabled>자치구를 선택하세요</option>
          {districts.map((d) => (
            <option key={d.districtId} value={d.districtId}>
              {d.districtName}
            </option>
          ))}
        </select>
      </div>

      {/* 비교 대상 자치구 */}
      <div className="district-selector-item">
        <label className="district-label">비교 자치구</label>
        <select
          value={compareDistrictId ?? ''}
          disabled={disabled}
          onChange={(e) => onCompareChange(Number(e.target.value))}
          className="district-select"
        >
          <option value="" disabled>자치구를 선택하세요</option>
          {districts
            // 현재 자치구와 동일한 항목은 비교 대상에서 제외
            .filter((d) => d.districtId !== currentDistrictId)
            .map((d) => (
              <option key={d.districtId} value={d.districtId}>
                {d.districtName}
              </option>
            ))}
        </select>
      </div>

    </div>
  );
};

export default DistrictSelector;
