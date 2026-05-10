# Backend Detailed Guide (Domain-First)

## 1) Why this structure

서비스가 단순 CRUD가 아니라 기능별로 계산·추천·RAG·LLM이 섞이므로, **상위 폴더는 기능(`housing`, `career`, …)으로 묶고**, 그 안에서 **전처리 → Feature → 모델/임계점 → 결과** 같은 기술 흐름은 `pipelines/`에 둔다.

핵심 규칙:

```
app/modules/{기능}/router.py | service.py | repository.py | model.py | schema.py
app/modules/{기능}/pipelines/*.py
```

## 2) Entry points

- `fastapi/main.py` — 배포 시 `uvicorn main:app` (WORKDIR가 `fastapi`일 때)
- `lifePivot_/main.py` — 레거시 호환 (`lifePivot_.main:app`)
- `lifePivot_/app/main.py` — 실제 FastAPI 앱·미들웨어·`/health`
- `lifePivot_/app/api/v1/router.py` — 기능 라우터 등록

## 3) Feature modules

| 폴더 | 역할 |
|------|------|
| `housing/` | 주거 RIR·임계점 등 |
| `career/` | 직무·교육 유사도·추천 |
| `childcare/` | 보육 공급·GIS·복직 임계점 |
| `senior/` | 노후 자산수명·시설 매칭 |
| `policy/` | 조건 매칭·RAG·정책 순위 |
| `simulation/` | 기능 결과 오케스트레이션 (`flow.py`) |
| `llm_explanation/` | 해설·가드레일·LLM 클라이언트 |
| `data_source/` | CSV·스냅샷·버전 관리 |

## 4) `pipelines/` 파일 예 (기능별로 이름만 다름)

- `preprocessing.py`, `threshold_calculator.py`, `result_builder.py`, …

## 5) 유지보수 힌트

- 보육 로직 → `childcare/pipelines/` 만 보면 됨
- 정책 RAG → `policy/pipelines/rag_retriever.py`
- LLM 톤/가드 → `llm_explanation/pipelines/`

## 6) Data

- 원천 데이터: `data/` (평탄화)
- 매핑: `data/MIGRATION_MAP.csv`

## 7) Placeholders

- `app/core/`, `app/common/` — 설정·공통 유틸 확장용 (현재 비어 있음)

## 8) Spring 게이트웨이와의 연결

브라우저는 FastAPI 포트를 직접 호출하지 않습니다. **Spring** `domain/ai` (`/api/ai/*`) 가 같은 기능 경로를 **`/api/v1/*`** 로 프록시합니다. 베이스 URL은 Spring 쪽 `pivotseoul.ai.fastapi-base-url` 참고.
