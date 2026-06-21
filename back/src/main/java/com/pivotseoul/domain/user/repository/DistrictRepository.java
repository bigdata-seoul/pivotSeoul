package com.pivotseoul.domain.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pivotseoul.domain.user.entity.District;

public interface DistrictRepository extends JpaRepository<District, Long> {
}
