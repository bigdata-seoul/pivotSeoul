package com.pivotseoul.domain.simulation.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "weekly_action")
public class WeeklyAction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "weekly_action_id")
    private Long weeklyActionId;

    @Column(name = "scenario_result_id", nullable = false)
    private Long scenarioResultId;

    @Column(name = "action_type", length = 64)
    private String actionType;

    @Column(name = "action_title", length = 512)
    private String actionTitle;

    @Column(name = "action_description", columnDefinition = "TEXT")
    private String actionDescription;

    @Column(name = "priority_order")
    private Integer priorityOrder;

    @Column(name = "service_link_id")
    private Long serviceLinkId;

    protected WeeklyAction() {
    }

    public Long getWeeklyActionId() {
        return weeklyActionId;
    }

    public void setWeeklyActionId(Long weeklyActionId) {
        this.weeklyActionId = weeklyActionId;
    }

    public Long getScenarioResultId() {
        return scenarioResultId;
    }

    public void setScenarioResultId(Long scenarioResultId) {
        this.scenarioResultId = scenarioResultId;
    }

    public String getActionType() {
        return actionType;
    }

    public void setActionType(String actionType) {
        this.actionType = actionType;
    }

    public String getActionTitle() {
        return actionTitle;
    }

    public void setActionTitle(String actionTitle) {
        this.actionTitle = actionTitle;
    }

    public String getActionDescription() {
        return actionDescription;
    }

    public void setActionDescription(String actionDescription) {
        this.actionDescription = actionDescription;
    }

    public Integer getPriorityOrder() {
        return priorityOrder;
    }

    public void setPriorityOrder(Integer priorityOrder) {
        this.priorityOrder = priorityOrder;
    }

    public Long getServiceLinkId() {
        return serviceLinkId;
    }

    public void setServiceLinkId(Long serviceLinkId) {
        this.serviceLinkId = serviceLinkId;
    }
}
