package com.pivotseoul.domain.simulation.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pivotseoul.domain.simulation.entity.ScenarioVariable;

public interface ScenarioVariableRepository extends JpaRepository<ScenarioVariable, Long> {
}
