# §16 Front → Backend → AI 전체 흐름도

## §16.1 전체 아키텍처 그림

아래 그림은 사용자가 Frontend에서 입력한 뒤, Backend가 검증·저장·오케스트레이션을 수행하고, AI가 계산·추천·RAG·LLM 해설을 만든 뒤 다시 Backend를 통해 결과 화면으로 돌아오는 전체 흐름이다.

```mermaid
flowchart LR
	U["User<br>생애단계 선택 / 조건 입력"] --> FE["Frontend<br>React / Next.js"]
	FE --> FC["Frontend Components<br>OnboardingForm / ScenarioBuilder / ResultCards"]
	FC --> BCTRL["Backend Controller<br>Spring Boot API"]

	BCTRL --> BVAL["Backend Validation<br>필수값 검증 / 구간화 / 비식별화"]
	BVAL --> BDB1["Backend DB 저장<br>SimulationSession / Scenario / ScenarioVariable"]
	BVAL --> AIGW["domain/ai<br>AiGatewayController / AiGatewayService"]

	AIGW --> AIAPI["AI FastAPI<br>main.py / api_router.py"]

	AIAPI --> DSM["data_source module<br>스냅샷 / Feature / parquet 로딩"]
	AIAPI --> HP["housing pipeline<br>RIR / 주거비 부담"]
	AIAPI --> CP["career pipeline<br>직무-교육 유사도"]
	AIAPI --> CHP["childcare pipeline<br>보육 접근성 / 복직 순이익"]
	AIAPI --> SP["senior pipeline<br>자산수명 / 복지시설"]
	AIAPI --> PP["policy pipeline<br>정책 조건 매칭 / RAG"]
	AIAPI --> LP["llm_explanation pipeline<br>결과 해설 / Guardrail"]

	DSM --> DATA["Data / Artifacts<br>MIGRATION_MAP.csv / parquet / model / vector_index"]
	HP --> AIOUT["AI Response DTO<br>Calculation / Recommendation / Evidence / Explanation"]
	CP --> AIOUT
	CHP --> AIOUT
	SP --> AIOUT
	PP --> AIOUT
	LP --> AIOUT

	AIOUT --> AIGW
	AIGW --> BVERIFY["Backend Verification<br>계산값 검증 / 정책명 검증 / 정규화"]
	BVERIFY --> BDB2["Backend DB 저장<br>SimulationResult / ThresholdResult / RecommendationCandidate / LLMExplanationLog / CalculationLog"]
	BDB2 --> RAPI["Backend Result API<br>결과 조회 응답"]
	RAPI --> FE
	FE --> UI["Result UI<br>점수 / Red Zone / 추천 / 근거 / 이번 주 액션"]
```

## §16.2 요청-응답 시퀀스 그림

```mermaid
sequenceDiagram
	participant U as User
	participant FE as Frontend
	participant BE as Spring Backend
	participant DB as Operational DB
	participant AI as AI FastAPI
	participant RAG as RAG / Vector Index
	participant LLM as LLM

	U->>FE: 생애단계·지역·가구 조건 입력
	FE->>BE: POST /api/simulation/sessions
	BE->>BE: 입력 검증·구간화·비식별화
	BE->>DB: SimulationSession / Scenario 저장
	FE->>BE: POST /api/simulation/runs
	BE->>AI: 비식별 Scenario DTO 전달
	AI->>AI: data_source feature 로딩
	AI->>AI: housing / career / childcare / senior 계산
	AI->>RAG: policy evidence 검색
	RAG-->>AI: Retrieved Evidence 반환
	AI->>LLM: 계산 결과 + 근거 기반 해설 요청
	LLM-->>AI: Explanation + Guardrail 결과 반환
	AI-->>BE: AI Response DTO 반환
	BE->>BE: 계산값·추천·LLM 출력 검증
	BE->>DB: SimulationResult / ThresholdResult 저장
	BE->>DB: RecommendationCandidate / WeeklyAction 저장
	BE->>DB: CalculationLog / LLMExplanationLog / AiAnomalyLog 저장
	BE-->>FE: GET /api/simulation/results 응답
	FE-->>U: 결과 카드 / 비교 그래프 / 추천 액션 표시
```

## §16.3 단계별 책임 정리

| 단계 | 담당 | 주요 처리 | 저장/산출물 |
| --- | --- | --- | --- |
| 1. 입력 | Frontend | 생애단계, 지역, 가구 조건, 목표 직무, 자녀 여부 등 입력 | Request DTO |
| 2. 검증 | Backend | 필수값 검증, 값 범위 검증, 원본 입력 구간화, 비식별화 | `SimulationSession`, `Scenario`, `ScenarioVariable` |
| 3. AI 호출 | Backend `domain/ai` | FastAPI AI 서버로 비식별 Scenario DTO 전달 | AI Request DTO |
| 4. 데이터 로딩 | AI `data_source` | 스냅샷, Feature, parquet, vector index 로딩 | `FeatureSet`, `MIGRATION_MAP.csv` |
| 5. 기능별 계산 | AI pipelines | 주거·커리어·보육·노년·정책 pipeline 실행 | `AI_CALCULATION_RESULT`, `AI_RECOMMENDATION_RESULT` |
| 6. RAG 검색 | AI `policy` | 정책·교육·시설 근거 chunk 검색 | `RAG_RETRIEVAL_RESULT` |
| 7. LLM 해설 | AI `llm_explanation` | 계산 결과와 근거 기반 해설 생성, 환각 방지 검사 | `LLM_EXPLANATION_RESULT` |
| 8. 결과 검증 | Backend | AI 결과 DTO 검증, 숫자/정책명/근거 정합성 확인 | `CalculationLog`, `AiAnomalyLog` |
| 9. 결과 저장 | Backend DB | 검증 완료 결과, 추천, 근거, 해설, 로그 저장 | `SimulationResult`, `ThresholdResult`, `RecommendationCandidate`, `LLMExplanationLog` |
| 10. 화면 출력 | Frontend | 결과 카드, Red Zone, A/B 비교, 추천 액션, 근거 패널 렌더링 | Result UI |

## §16.4 핵심 원칙

1. Frontend는 입력과 결과 표시를 담당한다.
2. Backend는 운영 DB의 단일 진실 공급원이다.
3. FastAPI는 MVP 단계에서 별도 AI DB를 소유하지 않는다.
4. AI는 계산·추천·RAG·LLM을 수행하지만 운영 DB에 직접 쓰지 않는다.
5. AI 결과는 반드시 Backend 검증을 거친 뒤 Spring DB에 저장한다.
6. LLM은 숫자를 새로 만들지 않고, 계산 결과와 검색 근거를 설명만 한다.
7. 사용자가 보는 결과는 AI 원본 응답이 아니라 Backend가 검증·정규화·저장한 결과다.
8. 별도 AI DB 또는 Vector DB는 실험 로그, 모델 평가, 온라인 RAG 문서 관리, 비동기 배치 상태 관리가 실제 요구사항이 될 때 도입한다.

[← 목차로](./README.md)
