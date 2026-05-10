package com.pivotseoul.domain.data.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pivotseoul.domain.data.entity.DataSourceMeta;

public interface DataSourceMetaRepository extends JpaRepository<DataSourceMeta, Long> {
}
