package com.pivotseoul.domain.simulation.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public record SimulationResultResponse(
        Long resultId,
        Long simulationRunId,
        Long scenarioId,
        String resultStatus,
        String riskStatus,
        ResultSummaryResponse summary,
        Map<String, BigDecimal> scores,
        List<ThresholdResultResponse> thresholds,
        List<EvidenceResponse> dataSources
) {
}
