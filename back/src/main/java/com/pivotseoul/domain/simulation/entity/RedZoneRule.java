package com.pivotseoul.domain.simulation.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "red_zone_rule")
public class RedZoneRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "red_zone_rule_id")
    private Long redZoneRuleId;

    @Column(name = "threshold_type_id", nullable = false)
    private Long thresholdTypeId;

    @Column(name = "rule_code", nullable = false, length = 64)
    private String ruleCode;

    @Column(name = "trigger_value", precision = 14, scale = 6)
    private BigDecimal triggerValue;

    @Column(name = "trigger_operator", length = 16)
    private String triggerOperator;

    @Column(name = "rule_description", columnDefinition = "TEXT")
    private String ruleDescription;

    protected RedZoneRule() {
    }

    public Long getRedZoneRuleId() {
        return redZoneRuleId;
    }

    public void setRedZoneRuleId(Long redZoneRuleId) {
        this.redZoneRuleId = redZoneRuleId;
    }

    public Long getThresholdTypeId() {
        return thresholdTypeId;
    }

    public void setThresholdTypeId(Long thresholdTypeId) {
        this.thresholdTypeId = thresholdTypeId;
    }

    public String getRuleCode() {
        return ruleCode;
    }

    public void setRuleCode(String ruleCode) {
        this.ruleCode = ruleCode;
    }

    public BigDecimal getTriggerValue() {
        return triggerValue;
    }

    public void setTriggerValue(BigDecimal triggerValue) {
        this.triggerValue = triggerValue;
    }

    public String getTriggerOperator() {
        return triggerOperator;
    }

    public void setTriggerOperator(String triggerOperator) {
        this.triggerOperator = triggerOperator;
    }

    public String getRuleDescription() {
        return ruleDescription;
    }

    public void setRuleDescription(String ruleDescription) {
        this.ruleDescription = ruleDescription;
    }
}
