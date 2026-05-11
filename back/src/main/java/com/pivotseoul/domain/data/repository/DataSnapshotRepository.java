package com.pivotseoul.domain.data.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pivotseoul.domain.data.entity.DataSnapshot;

import java.util.Optional;

public interface DataSnapshotRepository extends JpaRepository<DataSnapshot, Long> {
    Optional<DataSnapshot> findTopByDataSourceIdOrderByCollectedAtDescDataSnapshotIdDesc(Long dataSourceId);
}
