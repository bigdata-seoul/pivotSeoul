# Front Detailed Guide

## 1) Overall Responsibility

`front`는 사용자/관리자 화면을 담당하며, 도메인 상태를 화면 흐름에 맞춰 관리합니다.

- 사용자 핵심 플로우: 생애단계 선택 -> 온보딩 -> 시나리오 -> 결과
- 관리자 핵심 플로우: 로그인 -> 모니터링/데이터셋/공지/로그/계정 관리

## 2) Key Files

- `src/App.tsx`: 전역 Provider 조합 루트
- `src/routes.tsx`: URL 구조와 페이지 매핑
- `src/context/PivotContext.tsx`: 화면 계산용 상태/헬퍼
- `src/pages/*`: 기능별 화면 단위

## 3) How To Extend

### 새 사용자 기능 추가

1. `src/pages`에 페이지 생성
2. `src/routes.tsx`에 경로 등록
3. 필요한 상태 필드/업데이트 함수를 `PivotContext`에 추가

### 새 관리자 기능 추가

1. `src/pages/admin-*` 파일 생성
2. `/admin` 하위 라우트에 연결
3. 권한 분기 필요 시 `AdminLayout`에서 제어

## 4) Contract with Backend

- 백엔드 모듈 구조(`housing`, `career`, `childcare`, `senior`, `policy`)와 프론트 결과 섹션을 1:1로 맞추면 유지보수가 쉬워집니다.
- 프론트는 "보여주기 + 사용자 입력 수집"에 집중하고, 계산/추천은 백엔드 API로 위임하는 방향을 기본 원칙으로 둡니다.
