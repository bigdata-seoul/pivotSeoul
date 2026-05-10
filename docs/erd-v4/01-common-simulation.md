# §1 공통 시뮬레이션 기능 ERD

## 1.1 목적

사용자가 생애 단계를 선택하고, 시나리오 A/B를 만든 뒤, 계산 실행 결과를 저장하는 공통 흐름이다.

```mermaid
erDiagram
	LIFE_STAGE {
		bigint life_stage_id PK
		varchar stage_code
		varchar stage_name
		text description
	}

	DISTRICT {
		bigint district_id PK
		varchar district_code
		varchar district_name
		varchar region_group
	}

	SIMULATION_SESSION {
		bigint session_id PK
		varchar session_uuid
		bigint life_stage_id FK
		varchar anonymous_user_key_hash
		varchar session_status
		boolean consent_to_save_result
		datetime created_at
		datetime expired_at
	}

	SCENARIO {
		bigint scenario_id PK
		bigint session_id FK
		varchar scenario_type "A/B"
		bigint current_district_id FK
		bigint compare_district_id FK
		varchar scenario_title
		int display_order
	}

	SCENARIO_INPUT_SUMMARY {
		bigint input_summary_id PK
		bigint scenario_id FK
		varchar age_group
		varchar income_band
		varchar household_type
		varchar child_age_group
		varchar target_job_group
		varchar monthly_budget_band
		boolean is_anonymized
	}

	SIMULATION_RUN {
		bigint simulation_run_id PK
		bigint session_id FK
		varchar run_status
		varchar calculation_engine_version
		varchar ai_pipeline_version
		decimal total_confidence_score
		datetime started_at
		datetime completed_at
	}

	SCENARIO_RESULT {
		bigint scenario_result_id PK
		bigint simulation_run_id FK
		bigint scenario_id FK
		varchar result_status
		decimal total_score
		decimal risk_score
		decimal confidence_score
	}

	SCENARIO_COMPARISON {
		bigint comparison_id PK
		bigint simulation_run_id FK
		bigint base_scenario_result_id FK
		bigint compare_scenario_result_id FK
		decimal score_diff
		decimal risk_diff
		varchar recommended_scenario_type
		text comparison_summary
	}

	LIFE_STAGE ||--o{ SIMULATION_SESSION : selected_by
	SIMULATION_SESSION ||--o{ SCENARIO : creates
	SIMULATION_SESSION ||--o{ SIMULATION_RUN : runs
	DISTRICT ||--o{ SCENARIO : current_area
	DISTRICT ||--o{ SCENARIO : compare_area
	SCENARIO ||--|| SCENARIO_INPUT_SUMMARY : has
	SIMULATION_RUN ||--o{ SCENARIO_RESULT : produces
	SCENARIO ||--o{ SCENARIO_RESULT : calculated_as
	SIMULATION_RUN ||--o{ SCENARIO_COMPARISON : compares
```

## 1.2 구현 메모

- `SIMULATION_SESSION`은 사용자 계정 중심이 아니라 **1회 시뮬레이션 실행 단위**다.
- 원본 입력값은 저장하지 않고 `SCENARIO_INPUT_SUMMARY`에 구간화 요약만 저장한다.
- A/B 비교는 `SCENARIO_COMPARISON`에서 결과 차이와 추천 시나리오를 저장한다.

**레포:** `back/.../db/migration/V1__erd_v4_core_simulation.sql` 와 정렬.
