package com.pivotseoul.domain.simulation.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "scenario")
public class Scenario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "scenario_id")
    private Long scenarioId;

    @Column(name = "session_id", nullable = false)
    private Long sessionId;

    @Column(name = "scenario_type", nullable = false, length = 16)
    private String scenarioType;

    @Column(name = "current_district_id")
    private Long currentDistrictId;

    @Column(name = "compare_district_id")
    private Long compareDistrictId;

    @Column(name = "scenario_title", length = 256)
    private String scenarioTitle;

    @Column(name = "display_order")
    private Integer displayOrder;

    protected Scenario() {
    }

    public Long getScenarioId() {
        return scenarioId;
    }

    public void setScenarioId(Long scenarioId) {
        this.scenarioId = scenarioId;
    }

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public String getScenarioType() {
        return scenarioType;
    }

    public void setScenarioType(String scenarioType) {
        this.scenarioType = scenarioType;
    }

    public Long getCurrentDistrictId() {
        return currentDistrictId;
    }

    public void setCurrentDistrictId(Long currentDistrictId) {
        this.currentDistrictId = currentDistrictId;
    }

    public Long getCompareDistrictId() {
        return compareDistrictId;
    }

    public void setCompareDistrictId(Long compareDistrictId) {
        this.compareDistrictId = compareDistrictId;
    }

    public String getScenarioTitle() {
        return scenarioTitle;
    }

    public void setScenarioTitle(String scenarioTitle) {
        this.scenarioTitle = scenarioTitle;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
}
