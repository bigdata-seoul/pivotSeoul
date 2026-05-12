-- ============================================================
-- V7: scenario_variable PK 컬럼명 id → variable_id 수정
--
-- V6에서 id로 생성했으나 ScenarioVariable 엔티티가
-- @Column(name = "variable_id")로 선언되어 있어 컬럼명 불일치.
-- RENAME으로 수정.
-- ============================================================

ALTER TABLE scenario_variable RENAME COLUMN id TO variable_id;