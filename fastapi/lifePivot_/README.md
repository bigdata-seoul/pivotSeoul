# Backend Detailed Guide (Domain-First)

## 1) Why this structure

서비스 특성상 단순 CRUD가 아니라 기능별 계산/추천/RAG/LLM이 결합됩니다.
그래서 최상위를 기술(`rag`, `threshold`)이 아니라 기능(`housing`, `career`)으로 분리합니다.

핵심 규칙:

`modules/{feature}_{layer}.py` + `pipelines/{feature}_{step}.py`

## 2) Main Tree (3-depth friendly)

- `main.py`: FastAPI 앱 생성, CORS, v1 라우터 등록
- `api_router.py`: 기능 모듈 라우터 통합
- `modules/*`: 도메인 모듈 파일 (예: `housing_router.py`)
- `pipelines/*`: 기술 단계 파일 (예: `housing_preprocessing.py`)

모듈 목록:

- `housing`
- `career`
- `childcare`
- `senior`
- `policy`
- `simulation`
- `llm_explanation`
- `data_source`

## 3) Module Internal Contract

각 기능은 동일한 파일 계약을 따릅니다:

- `modules/{feature}_router.py`: HTTP endpoint
- `modules/{feature}_service.py`: 유스케이스 실행
- `modules/{feature}_repository.py`: 데이터 접근 계층
- `modules/{feature}_model.py`: 내부 도메인 모델
- `modules/{feature}_schema.py`: API 입출력 모델
- `pipelines/{feature}_*.py`: 해당 기능 내부 기술 단계

## 4) Data Source Layout

- 데이터는 `data/*` 아래 평탄화 저장
- 원본 경로 매핑은 `data/MIGRATION_MAP.csv`에서 확인

## 5) Practical Maintenance

- "보육 임계점 이상" 이슈 -> `pipelines/childcare_*`만 확인
- "정책 근거 추천" 수정 -> `pipelines/policy_rag_retriever.py`
- "LLM 해설 톤/가드" 수정 -> `pipelines/llm_explanation_*`

기능별 관심사를 한 폴더에 고정해, 수정 범위를 빠르게 좁히는 것이 목적입니다.
