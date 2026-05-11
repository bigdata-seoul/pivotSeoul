package com.pivotseoul.domain.simulation.dto;

import com.pivotseoul.domain.simulation.entity.Scenario;

/**
 * [DTO] 시나리오 생성 응답
 *
 * POST /api/simulations/{sessionId}/scenarios 성공 응답 바디.
 * 생성된 시나리오의 기본 정보를 반환한다.
 * 변수(ScenarioVariable)는 별도 요청으로 저장하므로 여기엔 포함하지 않는다.
 */
public class CreateScenarioResponse {

    private Long scenarioId;
    private Long sessionId;
    private String scenarioType;
    private Long currentDistrictId;
    private Long compareDistrictId;
    private String scenarioTitle;
    private Integer displayOrder;

    private CreateScenarioResponse() {}

    /**
     * 엔티티 → 응답 DTO 변환 팩토리 메서드
     * Service 레이어에서 저장 후 바로 호출
     *
     * @param scenario 저장 완료된 Scenario 엔티티
     * @return 응답 DTO
     */
    public static CreateScenarioResponse from(Scenario scenario) {
        CreateScenarioResponse response = new CreateScenarioResponse();
        response.scenarioId = scenario.getScenarioId();
        response.sessionId = scenario.getSessionId();
        response.scenarioType = scenario.getScenarioType();
        response.currentDistrictId = scenario.getCurrentDistrictId();
        response.compareDistrictId = scenario.getCompareDistrictId();
        response.scenarioTitle = scenario.getScenarioTitle();
        response.displayOrder = scenario.getDisplayOrder();
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
}