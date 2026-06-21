package com.pivotseoul.domain.simulation.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "threshold_result")
public class ThresholdResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "threshold_result_id")
    private Long thresholdResultId;

    @Column(name = "scenario_result_id", nullable = false)
    private Long scenarioResultId;

    @Column(name = "threshold_type_id", nullable = false)
    private Long thresholdTypeId;

    @Column(name = "threshold_status", length = 32)
    private String thresholdStatus;

    @Column(name = "calculated_value", precision = 14, scale = 6)
    private BigDecimal calculatedValue;

    @Column(name = "threshold_value", precision = 14, scale = 6)
    private BigDecimal thresholdValue;

    @Column(name = "is_red_zone", nullable = false)
    private boolean redZone;

    @Column(name = "calculation_summary", columnDefinition = "TEXT")
    private String calculationSummary;

    public ThresholdResult() {
    }

    public Long getThresholdResultId() {
        return thresholdResultId;
    }

    public void setThresholdResultId(Long thresholdResultId) {
        this.thresholdResultId = thresholdResultId;
    }

    public Long getScenarioResultId() {
        return scenarioResultId;
    }

    public void setScenarioResultId(Long scenarioResultId) {
        this.scenarioResultId = scenarioResultId;
    }

    public Long getThresholdTypeId() {
        return thresholdTypeId;
    }

    public void setThresholdTypeId(Long thresholdTypeId) {
        this.thresholdTypeId = thresholdTypeId;
    }

    public String getThresholdStatus() {
        return thresholdStatus;
    }

    public void setThresholdStatus(String thresholdStatus) {
        this.thresholdStatus = thresholdStatus;
    }

    public BigDecimal getCalculatedValue() {
        return calculatedValue;
    }

    public void setCalculatedValue(BigDecimal calculatedValue) {
        this.calculatedValue = calculatedValue;
    }

    public BigDecimal getThresholdValue() {
        return thresholdValue;
    }

    public void setThresholdValue(BigDecimal thresholdValue) {
        this.thresholdValue = thresholdValue;
    }

    public boolean isRedZone() {
        return redZone;
    }

    public void setRedZone(boolean redZone) {
        this.redZone = redZone;
    }

    public String getCalculationSummary() {
        return calculationSummary;
    }

    public void setCalculationSummary(String calculationSummary) {
        this.calculationSummary = calculationSummary;
    }
}
