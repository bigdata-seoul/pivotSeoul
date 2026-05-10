package com.pivotseoul.domain.simulation.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "simulation_run")
public class SimulationRun {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "simulation_run_id")
    private Long simulationRunId;

    @Column(name = "session_id", nullable = false)
    private Long sessionId;

    @Column(name = "run_status", nullable = false, length = 32)
    private String runStatus;

    @Column(name = "calculation_engine_version", length = 64)
    private String calculationEngineVersion;

    @Column(name = "ai_pipeline_version", length = 64)
    private String aiPipelineVersion;

    @Column(name = "model_version", length = 128)
    private String modelVersion;

    @Column(name = "total_confidence_score", precision = 14, scale = 6)
    private BigDecimal totalConfidenceScore;

    @Column(name = "started_at")
    private Instant startedAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    protected SimulationRun() {
    }

    public Long getSimulationRunId() {
        return simulationRunId;
    }

    public void setSimulationRunId(Long simulationRunId) {
        this.simulationRunId = simulationRunId;
    }

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public String getRunStatus() {
        return runStatus;
    }

    public void setRunStatus(String runStatus) {
        this.runStatus = runStatus;
    }

    public String getCalculationEngineVersion() {
        return calculationEngineVersion;
    }

    public void setCalculationEngineVersion(String calculationEngineVersion) {
        this.calculationEngineVersion = calculationEngineVersion;
    }

    public String getAiPipelineVersion() {
        return aiPipelineVersion;
    }

    public void setAiPipelineVersion(String aiPipelineVersion) {
        this.aiPipelineVersion = aiPipelineVersion;
    }

    public String getModelVersion() {
        return modelVersion;
    }

    public void setModelVersion(String modelVersion) {
        this.modelVersion = modelVersion;
    }

    public BigDecimal getTotalConfidenceScore() {
        return totalConfidenceScore;
    }

    public void setTotalConfidenceScore(BigDecimal totalConfidenceScore) {
        this.totalConfidenceScore = totalConfidenceScore;
    }

    public Instant getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(Instant startedAt) {
        this.startedAt = startedAt;
    }

    public Instant getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(Instant completedAt) {
        this.completedAt = completedAt;
    }
}
