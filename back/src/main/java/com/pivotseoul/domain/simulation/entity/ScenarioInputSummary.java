package com.pivotseoul.domain.simulation.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "scenario_input_summary")
public class ScenarioInputSummary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "input_summary_id")
    private Long inputSummaryId;

    @Column(name = "scenario_id", nullable = false, unique = true)
    private Long scenarioId;

    @Column(name = "age_group", length = 64)
    private String ageGroup;

    @Column(name = "income_band", length = 64)
    private String incomeBand;

    @Column(name = "household_type", length = 64)
    private String householdType;

    @Column(name = "child_age_group", length = 64)
    private String childAgeGroup;

    @Column(name = "target_job_group", length = 128)
    private String targetJobGroup;

    @Column(name = "monthly_budget_band", length = 64)
    private String monthlyBudgetBand;

    @Column(name = "skill_level", length = 64)
    private String skillLevel;

    @Column(name = "weekly_learning_hours")
    private Integer weeklyLearningHours;

    @Column(name = "commute_time_band", length = 64)
    private String commuteTimeBand;

    @Column(name = "health_status_group", length = 64)
    private String healthStatusGroup;

    @Column(name = "is_anonymized", nullable = false)
    private boolean anonymized;

    protected ScenarioInputSummary() {
    }

    public Long getInputSummaryId() {
        return inputSummaryId;
    }

    public void setInputSummaryId(Long inputSummaryId) {
        this.inputSummaryId = inputSummaryId;
    }

    public Long getScenarioId() {
        return scenarioId;
    }

    public void setScenarioId(Long scenarioId) {
        this.scenarioId = scenarioId;
    }

    public String getAgeGroup() {
        return ageGroup;
    }

    public void setAgeGroup(String ageGroup) {
        this.ageGroup = ageGroup;
    }

    public String getIncomeBand() {
        return incomeBand;
    }

    public void setIncomeBand(String incomeBand) {
        this.incomeBand = incomeBand;
    }

    public String getHouseholdType() {
        return householdType;
    }

    public void setHouseholdType(String householdType) {
        this.householdType = householdType;
    }

    public String getChildAgeGroup() {
        return childAgeGroup;
    }

    public void setChildAgeGroup(String childAgeGroup) {
        this.childAgeGroup = childAgeGroup;
    }

    public String getTargetJobGroup() {
        return targetJobGroup;
    }

    public void setTargetJobGroup(String targetJobGroup) {
        this.targetJobGroup = targetJobGroup;
    }

    public String getMonthlyBudgetBand() {
        return monthlyBudgetBand;
    }

    public void setMonthlyBudgetBand(String monthlyBudgetBand) {
        this.monthlyBudgetBand = monthlyBudgetBand;
    }

    public boolean isAnonymized() {
        return anonymized;
    }

    public void setAnonymized(boolean anonymized) {
        this.anonymized = anonymized;
    }

    public String getSkillLevel() {
        return skillLevel;
    }

    public void setSkillLevel(String skillLevel) {
        this.skillLevel = skillLevel;
    }

    public Integer getWeeklyLearningHours() {
        return weeklyLearningHours;
    }

    public void setWeeklyLearningHours(Integer weeklyLearningHours) {
        this.weeklyLearningHours = weeklyLearningHours;
    }

    public String getCommuteTimeBand() {
        return commuteTimeBand;
    }

    public void setCommuteTimeBand(String commuteTimeBand) {
        this.commuteTimeBand = commuteTimeBand;
    }

    public String getHealthStatusGroup() {
        return healthStatusGroup;
    }

    public void setHealthStatusGroup(String healthStatusGroup) {
        this.healthStatusGroup = healthStatusGroup;
    }
}
