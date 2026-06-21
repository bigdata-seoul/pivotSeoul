package com.pivotseoul.domain.simulation.dto;

import java.math.BigDecimal;

public record EvidenceResponse(
        Long usageId,
        Long dataSnapshotId,
        String usedFor,
        String usedFieldList,
        BigDecimal sourceWeight
) {
}
