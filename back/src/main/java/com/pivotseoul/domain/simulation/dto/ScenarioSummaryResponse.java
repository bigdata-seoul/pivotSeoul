package com.pivotseoul.domain.simulation.dto;

import com.pivotseoul.domain.simulation.entity.Scenario;
import com.pivotseoul.domain.simulation.entity.ScenarioVariable;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * [DTO] 시나리오 요약 응답
 *
 * GET /api/simulations/{sessionId}/scenarios 및
 * GET /api/scenarios/{scenarioId} 에서 사용하는 응답 DTO.
 *
 * 시나리오 기본 정보 + 변수 목록을 한 번에 반환한다.
 * 변수는 key-value Map으로 변환해 프론트에서 바로 사용하기 편하게 제공한다.
 * 예: { "INCOME": "3000000", "DEPOSIT": "50000000", "COMMUTE_TIME": "45" }
 */
public class ScenarioSummaryResponse {

    private Long scenarioId;
    private Long sessionId;
    private String scenarioType;
    private Long currentDistrictId;
    private Long compareDistrictId;
    private String scenarioTitle;
    private Integer displayOrder;

    /**
     * 변수 목록을 key-value Map으로 변환한 결과
     * - 프론트에서 variables["INCOME"] 형태로 바로 접근 가능
     * TODO: 자치구 이름, 생애 단계 레이블 등 부가 정보 필요 시
     *       currentDistrictName, compareDistrictName 필드 추가
     */
    private Map<String, String> variables;

    private ScenarioSummaryResponse() {}

    /**
     * 엔티티 + 변수 목록 → 요약 응답 DTO 변환 팩토리 메서드
     *
     * @param scenario  Scenario 엔티티
     * @param variables 해당 시나리오의 ScenarioVariable 목록
     * @return 요약 응답 DTO
     */
    public static ScenarioSummaryResponse from(Scenario scenario, List<ScenarioVariable> variables) {
        ScenarioSummaryResponse response = new ScenarioSummaryResponse();
        response.scenarioId = scenario.getScenarioId();
        response.sessionId = scenario.getSessionId();
        response.scenarioType = scenario.getScenarioType();
        response.currentDistrictId = scenario.getCurrentDistrictId();
        response.compareDistrictId = scenario.getCompareDistrictId();
        response.scenarioTitle = scenario.getScenarioTitle();
        response.displayOrder = scenario.getDisplayOrder();

        // ScenarioVariable 리스트 → { varKey: varValue } Map으로 변환
        response.variables = variables.stream()
                .collect(Collectors.toMap(
                        ScenarioVariable::getVarKey,
                        ScenarioVariable::getVarValue
                ));

        return response;
    }

    // ========================
    // Getter
    // ========================

    public Long getScenarioId() { return scenarioId; }
    public Long getSessionId() { return sessionId; }
    public String getScenarioType() { return scenarioType; }
    public Long getCurrentDistrictId() { return currentDistrictId; }
    public Long getCompareDistrictId() { return compareDistrictId; }
    public String getScenarioTitle() { return scenarioTitle; }
    public Integer getDisplayOrder() { return displayOrder; }
    public Map<String, String> getVariables() { return variables; }
}