package com.pivotseoul.domain.simulation.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pivotseoul.domain.simulation.entity.ExternalServiceLink;

public interface ExternalServiceLinkRepository extends JpaRepository<ExternalServiceLink, Long> {
}
