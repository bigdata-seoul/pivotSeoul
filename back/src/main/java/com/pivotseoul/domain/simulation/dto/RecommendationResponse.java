package com.pivotseoul.domain.simulation.dto;

public record RecommendationResponse(
        String id,
        String kind,
        String title,
        String from,
        String to,
        String effect,
        String tradeoff,
        String priority,
        String reason
) {
}
