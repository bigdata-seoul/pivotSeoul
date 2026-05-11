package com.pivotseoul.domain.simulation.repository;

import com.pivotseoul.domain.simulation.entity.ThresholdType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ThresholdTypeRepository extends JpaRepository<ThresholdType, Long> {

    Optional<ThresholdType> findByThresholdCode(String thresholdCode);
}