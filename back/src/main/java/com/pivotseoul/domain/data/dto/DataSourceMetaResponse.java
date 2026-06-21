package com.pivotseoul.domain.data.dto;

import java.time.LocalDate;

public record DataSourceMetaResponse(
        Long dataSourceId,
        Long datasetId,
        String sourceName,
        String sourceFileName,
        String sourceType,
        String storagePath,
        LocalDate baseDate,
        String schemaHash
) {
}
