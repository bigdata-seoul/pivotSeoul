package com.pivotseoul.domain.simulation.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pivotseoul.domain.ai.service.AiGatewayService;
import com.pivotseoul.domain.simulation.dto.RunSimulationRequest;
import com.pivotseoul.domain.simulation.dto.RunSimulationResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SimulationEngineService {

    private static final double HOUSING_RED_ZONE_THRESHOLD = 0.4;

    private final AiGatewayService aiGatewayService;
    private final ObjectMapper objectMapper;

    public SimulationEngineService(
            AiGatewayService aiGatewayService,
            ObjectMapper objectMapper) {
        this.aiGatewayService = aiGatewayService;
        this.objectMapper = objectMapper;
    }

    public ResponseEntity<RunSimulationResponse> runSimulation(
            String sessionId,
            RunSimulationRequest request) {
        JsonNode aiRequestBody = objectMapper.valueToTree(request);
        ResponseEntity<JsonNode> aiResponse = aiGatewayService.housingAnalyze(aiRequestBody);
        JsonNode aiResult = aiResponse.getBody();

        boolean success = aiResponse.getStatusCode().is2xxSuccessful();

        if (!success) {
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