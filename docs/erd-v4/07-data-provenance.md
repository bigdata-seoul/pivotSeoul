# §7 데이터 출처/스냅샷 기능 ERD

## 7.1 목적

공공데이터 기반 서비스의 핵심인 **출처·기준일·스냅샷·사용 필드·검증 결과**를 관리한다.

```mermaid
erDiagram
	DATASET_REGISTRY {
		bigint dataset_id PK
		varchar dataset_code
		varchar dataset_name
		varchar domain
		varchar provider
		varchar source_url
		varchar update_cycle
		boolean is_public_data
	}

	DATA_SOURCE {
		bigint data_source_id PK
		bigint dataset_id FK
		varchar source_name
		varchar source_file_name
		varchar source_type
		varchar storage_path
		date base_date
		varchar schema_hash
	}

	DATA_SNAPSHOT {
		bigint data_snapshot_id PK
		bigint data_source_id FK
		varchar snapshot_version
		datetime collected_at
		int row_count
		decimal missing_value_rate
		decimal coverage_rate
		decimal freshness_score
		decimal data_quality_score
		varchar schema_hash
	}

	DATA_VALIDATION_RESULT {
		bigint validation_result_id PK
		bigint data_snapshot_id FK
		varchar validation_status
		int missing_count
		int invalid_count
		int duplicate_count
		text validation_message
	}

	SIMULATION_RUN {
		bigint simulation_run_id PK
		varchar calculation_engine_version
		varchar ai_pipeline_version
		datetime started_at
	}

	SIMULATION_DATA_USAGE {
		bigint usage_id PK
		bigint simulation_run_id FK
		bigint data_snapshot_id FK
		varchar used_for
		varchar used_field_list
		decimal source_weight
	}

	THRESHOLD_RESULT {
		bigint threshold_result_id PK
		bigint scenario_result_id FK
		varchar threshold_status
		decimal calculated_value
	}

	THRESHOLD_DATA_PROVENANCE {
		bigint provenance_id PK
		bigint threshold_result_id FK
		bigint data_snapshot_id FK
		varchar used_field
		text calculation_note
	}

	DATASET_REGISTRY ||--o{ DATA_SOURCE : has
	DATA_SOURCE ||--o{ DATA_SNAPSHOT : snapshots
	DATA_SNAPSHOT ||--o{ DATA_VALIDATION_RESULT : validates
	SIMULATION_RUN ||--o{ SIMULATION_DATA_USAGE : uses
	DATA_SNAPSHOT ||--o{ SIMULATION_DATA_USAGE : referenced_by
	THRESHOLD_RESULT ||--o{ THRESHOLD_DATA_PROVENANCE : based_on
	DATA_SNAPSHOT ||--o{ THRESHOLD_DATA_PROVENANCE : supports
```

## 7.2 화면 연결

- `DataSourcePanel.tsx`는 `DATASET_REGISTRY`, `DATA_SOURCE`, `DATA_SNAPSHOT`을 표시한다.
- `HousingCostCard`, `ChildcareInfraCard`, `PolicyMatchCard`는 `THRESHOLD_DATA_PROVENANCE`를 통해 근거를 표시한다.
- 동일 입력과 동일 스냅샷이면 같은 결과가 나와야 하므로, `SIMULATION_DATA_USAGE`가 재현성의 기준이 된다.
