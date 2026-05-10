package com.pivotseoul.domain.simulation.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "recovery_lever")
public class RecoveryLever {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recovery_lever_id")
    private Long recoveryLeverId;

    @Column(name = "threshold_result_id", nullable = false)
    private Long thresholdResultId;

    @Column(name = "lever_type", length = 64)
    private String leverType;

    @Column(name = "lever_title", length = 512)
    private String leverTitle;

    @Column(name = "lever_description", columnDefinition = "TEXT")
    private String leverDescription;

    @Column(name = "expected_effect_score", precision = 14, scale = 6)
    private BigDecimal expectedEffectScore;

    @Column(name = "service_link_id")
    private Long serviceLinkId;

    protected RecoveryLever() {
    }

    public Long getRecoveryLeverId() {
        return recoveryLeverId;
    }

    public void setRecoveryLeverId(Long recoveryLeverId) {
        this.recoveryLeverId = recoveryLeverId;
    }

    public Long getThresholdResultId() {
        return thresholdResultId;
    }

    public void setThresholdResultId(Long thresholdResultId) {
        this.thresholdResultId = thresholdResultId;
    }

    public String getLeverType() {
        return leverType;
    }

    public void setLeverType(String leverType) {
        this.leverType = leverType;
    }

    public String getLeverTitle() {
        return leverTitle;
    }

    public void setLeverTitle(String leverTitle) {
        this.leverTitle = leverTitle;
    }

    public String getLeverDescription() {
        return leverDescription;
    }

    public void setLeverDescription(String leverDescription) {
        this.leverDescription = leverDescription;
    }

    public BigDecimal getExpectedEffectScore() {
        return expectedEffectScore;
    }

    public void setExpectedEffectScore(BigDecimal expectedEffectScore) {
        this.expectedEffectScore = expectedEffectScore;
    }

    public Long getServiceLinkId() {
        return serviceLinkId;
    }

    public void setServiceLinkId(Long serviceLinkId) {
        this.serviceLinkId = serviceLinkId;
    }
}
