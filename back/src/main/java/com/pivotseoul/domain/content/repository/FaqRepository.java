package com.pivotseoul.domain.content.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pivotseoul.domain.content.entity.Faq;

public interface FaqRepository extends JpaRepository<Faq, Long> {
}
