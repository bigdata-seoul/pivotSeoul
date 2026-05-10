# Pivot Seoul backend — package layout

Spring Boot sources live under **`src/main/java`**. The codebase uses **domain-first** packages under `com.pivotseoul.domain.{domain}`, with **one layer of folders** under each domain (`controller`, `service`, `dto`, `entity`, `repository`, `enums`). There are **no fourth-level folders** such as `dto/request`, `dto/response`, or `service/calculator`; roles are expressed in **class names** (for example `CreateSessionRequest`, `HousingCostCalculator`).

Shared infrastructure stays under **`com.pivotseoul.global`** (`config`, `security`, `exception`, `response`, `common`, `util`).

---

## Rules (final)

| Rule | Example |
|------|---------|
| Allowed | `domain/simulation/dto/CreateSessionRequest.java` |
| Allowed | `domain/simulation/service/HousingCostCalculator.java` |
| Not allowed | `domain/simulation/dto/request/CreateSessionRequest.java` |
| Not allowed | `domain/simulation/service/calculator/HousingCostCalculator.java` |

---

## Top-level tree

```
src
└─ main
   ├─ java
   │  └─ com
   │     └─ pivotseoul
   │        ├─ PivotSeoulApplication.java
   │        │
   │        ├─ global
   │        │  ├─ config
   │        │  ├─ security
   │        │  ├─ exception
   │        │  ├─ response
   │        │  ├─ common
   │        │  └─ util
   │        │
   │        └─ domain
   │           ├─ auth
   │           ├─ user
   │           ├─ simulation
   │           ├─ data
   │           ├─ content
   │           ├─ admin
   │           ├─ analytics
   │           └─ log
   │
   └─ resources
      ├─ application.yml
      ├─ application-local.yml
      ├─ application-prod.yml
      └─ db
         └─ migration
```

---

## Per-domain layout

Each domain follows:

```
domain/{name}
├─ controller
├─ service
├─ dto
├─ entity
├─ repository
└─ enums   (omit if not needed)
```

Domains **admin**, **analytics**, and **log** do not define `enums` in this scaffold.

---

## Domain contents (file names)

### `domain/auth`

- **controller:** `AuthController`
- **service:** `AuthService`, `TokenService`, `PasswordService`
- **dto:** `AdminLoginRequest`, `RefreshTokenRequest`, `AdminLoginResponse`, `TokenResponse`
- **entity:** `AdminUser`
- **repository:** `AdminUserRepository`
- **enums:** `AdminRole`

### `domain/user`

- **controller:** `UserHomeController`, `LifeStageController`, `DistrictController`
- **service:** `UserHomeService`, `LifeStageService`, `DistrictService`
- **dto:** `UserHomeResponse`, `LifeStageResponse`, `LifeStageDetailResponse`, `DistrictResponse`, `DistrictListResponse`
- **entity:** `LifeStage`, `District`
- **repository:** `LifeStageRepository`, `DistrictRepository`
- **enums:** `LifeStageCode`

### `domain/simulation`

- **controller:** `SimulationSessionController`, `OnboardingController`, `ScenarioController`, `SimulationRunController`, `SimulationResultController`, `ThresholdController`, `RecommendationController`
- **service:** `SimulationSessionService`, `OnboardingService`, `ScenarioService`, `SimulationEngineService`, `SimulationResultService`, `ThresholdService`, `RedZoneService`, `RecommendationService`, `RecoveryLeverService`, `WeeklyActionService`, `HousingCostCalculator`, `CommuteTimeCalculator`, `LearningTimeCalculator`, `ChildcareAccessCalculator`, `ReturnToWorkCalculator`, `RetirementCashflowCalculator`, `ScenarioScoreCalculator`
- **dto:** `CreateSessionRequest`, `CreateOnboardingRequest`, `UpdateOnboardingRequest`, `CreateScenarioRequest`, `UpdateScenarioRequest`, `RunSimulationRequest`, `SessionResponse`, `SessionSummaryResponse`, `OnboardingAnswerResponse`, `OnboardingSummaryResponse`, `ScenarioResponse`, `ScenarioVariableResponse`, `RunSimulationResponse`, `SimulationResultResponse`, `ResultSummaryResponse`, `ComparisonResponse`, `EvidenceResponse`, `ThresholdResultResponse`, `ThresholdSummaryResponse`, `RedZoneResponse`, `RecoveryLeverResponse`, `WeeklyActionResponse`
- **entity:** `SimulationSession`, `OnboardingAnswer`, `Scenario`, `ScenarioVariable`, `SimulationResult`, `ScenarioComparison`, `ThresholdResult`, `RedZoneRule`, `RecoveryLever`, `WeeklyAction`, `CalculationLog`
- **repository:** matching `*Repository` for each entity above
- **enums:** `ScenarioType`, `SimulationStatus`, `ThresholdStatus`, `ThresholdType`, `RedZoneType`, `LeverType`

