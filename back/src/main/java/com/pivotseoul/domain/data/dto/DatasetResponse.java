package com.pivotseoul.domain.data.dto;

import java.time.Instant;

public record DatasetResponse(
        Long datasetId,
        String datasetCode,
        String datasetName,
        String provider,
        String sourceUrl,
        String updateCycle,
        String status,
        Instant lastUpdatedAt,
        String version,
        Integer rows,
        String reliabilityStatus,
        String validationStatus
) {
}
