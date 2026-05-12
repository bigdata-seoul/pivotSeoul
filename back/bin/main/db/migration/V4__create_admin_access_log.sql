-- ============================================================
-- V4: admin_access_log 테이블 생성
--
-- 관리자 접근 이력을 기록하는 테이블.
-- 현재는 id만 정의된 최소 구조이며, 추후 아래 TODO 필드를 추가한다.
--
-- TODO: 추후 추가 예정 컬럼
--   - admin_id       BIGINT        : 접근한 관리자 ID (FK)
--   - ip_address     VARCHAR(45)   : 접근 IP (IPv6 대응 45자)
--   - request_uri    VARCHAR(512)  : 요청 URI
--   - http_method    VARCHAR(10)   : GET / POST / PATCH / DELETE
--   - accessed_at    TIMESTAMP     : 접근 일시
--   - response_code  INT           : HTTP 응답 코드
-- ============================================================

CREATE TABLE admin_access_log (
    id BIGSERIAL PRIMARY KEY   -- 자동 증가 PK (PostgreSQL BIGSERIAL = BIGINT + SEQUENCE)
);