Calculators live in **`service`** next to other services (no `calculator/` subfolder).

### `domain/data`

- **controller:** `DatasetController`, `DatasetAdminController`, `DataSourceController`
- **service:** `DatasetService`, `DatasetQueryService`, `DataIngestionService`, `DataValidationService`, `DataSourceService`
- **dto:** `CreateDatasetRequest`, `UpdateDatasetRequest`, `UpdateDataSourceRequest`, `DatasetResponse`, `DatasetListResponse`, `DatasetHistoryResponse`, `ValidationResultResponse`, `DataSourceResponse`, `DataSourceMetaResponse`
- **entity:** `DatasetRegistry`, `DatasetUpdateHistory`, `DatasetValidationResult`, `DataSourceMeta`
- **repository:** `DatasetRegistryRepository`, `DatasetUpdateHistoryRepository`, `DatasetValidationResultRepository`, `DataSourceMetaRepository`
- **enums:** `DatasetStatus`, `ValidationStatus`

### `domain/content`

- **controller:** `ContentController`, `ContentAdminController`, `FaqController`, `NoticeController`, `NoticeAdminController`, `MaintenanceAdminController`, `ExternalLinkController`, `ExternalLinkAdminController`
- **service:** `ContentService`, `FaqService`, `NoticeService`, `MaintenanceService`, `ExternalLinkService`
- **dto:** `CreateContentRequest`, `UpdateContentRequest`, `CreateFaqRequest`, `UpdateFaqRequest`, `CreateNoticeRequest`, `UpdateNoticeRequest`, `CreateMaintenanceRequest`, `UpdateMaintenanceRequest`, `CreateExternalLinkRequest`, `UpdateExternalLinkRequest`, `ContentResponse`, `ContentListResponse`, `FaqResponse`, `NoticeResponse`, `NoticeListResponse`, `MaintenanceResponse`, `ExternalLinkResponse`, `ExternalLinkClickResponse`
- **entity:** `ServiceContent`, `Faq`, `Notice`, `MaintenanceSchedule`, `ExternalLink`
- **repository:** `ServiceContentRepository`, `FaqRepository`, `NoticeRepository`, `MaintenanceScheduleRepository`, `ExternalLinkRepository`
- **enums:** `ContentType`, `NoticeType`, `DisplayArea`

### `domain/admin`

- **controller:** `AdminDashboardController`, `AdminAccountController`, `AdminPermissionController`
- **service:** `AdminDashboardService`, `AdminAccountService`, `AdminPermissionService`
- **dto:** `CreateAdminUserRequest`, `UpdateAdminUserRequest`, `UpdateAdminRoleRequest`, `AdminDashboardResponse`, `AdminSummaryResponse`, `AdminErrorSummaryResponse`, `AdminUserResponse`, `AdminUserListResponse`, `AdminRoleResponse`
- **entity:** `AdminRole`, `AdminAccessLog`
- **repository:** `AdminRoleRepository`, `AdminAccessLogRepository`

### `domain/analytics`

- **controller:** `AnalyticsAdminController`
- **service:** `AnalyticsService`, `EventLogService`, `FunnelAnalysisService`, `DistrictAnalyticsService`, `ExternalClickAnalyticsService`
- **dto:** `CreateUserEventLogRequest`, `UsageSummaryResponse`, `LifeStageAnalyticsResponse`, `DistrictAnalyticsResponse`, `FunnelAnalyticsResponse`, `ExternalClickAnalyticsResponse`
- **entity:** `UserEventLog`, `ExternalClickLog`
- **repository:** `UserEventLogRepository`, `ExternalClickLogRepository`

### `domain/log`

- **controller:** `LogAdminController`
- **service:** `ApiErrorLogService`, `AiAnomalyLogService`, `UserReportService`, `SystemLogService`
- **dto:** `CreateUserReportRequest`, `ApiErrorLogResponse`, `AiAnomalyLogResponse`, `UserReportResponse`, `SystemLogResponse`
- **entity:** `ApiErrorLog`, `AiAnomalyLog`, `UserReport`, `SystemLog`
- **repository:** `ApiErrorLogRepository`, `AiAnomalyLogRepository`, `UserReportRepository`, `SystemLogRepository`

---

## Scaffold note

Java files under `domain/**` are **structural stubs** (minimal fields, placeholders) intended for compilation and navigation; behavior and API mappings should be filled in as features land.
