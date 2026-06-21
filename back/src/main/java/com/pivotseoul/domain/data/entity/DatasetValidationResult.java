package com.pivotseoul.domain.data.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "dataset_validation_result")
public class DatasetValidationResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "validation_result_id")
    private Long validationResultId;

    @Column(name = "data_snapshot_id", nullable = false)
    private Long dataSnapshotId;

    @Column(name = "validation_status", length = 32)
    private String validationStatus;

    @Column(name = "missing_count")
    private Integer missingCount;

    @Column(name = "invalid_count")
    private Integer invalidCount;

    @Column(name = "duplicate_count")
    private Integer duplicateCount;

    @Column(name = "validation_message", columnDefinition = "TEXT")
    private String validationMessage;

    protected DatasetValidationResult() {
    }

    public Long getValidationResultId() {
        return validationResultId;
    }

    public void setValidationResultId(Long validationResultId) {
        this.validationResultId = validationResultId;
    }

    public Long getDataSnapshotId() {
        return dataSnapshotId;
    }

    public void setDataSnapshotId(Long dataSnapshotId) {
        this.dataSnapshotId = dataSnapshotId;
    }

    public String getValidationStatus() {
        return validationStatus;
    }

    public void setValidationStatus(String validationStatus) {
        this.validationStatus = validationStatus;
    }

    public Integer getMissingCount() {
        return missingCount;
    }

    public void setMissingCount(Integer missingCount) {
        this.missingCount = missingCount;
    }

    public Integer getInvalidCount() {
        return invalidCount;
    }

    public void setInvalidCount(Integer invalidCount) {
        this.invalidCount = invalidCount;
    }

    public Integer getDuplicateCount() {
        return duplicateCount;
    }

    public void setDuplicateCount(Integer duplicateCount) {
        this.duplicateCount = duplicateCount;
    }

    public String getValidationMessage() {
        return validationMessage;
    }

    public void setValidationMessage(String validationMessage) {
        this.validationMessage = validationMessage;
    }
}
