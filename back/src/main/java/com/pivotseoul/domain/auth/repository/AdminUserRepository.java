package com.pivotseoul.domain.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pivotseoul.domain.auth.entity.AdminUser;

public interface AdminUserRepository extends JpaRepository<AdminUser, Long> {
}
