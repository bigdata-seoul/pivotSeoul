package com.pivotseoul.domain.simulation.dto;

import java.math.BigDecimal;

public record ThresholdResultResponse(
        Long thresholdResultId,
        Long thresholdTypeId,
        String status,
        BigDecimal calculatedValue,
        BigDecimal thresholdValue,
        boolean redZone,
        String summary
) {
}
