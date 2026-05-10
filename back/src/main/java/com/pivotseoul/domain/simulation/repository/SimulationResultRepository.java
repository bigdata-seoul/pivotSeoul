package com.pivotseoul.domain.simulation.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pivotseoul.domain.simulation.entity.SimulationResult;

public interface SimulationResultRepository extends JpaRepository<SimulationResult, Long> {
}
