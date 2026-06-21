# §14 Pivot Seoul Backend — package layout

## §14.1 Final package rule

Spring Boot 소스는 **`src/main/java`** 아래에 둔다. 코드베이스는 `com.pivotseoul.domain.{domain}` 아래에 **domain-first package**를 사용한다.

각 도메인 아래에는 한 단계의 레이어 폴더만 둔다.

```text
controller
service
dto
entity
repository
enums
```

`dto/request`, `dto/response`, `service/calculator` 같은 4-depth 하위 폴더는 만들지 않는다. 역할은 폴더가 아니라 클래스명으로 표현한다.

예:

- `CreateSessionRequest`
- `SessionSummaryResponse`
- `HousingCostCalculator`
- `ReturnToWorkCalculator`

공통 인프라는 **`com.pivotseoul.global`** 아래에 둔다.

```text
global/config
global/security
global/exception
global/response
global/common
global/util
```

## §14.2 Rules — final

| Rule | Example |
| --- | --- |
| Allowed | `domain/simulation/dto/CreateSessionRequest.java` |
| Allowed | `domain/simulation/service/HousingCostCalculator.java` |
| Not allowed | `domain/simulation/dto/request/CreateSessionRequest.java` |
| Not allowed | `domain/simulation/service/calculator/HousingCostCalculator.java` |

핵심은 **도메인 내부 1-depth layer만 허용**한다는 점이다. DTO request/response 구분이나 calculator 구분은 폴더가 아니라 클래스명으로 표현한다.

## §14.3 Top-level tree

```text
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
   │           ├─ ai
   │           └─ log
   │
   └─ resources
      ├─ application.yml
      ├─ application-local.yml
      ├─ application-prod.yml
      └─ db
         └─ migration
```

## §14.4 Per-domain layout

각 도메인은 다음 구조를 기본으로 따른다.

```text
domain/{name}
├─ controller
├─ service
├─ dto
├─ entity
├─ repository
└─ enums
```

필요 없는 폴더는 생략한다.

- `admin`, `analytics`, `log`는 현재 scaffold 기준으로 `enums`를 정의하지 않는다.
- `domain/ai`는 Spring-side AI **gateway/orchestration** 영역이다.
- `domain/ai`는 FastAPI AI 서버와 외부 LLM을 호출하는 HTTP boundary 역할을 한다.
- `domain/ai`는 초기에는 `controller`, `service`만 둔다.
- `domain/ai`의 `dto`, `entity`, `repository`, `enums`는 persistence나 API contract가 필요해질 때만 추가한다.

## §14.5 Domain contents — file names

### `domain/auth`

```text
controller:
- AuthController

service:
- AuthService
- TokenService
- PasswordService

dto:
- AdminLoginRequest
- RefreshTokenRequest
- AdminLoginResponse
- TokenResponse

entity:
- AdminUser

repository:
- AdminUserRepository

enums:
- AdminRole
```

### `domain/user`

```text
controller:
- UserHomeController
- LifeStageController
- DistrictController

service:
- UserHomeService
- LifeStageService
- DistrictService

dto:
- UserHomeResponse
- LifeStageResponse
- LifeStageDetailResponse
- DistrictResponse
- DistrictListResponse

entity:
- LifeStage
- District

repository:
- LifeStageRepository
- DistrictRepository

enums:
- LifeStageCode
```

### `domain/simulation`

```text
controller:
- SimulationSessionController
- OnboardingController
- ScenarioController
- SimulationRunController
- SimulationResultController
- ThresholdController
- RecommendationController

service:
- SimulationSessionService
- OnboardingService
- ScenarioService
- SimulationEngineService
- SimulationResultService
- ThresholdService
- RedZoneService
- RecommendationService
- RecoveryLeverService
- WeeklyActionService
- HousingCostCalculator
- CommuteTimeCalculator
- LearningTimeCalculator
- ChildcareAccessCalculator
- ReturnToWorkCalculator
- RetirementCashflowCalculator
- ScenarioScoreCalculator

dto:
- CreateSessionRequest
- CreateOnboardingRequest
- UpdateOnboardingRequest
- CreateScenarioRequest
- UpdateScenarioRequest
- RunSimulationRequest
- SessionResponse
- SessionSummaryResponse
- OnboardingAnswerResponse
- OnboardingSummaryResponse
- ScenarioResponse
- ScenarioVariableResponse
- RunSimulationResponse
- SimulationResultResponse
- ResultSummaryResponse
- ComparisonResponse
- EvidenceResponse
- ThresholdResultResponse
- ThresholdSummaryResponse
- RedZoneResponse
- RecoveryLeverResponse
- WeeklyActionResponse

entity:
- SimulationSession
- OnboardingAnswer
- Scenario
- ScenarioVariable
- SimulationResult
- ScenarioComparison
- ThresholdResult
- RedZoneRule
- RecoveryLever
- WeeklyAction
- CalculationLog

repository:
- SimulationSessionRepository
- OnboardingAnswerRepository
- ScenarioRepository
- ScenarioVariableRepository
- SimulationResultRepository
- ScenarioComparisonRepository
- ThresholdResultRepository
- RedZoneRuleRepository
- RecoveryLeverRepository
- WeeklyActionRepository
- CalculationLogRepository

enums:
- ScenarioType
- SimulationStatus
- ThresholdStatus
- ThresholdType
- RedZoneType
- LeverType
```

