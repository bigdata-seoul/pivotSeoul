-- ============================================================
-- V6: 미구현 엔티티 stub 테이블 일괄 생성
--
-- 엔티티는 선언되어 있으나 DB 테이블이 없어 Hibernate validate 실패하는
-- 테이블들을 최소 구조(id만)로 생성한다.
--
-- 각 테이블은 추후 해당 도메인 담당자가 컬럼을 추가하며 완성한다.
-- 컬럼 추가 시 반드시 새 Vn 마이그레이션 파일로 ALTER TABLE 처리할 것.
-- ============================================================


-- ========================
-- analytics 도메인
-- ========================

-- 외부 링크 클릭 이벤트 로그
-- TODO: user_id, link_url, clicked_at, referrer 등 추가
CREATE TABLE external_click_log (
    id BIGSERIAL PRIMARY KEY
);

-- 사용자 행동 이벤트 로그 (페이지 이동, 버튼 클릭 등)
-- TODO: user_id, event_type, event_data(jsonb), occurred_at 등 추가
CREATE TABLE user_event_log (
    id BIGSERIAL PRIMARY KEY
);


-- ========================
-- auth 도메인
-- ========================

-- 관리자 계정
-- TODO: username, password_hash, email, role_id(FK→admin_role), created_at 등 추가
CREATE TABLE admin_user (
    id BIGSERIAL PRIMARY KEY
);


-- ========================
-- content 도메인
-- ========================

-- 외부 링크 관리 (서비스 내 외부 URL 모음)
-- TODO: title, url, category, is_active, display_order 등 추가
CREATE TABLE external_link (
    id BIGSERIAL PRIMARY KEY
);

-- FAQ (자주 묻는 질문)
-- TODO: question, answer, category, display_order, is_active 등 추가
CREATE TABLE faq (
    id BIGSERIAL PRIMARY KEY
);

-- 서비스 점검 일정
-- TODO: start_at, end_at, reason, is_active 등 추가
CREATE TABLE maintenance_schedule (
    id BIGSERIAL PRIMARY KEY
);

-- 공지사항
-- TODO: title, content, author_id, is_pinned, created_at 등 추가
CREATE TABLE notice (
    id BIGSERIAL PRIMARY KEY
);

-- 서비스 소개 콘텐츠 (랜딩, 가이드 등 정적 콘텐츠)
-- TODO: content_key, title, body, updated_at 등 추가
CREATE TABLE service_content (
    id BIGSERIAL PRIMARY KEY
);


-- ========================
-- data 도메인
-- ========================

-- 데이터 소스 메타정보 (API 출처, 수집 주기 등)
-- TODO: source_name, source_url, fetch_interval, last_fetched_at 등 추가
CREATE TABLE data_source_meta (
    id BIGSERIAL PRIMARY KEY
);

-- 데이터셋 업데이트 이력
-- TODO: dataset_id(FK), updated_at, update_type, summary 등 추가
CREATE TABLE dataset_update_history (
    id BIGSERIAL PRIMARY KEY
);


-- ========================
-- log 도메인
-- ========================

-- AI 이상 감지 로그 (FastAPI 응답 이상 등)
-- TODO: run_id, anomaly_type, detail, detected_at 등 추가
CREATE TABLE ai_anomaly_log (
    id BIGSERIAL PRIMARY KEY
);

-- API 에러 로그
-- TODO: endpoint, http_method, status_code, error_message, occurred_at 등 추가
CREATE TABLE api_error_log (
    id BIGSERIAL PRIMARY KEY
);

-- 시스템 로그 (배치, 스케줄러 등)
-- TODO: log_level, message, source, created_at 등 추가
CREATE TABLE system_log (
    id BIGSERIAL PRIMARY KEY
);

-- 사용자 신고
-- TODO: reporter_id, target_type, target_id, reason, status, created_at 등 추가
CREATE TABLE user_report (
    id BIGSERIAL PRIMARY KEY
);


-- ========================
-- simulation 도메인
-- ========================

-- 시나리오 변수 (소득, 보증금, 월세, 통근시간 등 조건값)
-- scenario_id + var_key 조합으로 upsert 처리
CREATE TABLE scenario_variable (
    id          BIGSERIAL    PRIMARY KEY,
    scenario_id BIGINT       NOT NULL REFERENCES scenario(scenario_id),
    var_key     VARCHAR(64)  NOT NULL,
    var_value   VARCHAR(256),
    UNIQUE (scenario_id, var_key)   -- 동일 시나리오 내 중복 키 방지
);