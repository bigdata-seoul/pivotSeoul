-- ============================================================
-- V5: admin_role 테이블 생성
--
-- 관리자 권한 역할을 정의하는 테이블.
-- 현재는 id만 정의된 최소 구조.
--
-- TODO: 추후 추가 예정 컬럼
--   - role_name     VARCHAR(64)  : 역할명 (예: SUPER_ADMIN, VIEWER)
--   - description   VARCHAR(256) : 역할 설명
--   - created_at    TIMESTAMP    : 생성 일시
-- ============================================================

CREATE TABLE admin_role (
    id BIGSERIAL PRIMARY KEY
);