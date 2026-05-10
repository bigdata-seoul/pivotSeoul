# AI와 백엔드 역할 구분

Pivot Seoul에서는 **공개 API·인증·영속성은 Spring**, **추론·파이프라인·RAG 등 무거운 AI 처리는 FastAPI(lifePivot_)** 로 나누는 것을 전제로 합니다. 이 레포 안에서 경계는 다음과 같습니다.

## 1. Spring Boot (`back/`) — API·오케스트레이션

- 패키지: **`com.pivotseoul.domain.ai`**
  - HTTP 진입점, 설정, 업스트림(FastAPI/외부 LLM) 호출 클라이언트, 응답 매핑을 둡니다.
  - 예: `AiGatewayController`, `AiGatewayService` (연동 확장 지점)
- DB 엔티티가 AI 전용으로 많지 않으면 `entity`/`repository` 없이 **controller + service** 만 두어도 됩니다.

## 2. FastAPI (`fastapi/lifePivot_/`) — 실제 AI 파이프라인

- **`app/modules/{기능}/`**, **`app/modules/{기능}/pipelines/`**: 기능별 전처리, 임계점, 추천, LLM 해설 등.
- **`data/*`**: 파이프라인 입력 데이터·`MIGRATION_MAP.csv` 등.

## 3. 이 폴더 (`ai/`) — 메타·공유 자료

- 아키텍처 설명, 향후 **공통 프롬프트 템플릿**, **오프라인 평가 스크립트**, 벤더 중립 노트 등을 두기 좋은 위치입니다.
- 런타임 코드의 단일 소스는 아니며, **백엔드 Java 코드는 `back/`**, **파이프라인 코드는 `fastapi/lifePivot_/`** 를 따릅니다.

## Feature ↔ Pipeline (요약)

| 이슈 영역 | 점검 위치 |
|-----------|-----------|
| 주거·임계점 | `lifePivot_/app/modules/housing/pipelines/` |
| 커리어 추천 | `lifePivot_/app/modules/career/pipelines/` |
| 보육 | `lifePivot_/app/modules/childcare/pipelines/` |
| 정책·RAG | `lifePivot_/app/modules/policy/pipelines/` |
| LLM 해설 | `lifePivot_/app/modules/llm_explanation/pipelines/` |
| API 경계·토큰·라우팅 | `back/…/domain/ai`, 향후 RestTemplate/WebClient 등 |

Spring 게이트웨이(`domain/ai`)가 FastAPI로 프록시합니다. 설정은 `back/src/main/resources/application.yml` 의 `pivotseoul.ai.fastapi-base-url`(환경변수 `PIVOT_FASTAPI_BASE_URL`) 과 타임아웃.

**브라우저 호출:** `GET/POST http(s)://{spring}/api/ai/...` 만 사용 → Spring이 `http://{fastapi}/api/v1/...` 로 전달.

| Spring (`/api/ai`) | FastAPI upstream (`/api/v1`) |
|--------------------|------------------------------|
| `POST .../housing/analyze` | `/housing/analyze` |
| `POST .../career/recommend` | `/career/recommend` |
| `POST .../childcare/analyze` | `/childcare/analyze` |
| `POST .../senior/analyze` | `/senior/analyze` |
| `POST .../policy/recommend` | `/policy/recommend` |
| `POST .../simulation/run` | `/simulation/run` |
| `POST .../llm-explanation/generate` | `/llm-explanation/generate` |
| `GET .../data-source/sources` | `/data-source/sources` |
| `POST .../data-source/ingest` | `/data-source/ingest` |

프론트 클라이언트 예시: `front/src/lib/pivot-api.ts` (`NEXT_PUBLIC_API_BASE` 기본 `http://localhost:8080`).
