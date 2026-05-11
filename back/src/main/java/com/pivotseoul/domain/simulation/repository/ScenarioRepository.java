package com.pivotseoul.domain.simulation.repository;

import com.pivotseoul.domain.simulation.entity.Scenario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ScenarioRepository extends JpaRepository<Scenario, Long> {

    Optional<Scenario> findFirstBySessionIdOrderByDisplayOrderAscScenarioIdAsc(Long sessionId);
}