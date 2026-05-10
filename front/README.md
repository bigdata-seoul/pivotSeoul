
# Life Pivot Dashboard Design (Front)

This frontend is now based on Next.js.

## Running the project

1. Install dependencies:
   - `npm install`
2. Start the dev server:
   - `npm run dev`
3. Build for production:
   - `npm run build`
4. Run production server:
   - `npm run start`

## Front Architecture (Domain UI Flow)

- **Entry**: `src/App.tsx`
  - Theme + domain context + router provider를 조합하는 최상위 루트
- **Route map**: `src/routes.tsx`
  - 사용자 플로우: Home -> Stage -> Onboarding -> Scenario -> Results
  - 관리자 플로우: Login -> Admin Dashboard/Monitoring/Datasets/...
- **Domain state**: `src/context/PivotContext.tsx`
  - 사용자 프로필, 시나리오 A/B, 간단 위험도 계산 로직을 보관
  - 화면 컴포넌트는 `usePivot()`으로 읽고 업데이트

## Recommended Maintenance Rule

- UI 변경은 `pages/*`에서 시작
- 도메인 계산 변경은 `PivotContext` 또는 백엔드 API 응답 모델과 함께 수정
- API 연결 시 라우트 단위로 request/response type을 명시해서 화면 영향 범위를 최소화
  