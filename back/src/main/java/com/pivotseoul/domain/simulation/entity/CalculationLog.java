package com.pivotseoul.domain.simulation.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "calculation_log")
public class CalculationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "audit_id")
    private Long auditId;

    @Column(name = "simulation_run_id", nullable = false)
    private Long simulationRunId;

    @Column(name = "calculation_type", length = 64)
    private String calculationType;

    @Column(name = "formula_version", columnDefinition = "TEXT")
    private String formulaVersion;

    @Column(name = "input_hash", columnDefinition = "TEXT")
    private String inputHash;

    @Column(name = "output_hash", columnDefinition = "TEXT")
    private String outputHash;

    @Column(name = "passed_validation")
    private Boolean passedValidation;

    @Column(name = "error_type", length = 64)
    private String errorType;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    protected CalculationLog() {
    }

    public Long getAuditId() {
        return auditId;
    }

    public void setAuditId(Long auditId) {
        this.auditId = auditId;
    }

    public Long getSimulationRunId() {
        return simulationRunId;
    }

    public void setSimulationRunId(Long simulationRunId) {
        this.simulationRunId = simulationRunId;
    }

    public String getCalculationType() {
        return calculationType;
    }

    public void setCalculationType(String calculationType) {
        this.calculationType = calculationType;
    }

    public String getFormulaVersion() {
        return formulaVersion;
    }

    public void setFormulaVersion(String formulaVersion) {
        this.formulaVersion = formulaVersion;
    }

    public String getInputHash() {
        return inputHash;
    }

    public void setInputHash(String inputHash) {
        this.inputHash = inputHash;
    }

    public String getOutputHash() {
        return outputHash;
    }

    public void setOutputHash(String outputHash) {
        this.outputHash = outputHash;
    }

    public Boolean getPassedValidation() {
        return passedValidation;
    }

    public void setPassedValidation(Boolean passedValidation) {
        this.passedValidation = passedValidation;
    }

    public String getErrorType() {
        return errorType;
    }

    public void setErrorType(String errorType) {
        this.errorType = errorType;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }
}
