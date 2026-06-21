# §8 LLM/계산 검증/로그 기능 ERD

## 8.1 목적

계산 엔진과 LLM의 역할을 분리하고, LLM이 숫자·정책명을 임의 생성하지 않았는지 검증한다.

```mermaid
erDiagram
	SIMULATION_RUN {
		bigint simulation_run_id PK
		varchar calculation_engine_version
		varchar ai_pipeline_version
		varchar model_version
		varchar run_status
	}

	SCENARIO_RESULT {
		bigint scenario_result_id PK
		bigint simulation_run_id FK
		decimal total_score
		decimal risk_score
		decimal confidence_score
	}

	THRESHOLD_RESULT {
		bigint threshold_result_id PK
		bigint scenario_result_id FK
		decimal calculated_value
		decimal threshold_value
		text calculation_summary
	}

	RETRIEVED_EVIDENCE {
		bigint evidence_id PK
		bigint scenario_result_id FK
		text evidence_title
		text evidence_text
		varchar source_url
		decimal retrieval_score
	}

	LLM_EXPLANATION_LOG {
		bigint llm_log_id PK
		bigint simulation_run_id FK
		bigint scenario_result_id FK
		varchar llm_provider
		varchar llm_model
		varchar prompt_version
		text input_summary_hash
		text output_text
		boolean contains_generated_number
		boolean policy_name_verified
		decimal hallucination_risk_score
		datetime created_at
	}

	CALCULATION_AUDIT_LOG {
		bigint audit_id PK
		bigint simulation_run_id FK
		varchar calculation_type
		text formula_version
		text input_hash
		text output_hash
		boolean passed_validation
		varchar error_type
		text error_message
	}

	AI_ANOMALY_LOG {
		bigint anomaly_log_id PK
		bigint simulation_run_id FK
		varchar anomaly_type
		text anomaly_message
		decimal severity_score
		datetime created_at
	}

	SIMULATION_RUN ||--o{ SCENARIO_RESULT : produces
	SCENARIO_RESULT ||--o{ THRESHOLD_RESULT : has
	SCENARIO_RESULT ||--o{ RETRIEVED_EVIDENCE : grounds
	SIMULATION_RUN ||--o{ LLM_EXPLANATION_LOG : generates
	SCENARIO_RESULT ||--o{ LLM_EXPLANATION_LOG : explains
	SIMULATION_RUN ||--o{ CALCULATION_AUDIT_LOG : validates
	SIMULATION_RUN ||--o{ AI_ANOMALY_LOG : detects
```

## 8.2 안전 원칙

| 원칙 | 구현 테이블 | 설명 |
| --- | --- | --- |
| 숫자는 계산 엔진만 생성 | `THRESHOLD_RESULT`, `CALCULATION_AUDIT_LOG` | RIR, 자산수명, 시간붕괴 등 수치는 계산 결과만 저장 |
| LLM은 설명만 담당 | `LLM_EXPLANATION_LOG` | 입력은 결과 요약과 근거 chunk만 허용 |
| 근거 없는 정책명 금지 | `RETRIEVED_EVIDENCE`, `policy_name_verified` | 검색된 정책명만 출력하도록 검증 |
| 이상 응답 감지 | `AI_ANOMALY_LOG` | 환각 위험, 숫자 생성, 근거 누락을 기록 |
