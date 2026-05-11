package com.pivotseoul.domain.simulation.dto;

public class RunSimulationRequest {

    private String district;
    private Integer monthly_income;

    public RunSimulationRequest() {
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public Integer getMonthly_income() {
        return monthly_income;
    }

    public void setMonthly_income(Integer monthly_income) {
        this.monthly_income = monthly_income;
    }
}