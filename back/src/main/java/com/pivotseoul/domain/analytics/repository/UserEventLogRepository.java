package com.pivotseoul.domain.analytics.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pivotseoul.domain.analytics.entity.UserEventLog;

public interface UserEventLogRepository extends JpaRepository<UserEventLog, Long> {
}
