package com.pivotseoul.domain.log.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pivotseoul.domain.log.entity.UserReport;

public interface UserReportRepository extends JpaRepository<UserReport, Long> {
}
