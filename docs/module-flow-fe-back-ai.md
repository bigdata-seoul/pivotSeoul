# 모듈별 연결: Front → Spring → FastAPI

리팩터링 시 “어느 레이어가 무엇을 호출해야 하는지” 기준으로 쓰는 맵이다.  
**현재 상태**는 코드 검색 기준이며, 비어 있으면 **아직 미연결**이다.

---

## 1. 두 갈래 구조 (먼저 구분)

| 축 | 역할 | Spring 베이스 | 비고 |
|----|------|----------------|------|
| **AI 계산·파이프라인** | 주거/커리어 등 **추론·RAG·점수** | `/api/ai/*` → FastAPI `/api/v1/*` | 게이트웨이: `domain/ai` |
| **운영·영속** | 세션·시나리오·결과 **DB** | `/api/simulation/*`, `/api/user/*`, `/api/data/*` … | 도메인 컨트롤러·Flyway 스키마 |

설계상 **화면에 보이는 최종 결과**는 나중에 “AI JSON → Spring 검증·저장 → 조회 API”로 합치면 된다. 지금은 **게이트웨이(AI)** 와 **시뮬레이션 API(스텁)** 가 **분리**되어 있다.

---

## 2. 기능 모듈별 매핑 (AI 파이프라인)

아래는 **`Front → Spring(/api/ai) → FastAPI(/api/v1)`** 한 줄기만 표시한다.

| 기능 | Front (`front/src/lib/pivot-api.ts`) | Spring (`back` … `AiGatewayController`) | FastAPI 패키지 · 라우터 |
|------|--------------------------------------|-------------------------------------------|-------------------------|
| **주거** | `housingAnalyze()` | `POST /api/ai/housing/analyze` | `lifePivot_/app/modules/housing/` · `router.py` → `POST …/housing/analyze` |
| **커리어** | `careerRecommend()` | `POST /api/ai/career/recommend` | `…/career/` · `POST …/career/recommend` |
| **보육** | `childcareAnalyze()` | `POST /api/ai/childcare/analyze` | `…/childcare/` · `POST …/childcare/analyze` |
| **노년** | `seniorAnalyze()` | `POST /api/ai/senior/analyze` | `…/senior/` · `POST …/senior/analyze` |
| **정책/RAG** | `policyRecommend()` | `POST /api/ai/policy/recommend` | `…/policy/` · `POST …/policy/recommend` |
| **시뮬레이션 집계** | `simulationRun()` | `POST /api/ai/simulation/run` | `…/simulation/` · `POST …/simulation/run` |
| **LLM 해설** | `llmExplanationGenerate()` | `POST /api/ai/llm-explanation/generate` | `…/llm_explanation/` · `POST …/llm-explanation/generate` |
| **데이터 소스** | `dataSourceSources()`, `dataSourceIngest()` | `GET/POST /api/ai/data-source/sources|ingest` | `…/data_source/` · `GET …/data-source/sources`, `POST …/ingest` |
| **게이트웨이 상태** | `getAiGatewayStatus()` | `GET /api/ai/status` | (Spring만, FastAPI `/health`는 서버에서 호출) |

**Spring 구현 파일**

- `com.pivotseoul.domain.ai.controller.AiGatewayController`
- `com.pivotseoul.domain.ai.service.AiGatewayService` → `pivotseoul.ai.fastapi-base-url` 로 업스트림 조합

**FastAPI 진입**

- `lifePivot_/app/main.py` → `lifePivot_/app/api/v1/router.py` 에 기능 라우터 등록

---

## 3. Front에서의 실사용 (리팩터링 포인트)

| 상태 | 설명 |
|------|------|
| **라이브러리만 존재** | `front/src/lib/pivot-api.ts` — **페이지·컨텍스트에서 아직 import 하는 곳은 거의 없음** |
| **로컬 전용 로직** | `PivotContext.tsx` 의 `calculateRisk` 등 — **브라우저 안 계산**, 백/AI 미호출 |

리팩터링 시 권장:

1. 화면별로 `pivot-api`의 해당 함수만 호출 (예: 주거 카드 → `housingAnalyze`).
2. 이후 단계에서 Spring `domain/simulation` 저장 API와 묶을 때, **입력 DTO·세션 ID**를 일치시키기.

---

## 4. Spring `domain/simulation` (운영 API — AI와 별도)

| Spring 베이스 | 용도 (의도) | 현재 코드 |
|---------------|-------------|-----------|
| `/api/simulation/*` | 세션·시나리오·run·결과·임계점 등 | 컨트롤러 클래스는 있으나 **대부분 빈 스텁** |
| `/api/user/*` | 생애단계·자치구 마스터 | 스텁 수준 |
| `/api/data/*` | 데이터셋 레지스트리(운영 DB) | 스텁 수준 |

**리팩터링 시**: “실행 한 번” 플로우를 `POST /api/simulation/...` 로 받은 뒌 **내부에서** `AiGatewayService` 를 호출해 FastAPI 결과를 받고 **검증 후 DB 저장**하는 식으로 합치면 ERD와 맞는다.

---

## 5. 설정 한 줄 정리

| 환경변수 | 의미 |
|-----------|------|
| `NEXT_PUBLIC_API_BASE` | 프론트가 부를 **Spring** 오리진 (기본 `http://localhost:8080`) |
| `PIVOT_FASTAPI_BASE_URL` | Spring이 부를 **FastAPI** 오리진 (기본 `http://127.0.0.1:8000`) |

---

## 6. 폴더 대응 (빠른 탐색)

| 기능 | FastAPI 코드 루트 |
|------|-------------------|
| 주거 | `fastapi/lifePivot_/app/modules/housing/` + `pipelines/` |
| 커리어 | `…/career/` |
| 보육 | `…/childcare/` |
| 노년 | `…/senior/` |
| 정책 | `…/policy/` |
| 시뮬레이션 오케스트레이션 | `…/simulation/` (`flow.py` 등) |
| LLM | `…/llm_explanation/` |
| 데이터 파일 입력 | `fastapi/lifePivot_/data/` (+ `MIGRATION_MAP.csv`) |

Spring 영속·ERD는 `back/src/main/resources/db/migration/` 및 `domain/simulation`, `domain/data` 엔티티와 대응한다.
