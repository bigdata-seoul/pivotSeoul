# 기능별 ERD v4 (요약 진입점)

상세 분할본은 **`docs/erd-v4/README.md`** 에서 기능별 파일로 나뉘어 있다.

| 빠른 링크 | 파일 |
| --- | --- |
| 목차·분리 기준표 | [erd-v4/README.md](./erd-v4/README.md) |
| 공통 시뮬레이션 | [erd-v4/01-common-simulation.md](./erd-v4/01-common-simulation.md) |
| 주거 ~ LLM/로그 | 동일 폴더 `02` ~ `08` |
| 구현 우선순위 | [erd-v4/09-priority.md](./erd-v4/09-priority.md) |
| 최종 정리·ERD 읽는 법 | [erd-v4/10-summary.md](./erd-v4/10-summary.md) |

---

## 레포 반영 상태 (요약)

- **Phase 1 DB:** `V1__erd_v4_core_simulation.sql` — §1 공통 시뮬레이션 코어.
- **Phase 2 DB:** `V3__erd_v4_threshold_and_data_lineage.sql` — §2 임계점·회복 레버·주간 액션·계산 감사 로그 + §7 데이터셋·소스·스냅샷·검증·계보·run별 스냅샷 사용 + `scenario_result` 도메인 점수 컬럼 등 (§9 순서 2 범위). (`V2` 스텁은 `V3`에서 드롭 후 본 스키마로 교체.)
- **Spring 패키지:** `back/STRUCTURE.md`
- **FastAPI:** `fastapi/lifePivot_/README.md`

데이터 흐름: Frontend → Spring(검증·저장) → FastAPI(계산·RAG·LLM) → Spring(검증·저장) → Frontend.
