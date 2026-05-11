package com.pivotseoul.domain.simulation.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "user_condition")
public class UserCondition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_condition_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false, unique = true)
    private SimulationSession simulationSession;

    private String currentDistrict;
    private String compareDistrict;
    private Integer monthlyIncome;
    private Integer monthlyHousing;
    private Integer monthlyLiving;
    private Integer commuteTime;
    private Integer childcareCost;
    private Integer returnToWorkMonths;
    private Integer retirementAge;
    private Integer savings;

    protected UserCondition() {
    }

    public UserCondition(SimulationSession simulationSession, String currentDistrict, String compareDistrict, 
                         Integer monthlyIncome, Integer monthlyHousing, Integer monthlyLiving, 
                         Integer commuteTime, Integer childcareCost, Integer returnToWorkMonths, 
                         Integer retirementAge, Integer savings) {
        this.simulationSession = simulationSession;
        this.currentDistrict = currentDistrict;
        this.compareDistrict = compareDistrict;
        this.monthlyIncome = monthlyIncome;
        this.monthlyHousing = monthlyHousing;
        this.monthlyLiving = monthlyLiving;
        this.commuteTime = commuteTime;
        this.childcareCost = childcareCost;
        this.returnToWorkMonths = returnToWorkMonths;
        this.retirementAge = retirementAge;
        this.savings = savings;
    }

    public Long getId() {
        return id;
    }

    public SimulationSession getSimulationSession() {
        return simulationSession;
    }

    public void setSimulationSession(SimulationSession simulationSession) {
        this.simulationSession = simulationSession;
    }

    public String getCurrentDistrict() {
        return currentDistrict;
    }

    public String getCompareDistrict() {
        return compareDistrict;
    }

    public Integer getMonthlyIncome() {
        return monthlyIncome;
    }

    public Integer getMonthlyHousing() {
        return monthlyHousing;
    }

    public Integer getMonthlyLiving() {
        return monthlyLiving;
    }

    public Integer getCommuteTime() {
        return commuteTime;
    }

    public Integer getChildcareCost() {
        return childcareCost;
    }

    public Integer getReturnToWorkMonths() {
        return returnToWorkMonths;
    }

    public Integer getRetirementAge() {
        return retirementAge;
    }

    public Integer getSavings() {
        return savings;
    }
}