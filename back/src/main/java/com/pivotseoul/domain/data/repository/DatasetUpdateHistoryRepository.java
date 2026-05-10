package com.pivotseoul.domain.data.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pivotseoul.domain.data.entity.DatasetUpdateHistory;

public interface DatasetUpdateHistoryRepository extends JpaRepository<DatasetUpdateHistory, Long> {
}
