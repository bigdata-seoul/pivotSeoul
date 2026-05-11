package com.pivotseoul.domain.simulation.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class RunSimulationRequest {

    private String district;

    @JsonProperty("monthly_income")
    private Integer monthlyIncome;

    @JsonProperty("monthly_housing_cost")
    private Integer monthlyHousingCost;

    public RunSimulationRequest() {
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public Integer getMonthlyIncome() {
        return monthlyIncome;
    }

    public void setMonthlyIncome(Integer monthlyIncome) {
        this.monthlyIncome = monthlyIncome;
    }

    public Integer getMonthlyHousingCost() {
        return monthlyHousingCost;
    }

    public void setMonthlyHousingCost(Integer monthlyHousingCost) {
        this.monthlyHousingCost = monthlyHousingCost;
    }
}