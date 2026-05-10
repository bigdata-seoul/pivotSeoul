package com.pivotseoul.domain.simulation.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pivotseoul.domain.simulation.entity.WeeklyAction;

public interface WeeklyActionRepository extends JpaRepository<WeeklyAction, Long> {
}
