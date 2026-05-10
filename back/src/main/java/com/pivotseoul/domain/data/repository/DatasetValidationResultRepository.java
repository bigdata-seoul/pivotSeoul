package com.pivotseoul.domain.data.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pivotseoul.domain.data.entity.DatasetValidationResult;

public interface DatasetValidationResultRepository extends JpaRepository<DatasetValidationResult, Long> {
}
