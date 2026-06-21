package com.pivotseoul.domain.content.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pivotseoul.domain.content.entity.MaintenanceSchedule;

public interface MaintenanceScheduleRepository extends JpaRepository<MaintenanceSchedule, Long> {
}
