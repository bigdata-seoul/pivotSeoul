package com.pivotseoul.domain.admin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pivotseoul.domain.admin.entity.AdminAccessLog;

public interface AdminAccessLogRepository extends JpaRepository<AdminAccessLog, Long> {
}
