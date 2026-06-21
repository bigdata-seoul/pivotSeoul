package com.pivotseoul.domain.simulation.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pivotseoul.domain.simulation.entity.SimulationDataUsage;

import java.util.List;

public interface SimulationDataUsageRepository extends JpaRepository<SimulationDataUsage, Long> {
    List<SimulationDataUsage> findBySimulationRunIdOrderByUsageIdAsc(Long simulationRunId);
}
