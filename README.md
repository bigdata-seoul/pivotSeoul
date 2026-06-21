# Pivot Seoul Backend

Pivot Seoul의 Spring Boot API, 데이터 영속성, 관리자 기능, FastAPI AI 게이트웨이를 담당하는 백엔드 브랜치입니다.

## Portfolio Focus

- 도메인 우선 패키지 구조로 사용자, 시뮬레이션, 데이터, 관리자, 로그 기능 분리
- Flyway 기반 DB 마이그레이션 관리
- Spring Boot API가 프론트와 FastAPI 사이의 안정적인 계약 계층 역할 수행
- 관리자 대시보드, 데이터셋 관리, 공지/콘텐츠, 로그/분석 API 구성

## Tech Stack

- Java 17
- Spring Boot 3.5
- Spring Web
- Spring Data JPA
- PostgreSQL
- Flyway
- springdoc-openapi
- H2 test runtime

## Run

```bash
cd back
./gradlew bootRun
```

테스트:

```bash
cd back
./gradlew test
```

## Structure

```text
back/
├─ src/main/java/com/pivotseoul/
│  ├─ PivotSeoulApplication.java
│  ├─ global/                  # 공통 설정, 보안, 예외, 응답
│  └─ domain/
│     ├─ auth/                 # 관리자 인증과 토큰
│     ├─ user/                 # 생애단계, 지역, 사용자 홈
│     ├─ simulation/           # 세션, 온보딩, 시나리오, 결과
│     ├─ data/                 # 데이터셋, 출처, 검증
│     ├─ content/              # 공지, FAQ, 외부 링크
│     ├─ admin/                # 관리자 계정과 권한
│     ├─ analytics/            # 사용량, 퍼널, 지역 분석
│     ├─ ai/                   # FastAPI 게이트웨이
│     └─ log/                  # API/AI/사용자 신고 로그
└─ src/main/resources/
   ├─ application.yml
   ├─ application-local.yml
   ├─ application-prod.yml
   ├─ db/migration/            # Flyway SQL
   └─ static/openapi.yaml
```

## API Boundary

- 프론트는 Spring Boot API를 호출합니다.
- Spring Boot의 `domain/ai`가 FastAPI의 `/api/v1/*` 기능 API를 프록시합니다.
- FastAPI 주소는 `pivotseoul.ai.fastapi-base-url` 또는 `PIVOT_FASTAPI_BASE_URL`로 설정합니다.

## Database

주요 스키마는 `back/src/main/resources/db/migration`의 Flyway SQL에서 관리합니다.

- `V1__erd_v4_core_simulation.sql`: 핵심 시뮬레이션 구조
- `V3__erd_v4_threshold_and_data_lineage.sql`: 임계값과 데이터 출처
- `V4__create_user_condition.sql`: 사용자 조건
- `V5__add_user_condition_session_index.sql`: 세션 인덱스

## Maintenance Guide

- 새 기능은 `domain/{기능}` 아래에 `controller`, `service`, `dto`, `entity`, `repository`, `enums` 형태로 추가합니다.
- 공통 예외, 응답, 보안, 설정은 `global` 아래에 둡니다.
- API 계약 변경 시 `static/openapi.yaml`과 프론트 호출부를 함께 확인합니다.
- AI 계산 자체는 FastAPI에 두고, Spring은 인증/계약/오케스트레이션에 집중합니다.
