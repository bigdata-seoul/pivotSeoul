package com.pivotseoul.domain.data.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pivotseoul.domain.data.entity.DatasetValidationResult;

import java.util.List;
import java.util.Optional;

public interface DatasetValidationResultRepository extends JpaRepository<DatasetValidationResult, Long> {
    List<DatasetValidationResult> findByDataSnapshotIdOrderByValidationResultIdDesc(Long dataSnapshotId);

    Optional<DatasetValidationResult> findTopByDataSnapshotIdOrderByValidationResultIdDesc(Long dataSnapshotId);
}
