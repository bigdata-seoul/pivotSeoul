package com.pivotseoul.domain.simulation.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pivotseoul.domain.ai.service.AiGatewayService;
import com.pivotseoul.domain.simulation.dto.RunSimulationRequest;
import com.pivotseoul.domain.simulation.dto.RunSimulationResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/simulation-sessions")
public class SimulationRunController {

    private final AiGatewayService aiGatewayService;
    private final ObjectMapper objectMapper;

    public SimulationRunController(
            AiGatewayService aiGatewayService,
            ObjectMapper objectMapper) {
        this.aiGatewayService = aiGatewayService;
        this.objectMapper = objectMapper;
    }

    @PostMapping("/{sessionId}/run")
    public ResponseEntity<RunSimulationResponse> runSimulation(
            @PathVariable String sessionId,
            @RequestBody RunSimulationRequest request) {
        JsonNode aiRequestBody = objectMapper.valueToTree(request);

        ResponseEntity<JsonNode> aiResponse = aiGatewayService.housingAnalyze(aiRequestBody);

        RunSimulationResponse response = new RunSimulationResponse(
                sessionId,
                "COMPLETED",
                aiResponse.getBody());

        return ResponseEntity.status(aiResponse.getStatusCode()).body(response);
    }
}