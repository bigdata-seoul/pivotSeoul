package com.pivotseoul.domain.simulation.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.pivotseoul.domain.simulation.entity.ScenarioResult;
import com.pivotseoul.domain.simulation.entity.ThresholdResult;
import com.pivotseoul.domain.simulation.entity.ThresholdType;
import com.pivotseoul.domain.simulation.repository.ScenarioResultRepository;
import com.pivotseoul.domain.simulation.repository.ThresholdResultRepository;
import com.pivotseoul.domain.simulation.repository.ThresholdTypeRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class SimulationResultSaveService {

    private static final BigDecimal HOUSING_THRESHOLD_VALUE = BigDecimal.valueOf(0.4);

    private final ScenarioResultRepository scenarioResultRepository;
    private final ThresholdResultRepository thresholdResultRepository;
    private final ThresholdTypeRepository thresholdTypeRepository;

    public SimulationResultSaveService(
            ScenarioResultRepository scenarioResultRepository,
            ThresholdResultRepository thresholdResultRepository,
            ThresholdTypeRepository thresholdTypeRepository) {
        this.scenarioResultRepository = scenarioResultRepository;
        this.thresholdResultRepository = thresholdResultRepository;
        this.thresholdTypeRepository = thresholdTypeRepository;
    }

    public void saveHousingResult(
            Long simulationRunId,
            Long scenarioId,
            JsonNode aiResult) {
        String resultStatus = extractText(aiResult, "housing_status", "UNKNOWN").toUpperCase();
        BigDecimal riskScore = extractBigDecimal(aiResult, "risk_score", BigDecimal.ZERO);
        BigDecimal confidenceScore = extractBigDecimal(aiResult, "confidence_score", BigDecimal.ZERO);
        BigDecimal rir = extractBigDecimal(aiResult, "rir", null);
        boolean isRedZone = extractBoolean(aiResult, "is_red_zone", false);

        ScenarioResult scenarioResult = new ScenarioResult();
        scenarioResult.setSimulationRunId(simulationRunId);
        scenarioResult.setScenarioId(scenarioId);
        scenarioResult.setResultStatus(resultStatus);
        scenarioResult.setRiskScore(riskScore);
        scenarioResult.setConfidenceScore(confidenceScore);
        scenarioResult.setHousingScore(riskScore);
        scenarioResult.setTotalScore(BigDecimal.valueOf(100).subtract(riskScore));

        ScenarioResult savedScenarioResult = scenarioResultRepository.save(scenarioResult);

        ThresholdType housingThresholdType = thresholdTypeRepository
                .findByThresholdCode("HOUSING")
                .orElseThrow(() -> new IllegalStateException("HOUSING threshold type is not initialized"));

        ThresholdResult thresholdResult = new ThresholdResult();
        thresholdResult.setScenarioResultId(savedScenarioResult.getScenarioResultId());
        thresholdResult.setThresholdTypeId(housingThresholdType.getThresholdTypeId());
        thresholdResult.setThresholdStatus(resultStatus);
        thresholdResult.setCalculatedValue(rir);
        thresholdResult.setThresholdValue(HOUSING_THRESHOLD_VALUE);
        thresholdResult.setRedZone(isRedZone);
        thresholdResult.setCalculationSummary(buildCalculationSummary(rir, resultStatus, isRedZone));

        thresholdResultRepository.save(thresholdResult);
    }

    private String buildCalculationSummary(BigDecimal rir, String resultStatus, boolean isRedZone) {
        if (rir == null) {
            return "월소득 또는 월주거비 입력값이 부족하여 RIR 계산을 수행하지 못했습니다.";
        }

        return "RIR=" + rir + ", status=" + resultStatus + ", redZone=" + isRedZone;
    }

    private String extractText(JsonNode node, String fieldName, String defaultValue) {
        if (node == null || node.get(fieldName) == null || node.get(fieldName).isNull()) {
            return defaultValue;
        }

        return node.get(fieldName).asText(defaultValue);
    }

    private BigDecimal extractBigDecimal(JsonNode node, String fieldName, BigDecimal defaultValue) {
        if (node == null || node.get(fieldName) == null || node.get(fieldName).isNull()) {
            return defaultValue;
        }

        return BigDecimal.valueOf(node.get(fieldName).asDouble());
    }

    private boolean extractBoolean(JsonNode node, String fieldName, boolean defaultValue) {
        if (node == null || node.get(fieldName) == null || node.get(fieldName).isNull()) {
            return defaultValue;
        }

        return node.get(fieldName).asBoolean(defaultValue);
    }
}