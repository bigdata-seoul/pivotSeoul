package com.pivotseoul.domain.log.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pivotseoul.domain.log.entity.AiAnomalyLog;

public interface AiAnomalyLogRepository extends JpaRepository<AiAnomalyLog, Long> {
}
