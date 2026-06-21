package com.pivotseoul.domain.simulation.dto;

public record CreateSessionRequest(
    String lifeStageCode,
    String currentDistrict,
    String compareDistrict,
    Integer monthlyIncome,
    Integer monthlyHousing,
    Integer monthlyLiving,
    Integer commuteTime,
    Integer childcareCost,
    Integer returnToWorkMonths,
    Integer retirementAge,
    Integer savings
) {}