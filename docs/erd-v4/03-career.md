# §3 커리어 기능 ERD

## 3.1 목적

목표 직무, 학습 가능 시간, 교육/일자리 추천, 커리어 임계점, 이번 주 학습 액션을 연결한다.

```mermaid
erDiagram
	SCENARIO_INPUT_SUMMARY {
		bigint input_summary_id PK
		bigint scenario_id FK
		varchar target_job_group
		varchar skill_level
		int weekly_learning_hours
		varchar commute_time_band
	}

	SCENARIO_RESULT {
		bigint scenario_result_id PK
		bigint scenario_id FK
		decimal career_score
		decimal time_loss_score
		decimal opportunity_index
	}

	THRESHOLD_TYPE {
		bigint threshold_type_id PK
		varchar threshold_code "CAREER"
		varchar threshold_name
		text formula_version
	}

	THRESHOLD_RESULT {
		bigint threshold_result_id PK
		bigint scenario_result_id FK
		bigint threshold_type_id FK
		varchar threshold_status
		decimal calculated_value "available_learning_hours"
		decimal threshold_value
		boolean is_red_zone
	}

	RECOMMENDATION_CANDIDATE {
		bigint candidate_id PK
		bigint scenario_result_id FK
		varchar candidate_type "EDUCATION/JOB"
		varchar candidate_title
		decimal fit_score
		decimal confidence_score
		text reason
		varchar source_link
	}

	RETRIEVED_EVIDENCE {
		bigint evidence_id PK
		bigint scenario_result_id FK
		bigint data_snapshot_id FK
		varchar evidence_type "EDUCATION/DATA_SOURCE"
		text evidence_title
		text evidence_text
		decimal retrieval_score
		int rank_order
	}

	WEEKLY_ACTION {
		bigint weekly_action_id PK
		bigint scenario_result_id FK
		varchar action_type "EDUCATION"
		varchar action_title
		text action_description
		int priority_order
		bigint service_link_id FK
	}

	MODEL_REGISTRY {
		bigint model_id PK
		varchar model_type "EMBEDDING"
		varchar model_name "Sentence-BERT/KoBERT"
		varchar model_version
		varchar target_domain "CAREER"
	}

	SCENARIO_INPUT_SUMMARY ||--o{ SCENARIO_RESULT : informs
	SCENARIO_RESULT ||--o{ THRESHOLD_RESULT : has_career_threshold
	THRESHOLD_TYPE ||--o{ THRESHOLD_RESULT : defines
	SCENARIO_RESULT ||--o{ RECOMMENDATION_CANDIDATE : recommends_courses
	SCENARIO_RESULT ||--o{ RETRIEVED_EVIDENCE : grounds
	SCENARIO_RESULT ||--o{ WEEKLY_ACTION : creates
	MODEL_REGISTRY ||--o{ RECOMMENDATION_CANDIDATE : scores
```

## 3.2 커리어 기능 계산 흐름

```
target_job_group + skill_level + weekly_learning_hours
→ 교육/채용 텍스트 임베딩
→ Cosine Similarity / Sentence-BERT / KoBERT
→ 추천 교육·일자리 후보
→ 커리어 임계점 판정
→ 이번 주 학습 액션 생성
```
