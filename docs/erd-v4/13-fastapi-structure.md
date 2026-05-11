# §15 AI FastAPI 상세 구조

## §15.1 왜 이 구조인가

AI 서비스는 기능별 계산, 추천, RAG, LLM이 결합된다. 따라서 최상위를 기술 단위인 `rag`, `threshold`, `calculator`로 쪼개기보다 기능 단위인 `housing`, `career`, `childcare`, `senior`, `policy`로 고정하는 것이 좋다.

다만 3-depth를 넘기지 않기 위해 기능별 폴더를 깊게 만들지 않고, 파일명을 기능 prefix로 통일한다.

```text
modules/{feature}_{layer}.py
pipelines/{feature}_{step}.py
```

## §15.2 AI Main Tree

FastAPI는 별도 운영 DB를 소유하지 않는 **stateless AI 계산 서버**로 둔다. 따라서 기능 모듈에는 `repository` 계층을 기본으로 두지 않는다. API DTO는 `schema.py`, 유스케이스 실행은 `service.py`, 실제 계산 단계는 `pipelines/*`에 둔다.

```text
ai/
├─ main.py
├─ api_router.py
│
├─ modules/
│  ├─ housing_router.py
│  ├─ housing_service.py
│  ├─ housing_schema.py
│  │
│  ├─ career_router.py
│  ├─ career_service.py
│  ├─ career_schema.py
│  │
│  ├─ childcare_router.py
│  ├─ childcare_service.py
│  ├─ childcare_schema.py
│  │
│  ├─ senior_router.py
│  ├─ senior_service.py
│  ├─ senior_schema.py
│  │
│  ├─ policy_router.py
│  ├─ policy_service.py
│  ├─ policy_schema.py
│  │
│  ├─ simulation_router.py
│  ├─ simulation_service.py
│  ├─ simulation_schema.py
│  │
│  ├─ llm_explanation_router.py
│  ├─ llm_explanation_service.py
│  ├─ llm_explanation_schema.py
│  │
│  ├─ data_source_router.py
│  ├─ data_source_service.py
│  └─ data_source_schema.py
│
├─ pipelines/
│  ├─ housing_preprocessing.py
│  ├─ housing_feature_engineering.py
│  ├─ housing_threshold_calculator.py
│  ├─ housing_regression_model.py
│  ├─ housing_timeseries_model.py
│  ├─ housing_result_builder.py
│  │
│  ├─ career_text_feature_builder.py
│  ├─ career_cosine_matcher.py
│  ├─ career_sentence_bert_matcher.py
│  ├─ career_recommendation_ranker.py
│  ├─ career_result_builder.py
│  │
│  ├─ childcare_preprocessing.py
│  ├─ childcare_capacity_calculator.py
│  ├─ childcare_facility_matcher.py
│  ├─ childcare_gis_access_analyzer.py
│  ├─ childcare_threshold.py
│  ├─ childcare_result_builder.py
│  │
│  ├─ senior_asset_life_calculator.py
│  ├─ senior_welfare_facility_matcher.py
│  ├─ senior_gnn_connectivity.py
│  ├─ senior_threshold.py
│  ├─ senior_result_builder.py
│  │
│  ├─ policy_condition_matcher.py
│  ├─ policy_ranker.py
│  ├─ policy_rag_retriever.py
│  ├─ policy_result_builder.py
│  │
│  ├─ simulation_flow.py
│  ├─ simulation_score_aggregator.py
│  ├─ simulation_compare_builder.py
│  │
│  ├─ llm_explanation_context_builder.py
│  ├─ llm_explanation_prompt_builder.py
│  ├─ llm_explanation_guardrails.py
│  ├─ llm_explanation_generator.py
│  │
│  ├─ data_source_csv_loader.py
│  ├─ data_source_open_data_importer.py
│  ├─ data_source_common_preprocessor.py
│  ├─ data_source_version_manager.py
│  └─ data_source_snapshot_reader.py
│
├─ data/
│  ├─ MIGRATION_MAP.csv
│  ├─ housing_raw.csv
│  ├─ housing_features.parquet
│  ├─ career_features.parquet
│  ├─ childcare_features.parquet
│  ├─ senior_features.parquet
│  ├─ policy_chunks.parquet
│  └─ rag_documents.parquet
│
├─ artifacts/
│  ├─ rent_regression_model.pkl
│  ├─ supply_timeseries_model.pkl
│  ├─ sentence_bert_model
│  ├─ kobert_model
│  └─ vector_index
│
├─ tests/
└─ requirements.txt
```

FastAPI의 `data/`와 `artifacts/`는 운영 DB가 아니라 계산에 필요한 입력 파일과 모델 산출물이다. 세션, 결과, 추천, 근거, 로그 저장은 Spring Backend DB에서 처리한다.

## §15.3 Module Internal Contract

각 기능은 동일한 파일 계약을 따른다.

| 파일 패턴 | 역할 | 예시 |
| --- | --- | --- |
| `modules/{feature}_router.py` | HTTP endpoint | `modules/housing_router.py` |
| `modules/{feature}_service.py` | 유스케이스 실행과 pipeline orchestration | `modules/housing_service.py` |
| `modules/{feature}_schema.py` | Spring과 주고받는 Request/Response DTO | `modules/housing_schema.py` |
| `pipelines/{feature}_*.py` | 해당 기능 내부 기술 단계 | `pipelines/housing_threshold_calculator.py` |
| `data/*` | 읽기 중심 데이터 파일과 Feature 파일 | `data/housing_features.parquet` |
| `artifacts/*` | 모델 파일, 임베딩, 벡터 인덱스 | `artifacts/vector_index` |

`repository.py`와 `model.py`는 기본 구조에서 제외한다. FastAPI가 자체 DB를 소유하거나 장기 저장소를 직접 조회해야 하는 요구가 생길 때만 추가한다.

## §15.4 Data Source Layout

데이터는 `data/*` 아래 평탄화해서 저장한다. 원본 경로와 가공 경로의 매핑은 `data/MIGRATION_MAP.csv`에서 관리한다.

```text
data/
├─ MIGRATION_MAP.csv
├─ housing_raw.csv
├─ housing_features.parquet
├─ career_features.parquet
├─ childcare_features.parquet
├─ senior_features.parquet
├─ policy_chunks.parquet
└─ rag_documents.parquet
```

## §15.5 Practical Maintenance

| 이슈 | 확인 위치 |
| --- | --- |
| 보육 임계점 이상 | `pipelines/childcare_*` |
| 정책 근거 추천 수정 | `pipelines/policy_rag_retriever.py` |
| LLM 해설 톤/가드 수정 | `pipelines/llm_explanation_*` |
| 주거 RIR 계산 오류 | `pipelines/housing_threshold_calculator.py` |
| 커리어 추천 점수 이상 | `pipelines/career_recommendation_ranker.py` |

이 구조의 목적은 기능별 관심사를 파일명에 고정해 수정 범위를 빠르게 좁히는 것이다. 기능별로 분리하되 3-depth를 유지해야 하므로, `modules/housing/service.py` 같은 깊은 폴더 구조 대신 `modules/housing_service.py` 형식을 사용한다.

[← 목차로](./README.md)
