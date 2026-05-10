package com.pivotseoul.domain.simulation.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pivotseoul.domain.simulation.entity.CalculationLog;

public interface CalculationLogRepository extends JpaRepository<CalculationLog, Long> {
}
