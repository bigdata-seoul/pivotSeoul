package com.pivotseoul.domain.simulation.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pivotseoul.domain.simulation.entity.SimulationSession;

public interface SimulationSessionRepository extends JpaRepository<SimulationSession, Long> {
}
