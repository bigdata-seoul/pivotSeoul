package com.pivotseoul.domain.simulation.dto;

import com.pivotseoul.domain.simulation.entity.ScenarioVariable;

/**
 * [DTO] 시나리오 변수 응답
 *
 * ScenarioVariable 엔티티를 API 응답용으로 변환한 DTO.
 * 엔티티를 직접 노출하지 않고 필요한 필드만 반환한다.
 */
public class ScenarioVariableResponse {

    private Long variableId;
    private Long scenarioId;

    /** 변수 종류 키 (예: "INCOME", "DEPOSIT") */
    private String varKey;

    /** 변수 값 (문자열) */
    private String varValue;

    private ScenarioVariableResponse() {}

    /**
     * 엔티티 → DTO 변환 팩토리 메서드
     * Service 레이어에서 호출
     */
    public static ScenarioVariableResponse from(ScenarioVariable entity) {
        ScenarioVariableResponse dto = new ScenarioVariableResponse();
        dto.variableId = entity.getVariableId();
        dto.scenarioId = entity.getScenarioId();
        dto.varKey = entity.getVarKey();
        dto.varValue = entity.getVarValue();
        return dto;
    }

    // ========================
    // Getter
    // ========================

    public Long getVariableId() { return variableId; }
    public Long getScenarioId() { return scenarioId; }
    public String getVarKey() { return varKey; }
    public String getVarValue() { return varValue; }
}