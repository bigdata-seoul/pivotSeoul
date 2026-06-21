package com.pivotseoul.domain.admin.dto;

import java.util.List;

public record AdminDashboardResponse(
        AdminSummaryResponse summary,
        List<ServiceMetric> serviceStatuses,
        List<AiStatus> aiStatuses,
        DataOperationStatus dataOperation,
        PromptRecommendationStatus promptRecommendation
) {

    public record ServiceMetric(
            String id,
            String label,
            int value,
            String unit,
            String status,
            int max
    ) {
    }

    public record AiStatus(
            String id,
            String label,
            String status,
            int latencyMs,
            String updatedAt
    ) {
    }

    public record DataOperationStatus(
            String status,
            long datasetCount,
            long validationWarningCount,
            String lastValidatedAt
    ) {
    }

    public record PromptRecommendationStatus(
            String status,
            String promptVersion,
            String recommendationVersion,
            String updatedAt
    ) {
    }
}
