package com.pivotseoul.domain.data.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pivotseoul.domain.data.entity.DatasetRegistry;

public interface DatasetRegistryRepository extends JpaRepository<DatasetRegistry, Long> {
}
