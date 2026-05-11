package com.pivotseoul.domain.simulation.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pivotseoul.domain.ai.service.AiGatewayService;
import com.pivotseoul.domain.simulation.dto.RunSimulationRequest;
import com.pivotseoul.domain.simulation.dto.RunSimulationResponse;
import com.pivotseoul.domain.simulation.entity.Scenario;
import com.pivotseoul.domain.simulation.entity.SimulationRun;
import com.pivotseoul.domain.simulation.repository.ScenarioRepository;
import com.pivotseoul.domain.simulation.repository.SimulationRunRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Service
public class SimulationEngineService {

    private static final double HOUSING_RED_ZONE_THRESHOLD = 0.4;

    private final AiGatewayService aiGatewayService;
    private final ObjectMapper objectMapper;
    private final SimulationRunRepository simulationRunRepository;
    private final CalculationLogService calculationLogService;
    private final SimulationResultSaveService simulationResultSaveService;
    private final ScenarioRepository scenarioRepository;

    public SimulationEngineService(
            AiGatewayService aiGatewayService,
            ObjectMapper objectMapper,
            SimulationRunRepository simulationRunRepository,
            CalculationLogService calculationLogService,
            SimulationResultSaveService simulationResultSaveService,
            ScenarioRepository scenarioRepository) {
        this.aiGatewayService = aiGatewayService;
        this.objectMapper = objectMapper;
        this.simulationRunRepository = simulationRunRepository;
        this.calculationLogService = calculationLogService;
        this.simulationResultSaveService = simulationResultSaveService;
        this.scenarioRepository = scenarioRepository;
    }

    public ResponseEntity<RunSimulationResponse> runSimulation(
            String sessionId,
            RunSimulationRequest request) {
        Long numericSessionId = parseSessionId(sessionId);

        SimulationRun simulationRun = createRunningSimulationRun(numericSessionId);
        JsonNode aiRequestBody = objectMapper.valueToTree(request);

        ResponseEntity<JsonNode> aiResponse = aiGatewayService.housingAnalyze(aiRequestBody);
        JsonNode aiResult = aiResponse.getBody();

        boolean success = aiResponse.getStatusCode().is2xxSuccessful();

        if (!success) {
            simulationRun.setRunStatus("FAILED");
            simulationRun.setCompletedAt(Instant.now());
            simulationRunRepository.save(simulationRun);

            calculationLogService.saveFailureLog(
                    simulationRun.getSimulationRunId(),
                    aiRequestBody,
                    aiResult,
                    extractText(aiResult, "error", "FASTAPI_ERROR"),
                    extractText(aiResult, "detail", "FastAPI request failed"));

            RunSimulationResponse failedResponse = new RunSimulationResponse(
                    sessionId,
                    "FAILED",
                    "UNKNOWN",
                    0,
                    0.0,
                    List.of(),
                    aiResult);

            return ResponseEntity.status(aiResponse.getStatusCode()).body(failedResponse);
        }

        String resultStatus = extractText(aiResult, "housing_status", "UNKNOWN").toUpperCase();
        Integer riskScore = extractInt(aiResult, "risk_score", 0);
        Double confidenceScore = extractDouble(aiResult, "confidence_score", 0.0);
        Double rir = extractDouble(aiResult, "rir", null);
        Boolean isRedZone = extractBoolean(aiResult, "is_red_zone", false);

        simulationRun.setRunStatus("COMPLETED");
        simulationRun.setTotalConfidenceScore(BigDecimal.valueOf(confidenceScore));
        simulationRun.setCompletedAt(Instant.now());
        simulationRunRepository.save(simulationRun);

        calculationLogService.saveSuccessLog(
                simulationRun.getSimulationRunId(),
                aiRequestBody,
                aiResult);

        Long scenarioId = resolveScenarioId(numericSessionId);

        simulationResultSaveService.saveHousingResult(
                simulationRun.getSimulationRunId(),
                scenarioId,
                aiResult);

        RunSimulationResponse.ThresholdResultItem housingThreshold = new RunSimulationResponse.ThresholdResultItem(
                "HOUSING",
                rir,
                HOUSING_RED_ZONE_THRESHOLD,
                resultStatus,
                isRedZone);

        RunSimulationResponse response = new RunSimulationResponse(
                sessionId,
                "COMPLETED",
                resultStatus,
                riskScore,
                confidenceScore,
                List.of(housingThreshold),
                aiResult);

        return ResponseEntity.status(aiResponse.getStatusCode()).body(response);
    }

    private SimulationRun createRunningSimulationRun(Long sessionId) {
        SimulationRun simulationRun = new SimulationRun();
        simulationRun.setSessionId(sessionId);
        simulationRun.setRunStatus("RUNNING");
        simulationRun.setCalculationEngineVersion("SPRING_ENGINE_V1");
        simulationRun.setAiPipelineVersion("FASTAPI_HOUSING_V1");
        simulationRun.setModelVersion("RULE_BASED_V1");
        simulationRun.setStartedAt(Instant.now());

        return simulationRunRepository.save(simulationRun);
    }

    private Long resolveScenarioId(Long sessionId) {
        Scenario scenario = scenarioRepository
                .findFirstBySessionIdOrderByDisplayOrderAscScenarioIdAsc(sessionId)
                .orElseThrow(() -> new IllegalStateException(
                        "Scenario is not initialized for sessionId=" + sessionId));

        return scenario.getScenarioId();
    }

    private Long parseSessionId(String sessionId) {
        try {
            return Long.parseLong(sessionId);
        } catch (NumberFormatException e) {
            return 0L;
        }
    }

    private String extractText(JsonNode node, String fieldName, String defaultValue) {
        if (node == null || node.get(fieldName) == null || node.get(fieldName).isNull()) {
            return defaultValue;
        }

        return node.get(fieldName).asText(defaultValue);
    }

    private Integer extractInt(JsonNode node, String fieldName, Integer defaultValue) {
        if (node == null || node.get(fieldName) == null || node.get(fieldName).isNull()) {
            return defaultValue;
        }

        return node.get(fieldName).asInt(defaultValue);
    }

    private Double extractDouble(JsonNode node, String fieldName, Double defaultValue) {
        if (node == null || node.get(fieldName) == null || node.get(fieldName).isNull()) {
            return defaultValue;
        }

        return node.get(fieldName).asDouble();
    }

    private Boolean extractBoolean(JsonNode node, String fieldName, Boolean defaultValue) {
        if (node == null || node.get(fieldName) == null || node.get(fieldName).isNull()) {
            return defaultValue;
        }

        return node.get(fieldName).asBoolean(defaultValue);
    }
}