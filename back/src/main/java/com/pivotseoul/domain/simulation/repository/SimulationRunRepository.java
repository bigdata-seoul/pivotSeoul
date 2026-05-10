package com.pivotseoul.domain.simulation.repository;

import com.pivotseoul.domain.simulation.entity.SimulationRun;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SimulationRunRepository extends JpaRepository<SimulationRun, Long> {
}
