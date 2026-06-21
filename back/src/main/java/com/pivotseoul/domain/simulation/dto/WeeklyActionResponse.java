package com.pivotseoul.domain.simulation.dto;

public record WeeklyActionResponse(
        Long id,
        String title,
        String sourceLabel,
        String actionType,
        String description,
        Integer priorityOrder,
        Long serviceLinkId
) {
}
