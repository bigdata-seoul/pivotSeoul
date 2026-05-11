package com.pivotseoul.domain.simulation.dto;

import com.pivotseoul.domain.simulation.entity.Scenario;

/**
 * [DTO] 시나리오 생성 요청
 *
 * POST /api/simulations/{sessionId}/scenarios 요청 바디.
 * sessionId는 PathVariable로 받으므로 이 DTO에는 포함하지 않는다.
 */
public class CreateScenarioRequest {

    /**
     * 생애 단계 유형
     * 예: "YOUTH"(청년), "NEWLYWED"(신혼·출산), "SENIOR"(노년)
     * TODO: ScenarioType Enum 전환 시 String → Enum으로 교체
     */
    private String scenarioType;

    /** 현재 거주 자치구 ID */
    private Long currentDistrictId;

    /** 비교 대상 자치구 ID */
    private Long compareDistrictId;

    /**
     * 시나리오 제목 (선택값)
     * null이면 Service에서 자동 생성 처리
     * 예: "청년 - 마포구 vs 성동구"
     */
    private String scenarioTitle;

    /**
     * 표시 순서 (선택값)
     * null이면 Service에서 현재 시나리오 수 기반으로 자동 부여
     * TODO: 다중 시나리오 비교 구현 시 순서 재정렬 로직 추가
     */
    private Integer displayOrder;

    /**
     * 요청 DTO → Scenario 엔티티 변환 메서드
     * - sessionId는 PathVariable에서 주입받아 여기서 합산
     * - Service 레이어에서 호출
     *
     * @param sessionId URL PathVariable로 받은 세션 ID
     * @return 생성된 Scenario 엔티티
     */
    public Scenario toEntity(Long sessionId) {
        return Scenario.create(
                sessionId,
                this.scenarioType,
                this.currentDistrictId,
                this.compareDistrictId,
                this.scenarioTitle,
                this.displayOrder
        );
    }

    // ========================
    // Getter / Setter
    // Jackson 역직렬화를 위해 Setter 필요
    // ========================

    public String getScenarioType() { return scenarioType; }
    public void setScenarioType(String scenarioType) { this.scenarioType = scenarioType; }

    public Long getCurrentDistrictId() { return currentDistrictId; }
    public void setCurrentDistrictId(Long currentDistrictId) { this.currentDistrictId = currentDistrictId; }

    public Long getCompareDistrictId() { return compareDistrictId; }
    public void setCompareDistrictId(Long compareDistrictId) { this.compareDistrictId = compareDistrictId; }

    public String getScenarioTitle() { return scenarioTitle; }
    public void setScenarioTitle(String scenarioTitle) { this.scenarioTitle = scenarioTitle; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
}