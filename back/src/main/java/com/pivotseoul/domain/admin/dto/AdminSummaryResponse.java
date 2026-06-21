package com.pivotseoul.domain.admin.dto;

public record AdminSummaryResponse(
        long activeUsers,
        long totalSimulations,
        double averageRiskScore,
        double errorRate
) {
}
