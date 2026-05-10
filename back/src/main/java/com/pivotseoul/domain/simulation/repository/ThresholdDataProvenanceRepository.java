package com.pivotseoul.domain.simulation.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pivotseoul.domain.simulation.entity.ThresholdDataProvenance;

public interface ThresholdDataProvenanceRepository extends JpaRepository<ThresholdDataProvenance, Long> {
}
