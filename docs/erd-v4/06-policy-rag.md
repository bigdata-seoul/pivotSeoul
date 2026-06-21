# §6 정책/RAG 기능 ERD

## 6.1 목적

정책 데이터와 사용자 조건을 연결하고, RAG 검색 근거를 추천 후보와 LLM 해설에 전달한다.

```mermaid
erDiagram
	SCENARIO_RESULT {
		bigint scenario_result_id PK
		bigint scenario_id FK
		decimal policy_score
		decimal total_score
		decimal confidence_score
	}

	RECOMMENDATION_CANDIDATE {
		bigint candidate_id PK
		bigint scenario_result_id FK
		varchar candidate_type "POLICY/EDUCATION/FACILITY"
		varchar candidate_title
		varchar district_name
		decimal fit_score
		decimal confidence_score
		text reason
		varchar source_link
	}

	RETRIEVED_EVIDENCE {
		bigint evidence_id PK
		bigint scenario_result_id FK
		bigint data_snapshot_id FK
		varchar evidence_type "POLICY/EDUCATION/DATA_SOURCE"
		text evidence_title
		text evidence_text
		varchar source_url
		decimal retrieval_score
		int rank_order
	}

	WEEKLY_ACTION {
		bigint weekly_action_id PK
		bigint scenario_result_id FK
		varchar action_type "POLICY/APPLY/CHECK"
		varchar action_title
		text action_description
		int priority_order
		bigint service_link_id FK
	}

	EXTERNAL_SERVICE_LINK {
		bigint service_link_id PK
		varchar link_type "POLICY/EDU/HOUSING"
		varchar title
		varchar url
		varchar provider
	}

	DATASET_REGISTRY {
		bigint dataset_id PK
		varchar domain "POLICY/CAREER/CHILDCARE"
		varchar dataset_name
		varchar source_url
	}

	DATA_SNAPSHOT {
		bigint data_snapshot_id PK
		bigint data_source_id FK
		varchar snapshot_version
		datetime collected_at
	}

	LLM_EXPLANATION_LOG {
		bigint llm_log_id PK
		bigint scenario_result_id FK
		text input_summary_hash
		text output_text
		boolean policy_name_verified
		boolean contains_generated_number
	}

	SCENARIO_RESULT ||--o{ RECOMMENDATION_CANDIDATE : recommends
	SCENARIO_RESULT ||--o{ RETRIEVED_EVIDENCE : retrieves
	SCENARIO_RESULT ||--o{ WEEKLY_ACTION : creates
	SCENARIO_RESULT ||--o{ LLM_EXPLANATION_LOG : explains
	EXTERNAL_SERVICE_LINK ||--o{ WEEKLY_ACTION : connects
	DATASET_REGISTRY ||--o{ DATA_SNAPSHOT : versioned_as
	DATA_SNAPSHOT ||--o{ RETRIEVED_EVIDENCE : source_of
	RETRIEVED_EVIDENCE ||--o{ RECOMMENDATION_CANDIDATE : grounds
```

## 6.2 RAG 역할 분리

| 구분 | 역할 | 저장 위치 |
| --- | --- | --- |
| RAG | 정책·교육·시설 근거 chunk 검색 | `RETRIEVED_EVIDENCE` |
| 추천 엔진 | 후보명, 적합도, 추천 이유 산출 | `RECOMMENDATION_CANDIDATE` |
| LLM | 계산 결과와 근거를 쉬운 문장으로 설명 | `LLM_EXPLANATION_LOG` |
| 실행 액션 | 이번 주 할 일과 신청 링크 연결 | `WEEKLY_ACTION`, `EXTERNAL_SERVICE_LINK` |
