package com.pivotseoul.domain.content.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pivotseoul.domain.content.entity.ExternalLink;

public interface ExternalLinkRepository extends JpaRepository<ExternalLink, Long> {
}
