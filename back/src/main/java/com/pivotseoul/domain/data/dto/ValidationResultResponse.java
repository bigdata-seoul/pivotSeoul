package com.pivotseoul.domain.data.dto;

public record ValidationResultResponse(
        Long validationResultId,
        Long dataSnapshotId,
        String status,
        Integer missingCount,
        Integer invalidCount,
        Integer duplicateCount,
        String message,
        String level
) {
}
