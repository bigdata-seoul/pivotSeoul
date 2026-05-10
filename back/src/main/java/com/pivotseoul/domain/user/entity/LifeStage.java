package com.pivotseoul.domain.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "life_stage")
public class LifeStage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "life_stage_id")
    private Long lifeStageId;

    @Column(name = "stage_code", nullable = false, unique = true, length = 32)
    private String stageCode;

    @Column(name = "stage_name", nullable = false, length = 128)
    private String stageName;

    @Column(name = "description", columnDefinition = "text")
    private String description;

    protected LifeStage() {
    }

    public Long getLifeStageId() {
        return lifeStageId;
    }

    public void setLifeStageId(Long lifeStageId) {
        this.lifeStageId = lifeStageId;
    }

    public String getStageCode() {
        return stageCode;
    }

    public void setStageCode(String stageCode) {
        this.stageCode = stageCode;
    }

    public String getStageName() {
        return stageName;
    }

    public void setStageName(String stageName) {
        this.stageName = stageName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
