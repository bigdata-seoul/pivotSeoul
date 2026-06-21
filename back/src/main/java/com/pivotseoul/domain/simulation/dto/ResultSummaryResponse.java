package com.pivotseoul.domain.simulation.dto;

import java.math.BigDecimal;

public record ResultSummaryResponse(
        Long resultId,
        Long simulationRunId,
        Long scenarioId,
        String resultStatus,
        String riskStatus,
        BigDecimal totalScore,
        BigDecimal riskScore,
        BigDecimal confidenceScore,
        long redZoneCount,
        String message
) {
}
