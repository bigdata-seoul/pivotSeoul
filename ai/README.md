# AI·데이터 파이프라인 구조 (통합 문서 대응)

구현 코드는 **`fastapi/lifepivot/`** 아래에 둡니다. 운영 API는 **`fastapi/`**의 FastAPI 앱이 이 패키지를 import합니다.

## 폴더 ↔ 문서 단계

| 문서 단계 | 디렉터리 |
|-----------|----------|
| 윤서 — 원천 데이터 | `lifepivot/data_sources/` |
| 사랑 — 전처리 | `lifepivot/preprocessing/` |
| Feature 생성 | `lifepivot/features/` |
| 임계점 계산 | `lifepivot/threshold/` |
| 추천 후보 | `lifepivot/recommendation/` |
| RAG | `lifepivot/rag/` |
| LLM | `lifepivot/llm/` |
| 오케스트레이션 | `lifepivot/pipeline/` |
| 최종 테이블 스키마 (Pydantic) | `lifepivot/schemas/` |

## API (스텁)

- `GET /api/v1/meta/stages` — 파이프라인 단계 목록
- `GET /api/v1/meta/data-sources` — OA 코드 등 원천 레지스트리
- `POST /api/v1/pipeline/run` — 입력 기준 통합 스텁 실행

선우 레이어(화면)는 `front/` React 앱에서 소비합니다.
