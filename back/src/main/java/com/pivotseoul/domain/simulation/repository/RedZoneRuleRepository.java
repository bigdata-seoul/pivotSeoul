package com.pivotseoul.domain.simulation.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pivotseoul.domain.simulation.entity.RedZoneRule;

public interface RedZoneRuleRepository extends JpaRepository<RedZoneRule, Long> {
}
