package com.pivotseoul.domain.analytics.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pivotseoul.domain.analytics.entity.ExternalClickLog;

public interface ExternalClickLogRepository extends JpaRepository<ExternalClickLog, Long> {
}
