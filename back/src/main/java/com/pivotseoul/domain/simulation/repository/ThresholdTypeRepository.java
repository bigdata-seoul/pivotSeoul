package com.pivotseoul.domain.simulation.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pivotseoul.domain.simulation.entity.ThresholdType;

public interface ThresholdTypeRepository extends JpaRepository<ThresholdType, Long> {
}
