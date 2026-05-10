package com.pivotseoul.domain.simulation.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "threshold_type")
public class ThresholdType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "threshold_type_id")
    private Long thresholdTypeId;

    @Column(name = "threshold_code", nullable = false, unique = true, length = 64)
    private String thresholdCode;

    @Column(name = "threshold_name", nullable = false, length = 256)
    private String thresholdName;

    @Column(name = "formula_version", columnDefinition = "TEXT")
    private String formulaVersion;

    @Column(name = "unit_default", length = 64)
    private String unitDefault;

    protected ThresholdType() {
    }

    public Long getThresholdTypeId() {
        return thresholdTypeId;
    }

    public void setThresholdTypeId(Long thresholdTypeId) {
        this.thresholdTypeId = thresholdTypeId;
    }

    public String getThresholdCode() {
        return thresholdCode;
    }

    public void setThresholdCode(String thresholdCode) {
        this.thresholdCode = thresholdCode;
    }

    public String getThresholdName() {
        return thresholdName;
    }

    public void setThresholdName(String thresholdName) {
        this.thresholdName = thresholdName;
    }

    public String getFormulaVersion() {
        return formulaVersion;
    }

    public void setFormulaVersion(String formulaVersion) {
        this.formulaVersion = formulaVersion;
    }

    public String getUnitDefault() {
        return unitDefault;
    }

    public void setUnitDefault(String unitDefault) {
        this.unitDefault = unitDefault;
    }
}
