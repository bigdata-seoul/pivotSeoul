# Pivot Seoul Frontend

Pivot Seoul의 사용자 시뮬레이션 화면과 관리자 콘솔을 담당하는 Next.js 프론트엔드 브랜치입니다.

## Portfolio Focus

- 생애단계 선택 -> 온보딩 -> 시나리오 비교 -> 결과 확인으로 이어지는 사용자 플로우
- 관리자 로그인 이후 모니터링, 데이터셋, 공지, 로그, 계정 관리 화면
- 도메인 상태를 `PivotContext`에서 관리하고 화면은 `pages/` 단위로 분리
- 백엔드/FastAPI 계산 결과를 화면 계약에 맞춰 보여주는 API 클라이언트 계층

## Tech Stack

- Next.js
- React 18
- TypeScript
- MUI, Radix UI, lucide-react
- Recharts

## Run

```bash
cd front
npm install
npm run dev
```

운영 빌드:

```bash
cd front
npm run build
npm run start
```

## Structure

```text
front/
├─ src/App.tsx                 # 전역 Provider와 라우터 진입점
├─ src/routes.tsx              # 사용자/관리자 라우트 맵
├─ src/context/                # 시뮬레이션 상태와 테마 상태
├─ src/pages/                  # 화면 단위 페이지
├─ src/components/             # 공통 UI와 기능 컴포넌트
├─ src/api/                    # 관리자/데이터/추천 API 클라이언트
├─ src/hooks/                  # 시뮬레이션 실행 훅
└─ src/styles/                 # 전역 스타일과 테마
```

## Main User Flow

1. `Home`
2. `StageSelection`
3. `Onboarding*`
4. `Scenario`
5. `SimulationRun`
6. `Results`

## Admin Flow

1. `admin-AdminLogin`
2. `admin-AdminDashboard`
3. `admin-AdminMonitoring`
4. `admin-AdminDatasets`
5. `admin-AdminNotices`
6. `admin-AdminLogs`
7. `admin-AdminAccounts`

## API Boundary

프론트는 Spring Boot API를 기본 진입점으로 사용합니다.

- 기본 주소: `NEXT_PUBLIC_API_BASE` 또는 `NEXT_PUBLIC_API_BASE_URL`
- Spring Boot가 AI/FastAPI 파이프라인을 `/api/ai/*` 경로로 중계
- 화면 단위 요청/응답 타입은 `src/api`, `src/lib`에서 관리

## Maintenance Guide

- 화면 변경은 `front/src/pages`에서 시작합니다.
- 공통 UI는 `front/src/components`로 분리합니다.
- 도메인 상태 추가는 `front/src/context/PivotContext.tsx`에 모읍니다.
- API 계약이 바뀌면 화면보다 먼저 `src/api` 또는 `src/lib`의 호출부를 정리합니다.
