package com.pivotseoul.domain.simulation.repository;

import com.pivotseoul.domain.simulation.entity.ScenarioInputSummary;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScenarioInputSummaryRepository extends JpaRepository<ScenarioInputSummary, Long> {
}
