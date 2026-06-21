package com.pivotseoul.domain.log.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pivotseoul.domain.log.entity.SystemLog;

public interface SystemLogRepository extends JpaRepository<SystemLog, Long> {
}
