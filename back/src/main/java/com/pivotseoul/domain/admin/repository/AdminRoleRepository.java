package com.pivotseoul.domain.admin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pivotseoul.domain.admin.entity.AdminRole;

public interface AdminRoleRepository extends JpaRepository<AdminRole, Long> {
}
