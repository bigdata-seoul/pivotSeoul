package com.pivotseoul.domain.simulation.dto;

import com.fasterxml.jackson.databind.JsonNode;

public class RunSimulationResponse {

    private String sessionId;
    private String runStatus;
    private JsonNode aiResult;

    public RunSimulationResponse() {
    }

    public RunSimulationResponse(String sessionId, String runStatus, JsonNode aiResult) {
        this.sessionId = sessionId;
        this.runStatus = runStatus;
        this.aiResult = aiResult;
    }

    public String getSessionId() {
        return sessionId;
    }

    public String getRunStatus() {
        return runStatus;
    }

    public JsonNode getAiResult() {
        return aiResult;
    }
}