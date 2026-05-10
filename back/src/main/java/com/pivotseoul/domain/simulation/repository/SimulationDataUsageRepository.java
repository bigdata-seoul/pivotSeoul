package com.pivotseoul.domain.simulation.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pivotseoul.domain.simulation.entity.SimulationDataUsage;

public interface SimulationDataUsageRepository extends JpaRepository<SimulationDataUsage, Long> {
}
