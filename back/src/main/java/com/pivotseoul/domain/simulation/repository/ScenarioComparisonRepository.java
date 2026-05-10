package com.pivotseoul.domain.simulation.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pivotseoul.domain.simulation.entity.ScenarioComparison;

public interface ScenarioComparisonRepository extends JpaRepository<ScenarioComparison, Long> {
}
