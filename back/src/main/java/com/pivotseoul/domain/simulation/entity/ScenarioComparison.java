package com.pivotseoul.domain.simulation.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "scenario_comparison")
public class ScenarioComparison {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comparison_id")
    private Long comparisonId;

    @Column(name = "simulation_run_id", nullable = false)
    private Long simulationRunId;

    @Column(name = "base_scenario_result_id", nullable = false)
    private Long baseScenarioResultId;

    @Column(name = "compare_scenario_result_id", nullable = false)
    private Long compareScenarioResultId;

    @Column(name = "score_diff", precision = 14, scale = 6)
    private BigDecimal scoreDiff;

    @Column(name = "risk_diff", precision = 14, scale = 6)
    private BigDecimal riskDiff;

    @Column(name = "recommended_scenario_type", length = 16)
    private String recommendedScenarioType;

    @Column(name = "comparison_summary", columnDefinition = "text")
    private String comparisonSummary;

    protected ScenarioComparison() {
    }

    public Long getComparisonId() {
        return comparisonId;
    }

    public void setComparisonId(Long comparisonId) {
        this.comparisonId = comparisonId;
    }

    public Long getSimulationRunId() {
        return simulationRunId;
    }

    public void setSimulationRunId(Long simulationRunId) {
        this.simulationRunId = simulationRunId;
    }

    public Long getBaseScenarioResultId() {
        return baseScenarioResultId;
    }

    public void setBaseScenarioResultId(Long baseScenarioResultId) {
        this.baseScenarioResultId = baseScenarioResultId;
    }

    public Long getCompareScenarioResultId() {
        return compareScenarioResultId;
    }

    public void setCompareScenarioResultId(Long compareScenarioResultId) {
        this.compareScenarioResultId = compareScenarioResultId;
    }

    public BigDecimal getScoreDiff() {
        return scoreDiff;
    }

    public void setScoreDiff(BigDecimal scoreDiff) {
        this.scoreDiff = scoreDiff;
    }

    public BigDecimal getRiskDiff() {
        return riskDiff;
    }

    public void setRiskDiff(BigDecimal riskDiff) {
        this.riskDiff = riskDiff;
    }

    public String getRecommendedScenarioType() {
        return recommendedScenarioType;
    }

    public void setRecommendedScenarioType(String recommendedScenarioType) {
        this.recommendedScenarioType = recommendedScenarioType;
    }

    public String getComparisonSummary() {
        return comparisonSummary;
    }

    public void setComparisonSummary(String comparisonSummary) {
        this.comparisonSummary = comparisonSummary;
    }
}
