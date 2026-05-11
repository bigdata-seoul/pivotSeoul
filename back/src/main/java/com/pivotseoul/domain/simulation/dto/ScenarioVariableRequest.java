package com.pivotseoul.domain.simulation.dto;

import com.pivotseoul.domain.simulation.entity.ScenarioVariable;

import java.util.List;

/**
 * [DTO] 시나리오 변수 저장 요청
 *
 * 시나리오 변수 저장 API 요청 바디.
 * 변수 여러 개를 한 번에 저장할 수 있도록 List 래퍼 구조를 함께 제공한다.
 *
 * 단건 사용 예:
 *   { "varKey": "INCOME", "varValue": "3000000" }
 *
 * 복수 저장 시에는 ScenarioVariableRequest.Bulk 사용:
 *   { "variables": [ { "varKey": "INCOME", "varValue": "3000000" }, ... ] }
 */
public class ScenarioVariableRequest {

    /**
     * 변수 키
     * 예: "INCOME"(소득), "DEPOSIT"(보증금),
     *     "MONTHLY_RENT"(월세), "COMMUTE_TIME"(통근시간)
     * TODO: VarKey Enum 전환 시 허용 키 목록 명시적으로 관리
     */
    private String varKey;

    /** 변수 값 (문자열로 통일 저장) */
    private String varValue;

    /**
     * 요청 DTO → ScenarioVariable 엔티티 변환
     * - scenarioId는 PathVariable에서 주입
     *
     * @param scenarioId URL PathVariable로 받은 시나리오 ID
     * @return 생성된 ScenarioVariable 엔티티
     */
    public ScenarioVariable toEntity(Long scenarioId) {
        return ScenarioVariable.create(scenarioId, this.varKey, this.varValue);
    }

    // ========================
    // Getter / Setter
    // ========================

    public String getVarKey() { return varKey; }
    public void setVarKey(String varKey) { this.varKey = varKey; }

    public String getVarValue() { return varValue; }
    public void setVarValue(String varValue) { this.varValue = varValue; }

    // ========================
    // 복수 변수 저장용 래퍼 클래스
    // POST /api/scenarios/{scenarioId}/variables/bulk 에서 사용
    // TODO: 복수 변수 일괄 저장 API 구현 시 Controller에 엔드포인트 추가
    // ========================

    /**
     * [내부 클래스] 여러 변수를 한 번에 저장하기 위한 요청 래퍼
     */
    public static class Bulk {

        /** 저장할 변수 목록 */
        private List<ScenarioVariableRequest> variables;

        public List<ScenarioVariableRequest> getVariables() { return variables; }
        public void setVariables(List<ScenarioVariableRequest> variables) { this.variables = variables; }
    }
}