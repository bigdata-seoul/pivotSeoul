package com.pivotseoul.domain.data.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "data_snapshot")
public class DataSnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "data_snapshot_id")
    private Long dataSnapshotId;

    @Column(name = "data_source_id", nullable = false)
    private Long dataSourceId;

    @Column(name = "snapshot_version", length = 64)
    private String snapshotVersion;

    @Column(name = "collected_at")
    private Instant collectedAt;

    @Column(name = "row_count")
    private Integer rowCount;

    @Column(name = "missing_value_rate", precision = 14, scale = 6)
    private BigDecimal missingValueRate;

    @Column(name = "coverage_rate", precision = 14, scale = 6)
    private BigDecimal coverageRate;

    @Column(name = "freshness_score", precision = 14, scale = 6)
    private BigDecimal freshnessScore;

    @Column(name = "data_quality_score", precision = 14, scale = 6)
    private BigDecimal dataQualityScore;

    @Column(name = "schema_hash", length = 128)
    private String schemaHash;

    protected DataSnapshot() {
    }

    public Long getDataSnapshotId() {
        return dataSnapshotId;
    }

    public void setDataSnapshotId(Long dataSnapshotId) {
        this.dataSnapshotId = dataSnapshotId;
    }

    public Long getDataSourceId() {
        return dataSourceId;
    }

    public void setDataSourceId(Long dataSourceId) {
        this.dataSourceId = dataSourceId;
    }

    public String getSnapshotVersion() {
        return snapshotVersion;
    }

    public void setSnapshotVersion(String snapshotVersion) {
        this.snapshotVersion = snapshotVersion;
    }

    public Instant getCollectedAt() {
        return collectedAt;
    }

    public void setCollectedAt(Instant collectedAt) {
        this.collectedAt = collectedAt;
    }

    public Integer getRowCount() {
        return rowCount;
    }

    public void setRowCount(Integer rowCount) {
        this.rowCount = rowCount;
    }

    public BigDecimal getMissingValueRate() {
        return missingValueRate;
    }

    public void setMissingValueRate(BigDecimal missingValueRate) {
        this.missingValueRate = missingValueRate;
    }

    public BigDecimal getCoverageRate() {
        return coverageRate;
    }

    public void setCoverageRate(BigDecimal coverageRate) {
        this.coverageRate = coverageRate;
    }

    public BigDecimal getFreshnessScore() {
        return freshnessScore;
    }

    public void setFreshnessScore(BigDecimal freshnessScore) {
        this.freshnessScore = freshnessScore;
    }

    public BigDecimal getDataQualityScore() {
        return dataQualityScore;
    }

    public void setDataQualityScore(BigDecimal dataQualityScore) {
        this.dataQualityScore = dataQualityScore;
    }

    public String getSchemaHash() {
        return schemaHash;
    }

    public void setSchemaHash(String schemaHash) {
        this.schemaHash = schemaHash;
    }
}
