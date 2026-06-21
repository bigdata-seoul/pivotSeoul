package com.pivotseoul.domain.data.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "dataset_registry")
public class DatasetRegistry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dataset_id")
    private Long datasetId;

    @Column(name = "dataset_code", nullable = false, unique = true, length = 64)
    private String datasetCode;

    @Column(name = "dataset_name", nullable = false, length = 512)
    private String datasetName;

    /** PRD 'domain' — DB column scope_domain (PostgreSQL domain 예약어 회피) */
    @Column(name = "scope_domain", length = 64)
    private String scopeDomain;

    @Column(name = "provider", length = 256)
    private String provider;

    @Column(name = "source_url", length = 2048)
    private String sourceUrl;

    @Column(name = "update_cycle", length = 64)
    private String updateCycle;

    @Column(name = "is_public_data", nullable = false)
    private boolean publicData = true;

    protected DatasetRegistry() {
    }

    public Long getDatasetId() {
        return datasetId;
    }

    public void setDatasetId(Long datasetId) {
        this.datasetId = datasetId;
    }

    public String getDatasetCode() {
        return datasetCode;
    }

    public void setDatasetCode(String datasetCode) {
        this.datasetCode = datasetCode;
    }

    public String getDatasetName() {
        return datasetName;
    }

    public void setDatasetName(String datasetName) {
        this.datasetName = datasetName;
    }

    public String getScopeDomain() {
        return scopeDomain;
    }

    public void setScopeDomain(String scopeDomain) {
        this.scopeDomain = scopeDomain;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getSourceUrl() {
        return sourceUrl;
    }

    public void setSourceUrl(String sourceUrl) {
        this.sourceUrl = sourceUrl;
    }

    public String getUpdateCycle() {
        return updateCycle;
    }

    public void setUpdateCycle(String updateCycle) {
        this.updateCycle = updateCycle;
    }

    public boolean isPublicData() {
        return publicData;
    }

    public void setPublicData(boolean publicData) {
        this.publicData = publicData;
    }
}
