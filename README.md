# Pivot Seoul AI / FastAPI

Pivot Seoul의 AI 파이프라인과 FastAPI 추론 서버를 분리한 포트폴리오 브랜치입니다.

## Portfolio Focus

- 주거, 커리어, 보육, 시니어, 정책 추천을 기능 도메인별 파이프라인으로 분리
- FastAPI가 계산/추천/RAG/LLM 해설을 담당하고 Spring Boot는 API 게이트웨이로 연동
- 원천 데이터 수집, 전처리, 버전 관리, 결과 생성 흐름을 모듈별로 명확히 구분
- 포트폴리오 검토자가 AI 파트만 볼 수 있도록 `fastapi/`, `ai/`, `docs/` 중심으로 정리

## Tech Stack

- Python
- FastAPI
- Uvicorn
- Pydantic
- Pandas / NumPy 계열 데이터 처리
- RAG/LLM 설명 생성 파이프라인

## Run

```bash
cd fastapi
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Docker 실행:

```bash
cd fastapi
docker compose up --build
```

헬스 체크:

```bash
curl http://localhost:8000/health
```

## Structure

```text
.
├─ fastapi/
│  ├─ main.py                         # uvicorn 진입점
│  ├─ requirements.txt
│  ├─ Dockerfile
│  ├─ docker-compose.yml
│  └─ lifePivot_/
│     ├─ app/main.py                  # FastAPI 앱 생성
│     ├─ app/api/v1/router.py         # v1 라우터 조합
│     ├─ app/modules/
│     │  ├─ housing/                  # 주거 비용, 임계점
│     │  ├─ career/                   # 커리어 추천
│     │  ├─ childcare/                # 보육 접근성
│     │  ├─ senior/                   # 시니어 자산/시설 추천
│     │  ├─ policy/                   # 정책 추천과 RAG
│     │  ├─ simulation/               # 기능 결과 오케스트레이션
│     │  ├─ llm_explanation/          # LLM 해설 생성
│     │  └─ data_source/              # 데이터 출처/버전 관리
│     └─ data/                        # 원천/매핑 데이터 위치
├─ ai/
│  └─ README.md                       # Spring/FastAPI/AI 역할 경계
└─ docs/
   ├─ module-flow-fe-back-ai.md       # 전체 연동 흐름
   └─ erd-v4/                         # 기능별 데이터 설계 메모
```

## API Modules

| Module | Endpoint area | Responsibility |
|--------|---------------|----------------|
| `housing` | `/api/v1/housing` | 주거비, RIR, 임계점 분석 |
| `career` | `/api/v1/career` | 직무/교육 추천 |
| `childcare` | `/api/v1/childcare` | 보육 시설 접근성과 복직 리스크 |
| `senior` | `/api/v1/senior` | 노후 자산수명, 시설 매칭 |
| `policy` | `/api/v1/policy` | 정책 조건 매칭, RAG 기반 추천 |
| `simulation` | `/api/v1/simulation` | 사용자 조건 기반 통합 실행 |
| `llm_explanation` | `/api/v1/llm-explanation` | 결과 해설 문장 생성 |
| `data_source` | `/api/v1/data-source` | 데이터 출처, 수집, 버전 관리 |

## Pipeline Rule

각 기능은 HTTP 계약과 내부 계산 파이프라인을 같은 모듈 안에서 관리합니다.

```text
app/modules/{feature}/
├─ router.py
├─ schema.py
├─ service.py
├─ repository.py
├─ model.py
└─ pipelines/
   ├─ preprocessing.py
   ├─ *_calculator.py
   ├─ *_ranker.py
   └─ result_builder.py
```

## Integration Boundary

브라우저는 FastAPI를 직접 호출하지 않고 Spring Boot API를 호출합니다.

```text
Frontend -> Spring Boot /api/ai/* -> FastAPI /api/v1/*
```

이 브랜치는 FastAPI와 AI 로직만 보여주기 위한 분리 브랜치입니다. Spring 게이트웨이 코드는 `back` 브랜치에서 확인합니다.
