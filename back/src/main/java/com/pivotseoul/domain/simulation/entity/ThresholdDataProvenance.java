package com.pivotseoul.domain.simulation.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "threshold_data_provenance")
public class ThresholdDataProvenance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "provenance_id")
    private Long provenanceId;

    @Column(name = "threshold_result_id", nullable = false)
    private Long thresholdResultId;

    @Column(name = "data_snapshot_id", nullable = false)
    private Long dataSnapshotId;

    @Column(name = "used_field", length = 256)
    private String usedField;

    @Column(name = "calculation_note", columnDefinition = "TEXT")
    private String calculationNote;

    protected ThresholdDataProvenance() {
    }

    public Long getProvenanceId() {
        return provenanceId;
    }

    public void setProvenanceId(Long provenanceId) {
        this.provenanceId = provenanceId;
    }

    public Long getThresholdResultId() {
        return thresholdResultId;
    }

    public void setThresholdResultId(Long thresholdResultId) {
        this.thresholdResultId = thresholdResultId;
    }

    public Long getDataSnapshotId() {
        return dataSnapshotId;
    }

    public void setDataSnapshotId(Long dataSnapshotId) {
        this.dataSnapshotId = dataSnapshotId;
    }

    public String getUsedField() {
        return usedField;
    }

    public void setUsedField(String usedField) {
        this.usedField = usedField;
    }

    public String getCalculationNote() {
        return calculationNote;
    }

    public void setCalculationNote(String calculationNote) {
        this.calculationNote = calculationNote;
    }
}
