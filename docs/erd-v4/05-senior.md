# §5 노년 기능 ERD

## 5.1 목적

노후 자산수명, 주거 유지/다운사이징, 복지시설 접근성, 주택연금·노인복지 링크를 연결한다.

```mermaid
erDiagram
	SCENARIO_INPUT_SUMMARY {
		bigint input_summary_id PK
		bigint scenario_id FK
		varchar age_group
		varchar income_band
		varchar health_status_group
		varchar monthly_budget_band
	}

	SCENARIO_RESULT {
		bigint scenario_result_id PK
		bigint scenario_id FK
		decimal senior_sustainability_score
		decimal housing_score
		decimal policy_score
		decimal risk_score
	}

	THRESHOLD_TYPE {
		bigint threshold_type_id PK
		varchar threshold_code "SENIOR_SUSTAINABILITY"
		varchar threshold_name
		text formula_version
	}

	THRESHOLD_RESULT {
		bigint threshold_result_id PK
		bigint scenario_result_id FK
		bigint threshold_type_id FK
		varchar threshold_status
		decimal calculated_value "asset_life_months"
		decimal threshold_value
		boolean is_red_zone
		text calculation_summary
	}

	RECOMMENDATION_CANDIDATE {
		bigint candidate_id PK
		bigint scenario_result_id FK
		varchar candidate_type "SENIOR/FACILITY/HOUSING/POLICY"
		varchar candidate_title
		varchar district_name
		decimal fit_score
		text reason
		varchar source_link
	}

	RECOVERY_LEVER {
		bigint recovery_lever_id PK
		bigint threshold_result_id FK
		varchar lever_type "PENSION/MOVE/SENIOR_FACILITY"
		varchar lever_title
		text lever_description
		bigint service_link_id FK
	}

	EXTERNAL_SERVICE_LINK {
		bigint service_link_id PK
		varchar link_type "SENIOR/HOUSING"
		varchar title
		varchar url
		varchar provider
	}

	DATA_SNAPSHOT {
		bigint data_snapshot_id PK
		bigint data_source_id FK
		varchar snapshot_version
		decimal data_quality_score
	}

	SCENARIO_INPUT_SUMMARY ||--o{ SCENARIO_RESULT : informs
	SCENARIO_RESULT ||--o{ THRESHOLD_RESULT : has_senior_threshold
	THRESHOLD_TYPE ||--o{ THRESHOLD_RESULT : defines
	SCENARIO_RESULT ||--o{ RECOMMENDATION_CANDIDATE : recommends
	THRESHOLD_RESULT ||--o{ RECOVERY_LEVER : suggests
	EXTERNAL_SERVICE_LINK ||--o{ RECOVERY_LEVER : connects
	DATA_SNAPSHOT ||--o{ RECOMMENDATION_CANDIDATE : supports
```

## 5.2 노년 기능 계산 흐름

```
age_group + monthly_budget_band + health_status_group
→ 월 부족분 / 자산수명 계산
→ 노후 지속 임계점 판정
→ 주택연금·다운사이징·복지시설 후보 추천
→ 첫 실행 액션 생성
```
