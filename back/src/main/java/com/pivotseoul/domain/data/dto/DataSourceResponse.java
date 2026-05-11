package com.pivotseoul.domain.data.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public record DataSourceResponse(
        Long dataSourceId,
        Long datasetId,
        String sourceName,
        String provider,
        String sourceType,
        LocalDate baseDate,
        Instant lastUpdatedAt,
        String datasetStatus,
        BigDecimal reliabilityScore,
        String reliabilityStatus,
        String validationStatus
) {
}
