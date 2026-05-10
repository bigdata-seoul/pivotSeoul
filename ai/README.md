# AI Layer Guide

AI/추천/임계점/RAG 로직은 현재 백엔드 모듈 구조에 통합되어 있습니다.

실제 구현 위치:

- `fastapi/lifePivot_/modules/*`
- `fastapi/lifePivot_/pipelines/*`

즉, 기술 단위 전역 폴더가 아니라 **기능 모듈 내부 기술 흐름**으로 관리합니다.

## Feature ↔ AI Pipeline Mapping

- `pipelines/housing_*`
  - 전처리 -> 피처 생성 -> 임계점 계산 -> 회귀/시계열 -> 결과 조립
- `pipelines/career_*`
  - 텍스트 전처리 -> 특성 생성 -> 유사도 매칭 -> 추천 정렬
- `pipelines/childcare_*`
  - 보육 데이터 정리 -> 정원/시설/접근성 계산 -> 임계점 산출
- `pipelines/policy_*`
  - 조건 매칭 -> 정책 랭킹 -> RAG 근거 검색
- `pipelines/llm_explanation_*`
  - 컨텍스트 생성 -> 프롬프트 생성 -> 가드레일 -> LLM 호출 -> 해설 생성

## Data Inputs for AI

데이터 원본은 아래에 저장되어 파이프라인 입력으로 사용됩니다.

- `fastapi/lifePivot_/data/*` (평탄화 저장)
- 경로 매핑: `fastapi/lifePivot_/data/MIGRATION_MAP.csv`

## Design Intention

AI 로직을 기능별로 묶으면, 이슈 대응 시 이동 범위가 작아집니다.

- "보육 결과 이상" -> `pipelines/childcare_*` 점검
- "정책 근거 품질" -> `pipelines/policy_rag_retriever.py`
- "해설 톤 문제" -> `pipelines/llm_explanation_*`
