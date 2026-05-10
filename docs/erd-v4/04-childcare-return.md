# §4 보육/복직 기능 ERD

## 4.1 목적

자녀 연령, 보육 인프라, 시설 접근성, 복직 순이익, 돌봄 Red Zone을 연결한다.

```mermaid
erDiagram
	SCENARIO_INPUT_SUMMARY {
		bigint input_summary_id PK
		bigint scenario_id FK
		varchar household_type
		varchar child_age_group
		varchar income_band
		varchar commute_time_band
	}

	SCENARIO_RESULT {
		bigint scenario_result_id PK
		bigint scenario_id FK
		decimal childcare_score
		decimal policy_score
		decimal disposable_income_score
		decimal time_loss_score
	}

	THRESHOLD_TYPE {
		bigint threshold_type_id PK
		varchar threshold_code "RETURN_TO_WORK/TIME_COLLAPSE"
		varchar threshold_name
		text formula_version
	}

	THRESHOLD_RESULT {
		bigint threshold_result_id PK
		bigint scenario_result_id FK
		bigint threshold_type_id FK
		varchar threshold_status
		decimal calculated_value "return_profit_or_travel_time"
		decimal threshold_value
		boolean is_red_zone
		text calculation_summary
	}

	RECOMMENDATION_CANDIDATE {
		bigint candidate_id PK
		bigint scenario_result_id FK
		varchar candidate_type "FACILITY/POLICY"
		varchar candidate_title
		varchar district_name
		decimal fit_score
		text reason
		varchar source_link
	}

	RECOVERY_LEVER {
		bigint recovery_lever_id PK
		bigint threshold_result_id FK
		varchar lever_type "CARE/POLICY/MOVE"
		varchar lever_title
		text lever_description
		decimal expected_effect_score
		bigint service_link_id FK
	}

	RETRIEVED_EVIDENCE {
		bigint evidence_id PK
		bigint scenario_result_id FK
		varchar evidence_type "POLICY/FACILITY"
		text evidence_title
		text evidence_text
		decimal retrieval_score
	}

	DATA_SNAPSHOT {
		bigint data_snapshot_id PK
		bigint data_source_id FK
		varchar snapshot_version
		decimal data_quality_score
	}

	THRESHOLD_DATA_PROVENANCE {
		bigint provenance_id PK
		bigint threshold_result_id FK
		bigint data_snapshot_id FK
		varchar used_field
		text calculation_note
	}

	SCENARIO_INPUT_SUMMARY ||--o{ SCENARIO_RESULT : informs
	SCENARIO_RESULT ||--o{ THRESHOLD_RESULT : has_childcare_threshold
	THRESHOLD_TYPE ||--o{ THRESHOLD_RESULT : defines
	SCENARIO_RESULT ||--o{ RECOMMENDATION_CANDIDATE : recommends_facility_or_policy
	THRESHOLD_RESULT ||--o{ RECOVERY_LEVER : suggests
	SCENARIO_RESULT ||--o{ RETRIEVED_EVIDENCE : grounds
	THRESHOLD_RESULT ||--o{ THRESHOLD_DATA_PROVENANCE : based_on
	DATA_SNAPSHOT ||--o{ THRESHOLD_DATA_PROVENANCE : supports
```

## 4.2 보육/복직 기능에서 쓰는 데이터

| 데이터 | 사용 목적 | 결과 연결 |
| --- | --- | --- |
| 어린이집 정원현원 충족률 | 보육 공급 점수, 수용 여력 계산 | `SCENARIO_RESULT.childcare_score` |
| 우리동네키움센터 시설현황 | 돌봄 접근성, 시설 후보 추천 | `RECOMMENDATION_CANDIDATE` |
| 몽땅정보 만능키 | 출산·육아 정책 추천, 복직 순이익 보정 | `RETRIEVED_EVIDENCE`, `RECOVERY_LEVER` |
