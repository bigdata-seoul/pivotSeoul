package com.pivotseoul.domain.simulation.repository;

import com.pivotseoul.domain.simulation.entity.ScenarioResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScenarioResultRepository extends JpaRepository<ScenarioResult, Long> {
    List<ScenarioResult> findBySimulationRunIdOrderByScenarioResultIdDesc(Long simulationRunId);
}
