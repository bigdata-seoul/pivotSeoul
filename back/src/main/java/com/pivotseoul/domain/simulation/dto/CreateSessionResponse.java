package com.pivotseoul.domain.simulation.dto;

public record CreateSessionResponse(
    // 기존 sessionUuid 대신 프론트엔드와 통일된 sessionId 명칭 사용
    String sessionId
) {}