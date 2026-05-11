package com.pivotseoul.domain.simulation.dto;

import com.fasterxml.jackson.databind.JsonNode;
import java.util.List;

public class RunSimulationResponse {

    private String sessionId;
    private String runStatus;
    private String resultStatus;
    private Integer riskScore;
    private Double confidenceScore;
    private List<ThresholdResultItem> thresholdResults;
    private JsonNode aiResult;

    public RunSimulationResponse() {
    }

    public RunSimulationResponse(
            String sessionId,
            String runStatus,
            String resultStatus,
            Integer riskScore,
            Double confidenceScore,
            List<ThresholdResultItem> thresholdResults,
            JsonNode aiResult) {
        this.sessionId = sessionId;
        this.runStatus = runStatus;
        this.resultStatus = resultStatus;
        this.riskScore = riskScore;
        this.confidenceScore = confidenceScore;
        this.thresholdResults = thresholdResults;
        this.aiResult = aiResult;
    }

    public String getSessionId() {
        return sessionId;
    }

    public String getRunStatus() {
        return runStatus;
    }

    public String getResultStatus() {
        return resultStatus;
    }

    public Integer getRiskScore() {
        return riskScore;
    }

    public Double getConfidenceScore() {
        return confidenceScore;
    }

    public List<ThresholdResultItem> getThresholdResults() {
        return thresholdResults;
    }

    public JsonNode getAiResult() {
        return aiResult;
    }

    public static class ThresholdResultItem {

        private String thresholdType;
        private Double calculatedValue;
        private Double thresholdValue;
        private String status;
        private Boolean isRedZone;

        public ThresholdResultItem() {
        }

        public ThresholdResultItem(
                String thresholdType,
                Double calculatedValue,
                Double thresholdValue,
                String status,
                Boolean isRedZone) {
            this.thresholdType = thresholdType;
            this.calculatedValue = calculatedValue;
            this.thresholdValue = thresholdValue;
            this.status = status;
            this.isRedZone = isRedZone;
        }

        public String getThresholdType() {
            return thresholdType;
        }

        public Double getCalculatedValue() {
            return calculatedValue;
        }

        public Double getThresholdValue() {
            return thresholdValue;
        }

        public String getStatus() {
            return status;
        }

        public Boolean getIsRedZone() {
            return isRedZone;
        }
    }
}