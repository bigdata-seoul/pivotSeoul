# Backend Module Guide

이 폴더는 Pivot Seoul의 Spring Boot 백엔드입니다.

## Responsibilities

- 사용자/관리자 API 제공
- 시뮬레이션 세션, 온보딩, 시나리오, 결과 저장
- 데이터셋, 출처, 검증 이력 관리
- 공지, FAQ, 외부 링크 등 운영 콘텐츠 관리
- 사용량, 퍼널, 지역별 분석 API 제공
- FastAPI AI 서비스로 요청을 전달하는 게이트웨이 역할

## Run

```bash
./gradlew bootRun
```

## Test

```bash
./gradlew test
```

## Configuration

- `src/main/resources/application.yml`: 공통 설정
- `src/main/resources/application-local.yml`: 로컬 개발 설정
- `src/main/resources/application-prod.yml`: 운영 설정
- `PIVOT_FASTAPI_BASE_URL`: FastAPI 서비스 주소

## Package Rule

도메인별 폴더 안에서 계층을 나눕니다.

```text
domain/{name}
├─ controller
├─ service
├─ dto
├─ entity
├─ repository
└─ enums
```

세부 구조 규칙은 `STRUCTURE.md`를 확인하세요.
