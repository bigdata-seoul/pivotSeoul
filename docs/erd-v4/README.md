# 기능별 ERD v4 — 목차

전체 통합 ERD를 PRD 주요 기능 단위로 나눈 문서 모음이다. 기준 기능은 **시뮬레이션 공통, 주거, 커리어, 보육/복직, 노년, 정책/RAG, 데이터 출처, LLM/로그**이다.

---

## 0. 기능별 분리 기준

| 기능 영역 | 핵심 질문 | 중심 테이블 |
| --- | --- | --- |
| 공통 시뮬레이션 | 사용자 1회 실행과 A/B 시나리오를 어떻게 저장하는가? | `SIMULATION_SESSION`, `SCENARIO`, `SIMULATION_RUN`, `SCENARIO_RESULT` |
| 주거 기능 | 주거비와 주거 지속 가능성을 어떻게 계산하는가? | `THRESHOLD_RESULT`, `DATA_SNAPSHOT`, `RECOVERY_LEVER` |
| 커리어 기능 | 목표 직무와 교육/일자리 추천을 어떻게 연결하는가? | `RECOMMENDATION_CANDIDATE`, `RETRIEVED_EVIDENCE`, `WEEKLY_ACTION` |
| 보육/복직 기능 | 돌봄 인프라와 복직 임계점을 어떻게 계산하는가? | `THRESHOLD_RESULT`, `RECOMMENDATION_CANDIDATE`, `RECOVERY_LEVER` |
| 노년 기능 | 노후 자산수명과 시설 접근성을 어떻게 계산하는가? | `THRESHOLD_RESULT`, `RECOMMENDATION_CANDIDATE`, `EXTERNAL_SERVICE_LINK` |
| 정책/RAG 기능 | 정책 추천 근거와 신청 액션을 어떻게 연결하는가? | `RETRIEVED_EVIDENCE`, `RECOMMENDATION_CANDIDATE`, `WEEKLY_ACTION` |
| 데이터 출처 기능 | 결과 카드마다 데이터셋·기준일·사용 필드를 어떻게 남기는가? | `DATASET_REGISTRY`, `DATA_SOURCE`, `DATA_SNAPSHOT`, `THRESHOLD_DATA_PROVENANCE` |
| LLM/로그 기능 | LLM은 설명만 하고 숫자를 만들지 않았는지 어떻게 검증하는가? | `LLM_EXPLANATION_LOG`, `CALCULATION_AUDIT_LOG`, `AI_ANOMALY_LOG` |

---

## 문서별 링크

| 문서 | 내용 |
| --- | --- |
| [01-common-simulation.md](./01-common-simulation.md) | §1 공통 시뮬레이션 |
| [02-housing.md](./02-housing.md) | §2 주거 |
| [03-career.md](./03-career.md) | §3 커리어 |
| [04-childcare-return.md](./04-childcare-return.md) | §4 보육/복직 |
| [05-senior.md](./05-senior.md) | §5 노년 |
| [06-policy-rag.md](./06-policy-rag.md) | §6 정책/RAG |
| [07-data-provenance.md](./07-data-provenance.md) | §7 데이터 출처/스냅샷 |
| [08-llm-audit.md](./08-llm-audit.md) | §8 LLM/계산 검증/로그 |
| [09-priority.md](./09-priority.md) | §9 구현 우선순위 |
| [10-summary.md](./10-summary.md) | §10 최종 정리 · §11 ERD 읽는 법 |
| [11-schema-backend-ai.md](./11-schema-backend-ai.md) | §12 스키마 개념 · §13 Backend/AI 분리 설계 |
| [12-backend-package-layout.md](./12-backend-package-layout.md) | §14 Spring Backend package layout |
| [13-fastapi-structure.md](./13-fastapi-structure.md) | §15 AI FastAPI 상세 구조 |
| [14-front-backend-ai-flow.md](./14-front-backend-ai-flow.md) | §16 Front → Backend → AI 전체 흐름도 |

---

## 레포·구현 참고

- DB 마이그레이션: `back/src/main/resources/db/migration/` (현재 Phase 1은 공통 시뮬레이션 코어)
- Spring 패키지 규칙: `back/STRUCTURE.md`, [12-backend-package-layout.md](./12-backend-package-layout.md)
- FastAPI 기능 폴더: `fastapi/lifePivot_/README.md`, [13-fastapi-structure.md](./13-fastapi-structure.md)
- Front → Backend → AI 흐름도: [14-front-backend-ai-flow.md](./14-front-backend-ai-flow.md)

이전 단일 요약본: [../ERD-v4-feature-based.md](../ERD-v4-feature-based.md) (이 목차를 가리키도록 갱신됨)
