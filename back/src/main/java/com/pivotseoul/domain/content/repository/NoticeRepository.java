package com.pivotseoul.domain.content.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pivotseoul.domain.content.entity.Notice;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
}
