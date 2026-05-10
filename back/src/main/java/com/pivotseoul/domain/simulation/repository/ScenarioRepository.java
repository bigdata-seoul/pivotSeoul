package com.pivotseoul.domain.simulation.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pivotseoul.domain.simulation.entity.Scenario;

public interface ScenarioRepository extends JpaRepository<Scenario, Long> {
}