계산 클래스는 다른 service와 같은 `service` 폴더에 둔다. `service/calculator` 하위 폴더는 만들지 않는다.

### `domain/data`

```text
controller:
- DatasetController
- DatasetAdminController
- DataSourceController

service:
- DatasetService
- DatasetQueryService
- DataIngestionService
- DataValidationService
- DataSourceService

dto:
- CreateDatasetRequest
- UpdateDatasetRequest
- UpdateDataSourceRequest
- DatasetResponse
- DatasetListResponse
- DatasetHistoryResponse
- ValidationResultResponse
- DataSourceResponse
- DataSourceMetaResponse

entity:
- DatasetRegistry
- DatasetUpdateHistory
- DatasetValidationResult
- DataSourceMeta

repository:
- DatasetRegistryRepository
- DatasetUpdateHistoryRepository
- DatasetValidationResultRepository
- DataSourceMetaRepository

enums:
- DatasetStatus
- ValidationStatus
```

### `domain/content`

```text
controller:
- ContentController
- ContentAdminController
- FaqController
- NoticeController
- NoticeAdminController
- MaintenanceAdminController
- ExternalLinkController
- ExternalLinkAdminController

service:
- ContentService
- FaqService
- NoticeService
- MaintenanceService
- ExternalLinkService

dto:
- CreateContentRequest
- UpdateContentRequest
- CreateFaqRequest
- UpdateFaqRequest
- CreateNoticeRequest
- UpdateNoticeRequest
- CreateMaintenanceRequest
- UpdateMaintenanceRequest
- CreateExternalLinkRequest
- UpdateExternalLinkRequest
- ContentResponse
- ContentListResponse
- FaqResponse
- NoticeResponse
- NoticeListResponse
- MaintenanceResponse
- ExternalLinkResponse
- ExternalLinkClickResponse

entity:
- ServiceContent
- Faq
- Notice
- MaintenanceSchedule
- ExternalLink

repository:
- ServiceContentRepository
- FaqRepository
- NoticeRepository
- MaintenanceScheduleRepository
- ExternalLinkRepository

enums:
- ContentType
- NoticeType
- DisplayArea
```

### `domain/admin`

```text
controller:
- AdminDashboardController
- AdminAccountController
- AdminPermissionController

service:
- AdminDashboardService
- AdminAccountService
- AdminPermissionService

dto:
- CreateAdminUserRequest
- UpdateAdminUserRequest
- UpdateAdminRoleRequest
- AdminDashboardResponse
- AdminSummaryResponse
- AdminErrorSummaryResponse
- AdminUserResponse
- AdminUserListResponse
- AdminRoleResponse

entity:
- AdminRole
- AdminAccessLog

repository:
- AdminRoleRepository
- AdminAccessLogRepository
```

### `domain/analytics`

```text
controller:
- AnalyticsAdminController

service:
- AnalyticsService
- EventLogService
- FunnelAnalysisService
- DistrictAnalyticsService
- ExternalClickAnalyticsService

dto:
- CreateUserEventLogRequest
- UsageSummaryResponse
- LifeStageAnalyticsResponse
- DistrictAnalyticsResponse
- FunnelAnalyticsResponse
- ExternalClickAnalyticsResponse

entity:
- UserEventLog
- ExternalClickLog

repository:
- UserEventLogRepository
- ExternalClickLogRepository
```

### `domain/ai`

`domain/ai`는 Spring Boot 내부에서 AI 계산을 직접 구현하는 도메인이 아니다. FastAPI AI 서버와 외부 LLM을 호출하는 gateway/orchestration 영역이다.

```text
controller:
- AiGatewayController

service:
- AiGatewayService
```

API path는 `/api/ai`를 기준으로 둔다.

추후 내부 API contract가 확정되면 다음을 추가할 수 있다.

```text
dto:
- AiCalculationRequest
- AiCalculationResponse
- AiRecommendationResponse
- AiExplanationResponse
```

단, 이 DTO들도 `domain/ai/dto` 바로 아래에 둔다. `dto/request`, `dto/response` 하위 폴더는 만들지 않는다.

### `domain/log`

```text
controller:
- LogAdminController

service:
- ApiErrorLogService
- AiAnomalyLogService
- UserReportService
- SystemLogService

dto:
- CreateUserReportRequest
- ApiErrorLogResponse
- AiAnomalyLogResponse
- UserReportResponse
- SystemLogResponse

entity:
- ApiErrorLog
- AiAnomalyLog
- UserReport
- SystemLog

repository:
- ApiErrorLogRepository
- AiAnomalyLogRepository
- UserReportRepository
- SystemLogRepository
```

## §14.6 Scaffold note

`domain/**` 아래 Java 파일은 초기에는 **structural stub**로 둔다. 즉 컴파일과 탐색을 위한 최소 필드와 placeholder만 먼저 만들고, 실제 behavior와 API mapping은 기능 구현 단계에서 채운다.

이 backend 구조는 다음을 보장한다.

1. 기능 기준으로 코드를 빠르게 찾을 수 있다.
2. 도메인 내부 depth가 깊어지지 않는다.
3. Request/Response/Calculator 구분이 폴더가 아니라 클래스명으로 드러난다.
4. `domain/ai`가 실제 AI 구현체가 아니라 Spring-side gateway라는 점이 명확해진다.
5. ERD의 Entity와 Backend의 `entity`, `repository`, `service` 위치가 일관되게 매핑된다.

[← 목차로](./README.md)
