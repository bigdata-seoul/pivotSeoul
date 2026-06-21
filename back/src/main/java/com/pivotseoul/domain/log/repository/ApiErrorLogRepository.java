package com.pivotseoul.domain.log.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pivotseoul.domain.log.entity.ApiErrorLog;

public interface ApiErrorLogRepository extends JpaRepository<ApiErrorLog, Long> {
}
