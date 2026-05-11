package com.pivotseoul.domain.simulation.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pivotseoul.domain.simulation.entity.WeeklyAction;

import java.util.List;

public interface WeeklyActionRepository extends JpaRepository<WeeklyAction, Long> {
    List<WeeklyAction> findByScenarioResultIdOrderByPriorityOrderAscWeeklyActionIdAsc(Long scenarioResultId);
}
