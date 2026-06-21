package com.pivotseoul.domain.data.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDate;

/**
 * ERD {@code DATA_SOURCE} — 클래스명은 기존 코드 호환을 위해 유지.
 */
@Entity
@Table(name = "data_source")
public class DataSourceMeta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "data_source_id")
    private Long dataSourceId;

    @Column(name = "dataset_id", nullable = false)
    private Long datasetId;

    @Column(name = "source_name", length = 512)
    private String sourceName;

    @Column(name = "source_file_name", length = 512)
    private String sourceFileName;

    @Column(name = "source_type", length = 64)
    private String sourceType;

    @Column(name = "storage_path", length = 2048)
    private String storagePath;

    @Column(name = "base_date")
    private LocalDate baseDate;

    @Column(name = "schema_hash", length = 128)
    private String schemaHash;

    protected DataSourceMeta() {
    }

    public Long getDataSourceId() {
        return dataSourceId;
    }

    public void setDataSourceId(Long dataSourceId) {
        this.dataSourceId = dataSourceId;
    }

    public Long getDatasetId() {
        return datasetId;
    }

    public void setDatasetId(Long datasetId) {
        this.datasetId = datasetId;
    }

    public String getSourceName() {
        return sourceName;
    }

    public void setSourceName(String sourceName) {
        this.sourceName = sourceName;
    }

    public String getSourceFileName() {
        return sourceFileName;
    }

    public void setSourceFileName(String sourceFileName) {
        this.sourceFileName = sourceFileName;
    }

    public String getSourceType() {
        return sourceType;
    }

    public void setSourceType(String sourceType) {
        this.sourceType = sourceType;
    }

    public String getStoragePath() {
        return storagePath;
    }

    public void setStoragePath(String storagePath) {
        this.storagePath = storagePath;
    }

    public LocalDate getBaseDate() {
        return baseDate;
    }

    public void setBaseDate(LocalDate baseDate) {
        this.baseDate = baseDate;
    }

    public String getSchemaHash() {
        return schemaHash;
    }

    public void setSchemaHash(String schemaHash) {
        this.schemaHash = schemaHash;
    }
}
