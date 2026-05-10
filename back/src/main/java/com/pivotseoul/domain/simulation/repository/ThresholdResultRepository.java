package com.pivotseoul.domain.simulation.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pivotseoul.domain.simulation.entity.ThresholdResult;

public interface ThresholdResultRepository extends JpaRepository<ThresholdResult, Long> {
}
