package com.pivotseoul.domain.admin.service;

import com.pivotseoul.domain.admin.dto.AdminDashboardResponse;
import com.pivotseoul.domain.admin.dto.AdminSummaryResponse;
import com.pivotseoul.domain.data.dto.DatasetResponse;
import com.pivotseoul.domain.data.dto.ValidationResultResponse;
import com.pivotseoul.domain.data.service.DataSourceService;
import com.pivotseoul.domain.data.service.DataValidationService;
import com.pivotseoul.domain.simulation.entity.ScenarioResult;
import com.pivotseoul.domain.simulation.repository.ScenarioResultRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;

@Service
public class AdminDashboardService {

    private static final String STATUS_NORMAL = "normal";
    private static final String STATUS_WARNING = "warning";
    private static final String VALIDATION_LEVEL_ERROR = "error";
    private static final String VALIDATION_LEVEL_WARN = "warn";

    private final ScenarioResultRepository scenarioResultRepository;
    private final DataSourceService dataSourceService;
    private final DataValidationService dataValidationService;

    public AdminDashboardService(
            ScenarioResultRepository scenarioResultRepository,
            DataSourceService dataSourceService,
            DataValidationService dataValidationService
    ) {
        this.scenarioResultRepository = scenarioResultRepository;
        this.dataSourceService = dataSourceService;
        this.dataValidationService = dataValidationService;
    }

    public AdminDashboardResponse getDashboard() {
        return new AdminDashboardResponse(
                getSummary(),
                getServiceStatuses(),
                getAiStatuses(),
                getDataOperationStatus(),
                getPromptRecommendationStatus()
        );
    }

    public AdminSummaryResponse getSummary() {
        List<ScenarioResult> results = scenarioResultRepository.findAll();
        double averageRiskScore = results.stream()
                .map(ScenarioResult::getRiskScore)
                .filter(score -> score != null)
                .mapToDouble(BigDecimal::doubleValue)
                .average()
                .orElse(0);
        return new AdminSummaryResponse(
                0,
                results.size(),
                round(averageRiskScore),
                resolveErrorRate(dataValidationService.getValidationResults())
        );
    }

    public List<AdminDashboardResponse.ServiceMetric> getServiceStatuses() {
        return List.of(
                new AdminDashboardResponse.ServiceMetric("api", "Spring API", 48, "ms", STATUS_NORMAL, 200),
                new AdminDashboardResponse.ServiceMetric("simulation", "결과 조회", 34, "%", STATUS_NORMAL, 100),
                new AdminDashboardResponse.ServiceMetric("data", "데이터 운영", 1, "건", getDataOperationStatus().status(), 5)
        );
    }

    public List<AdminDashboardResponse.AiStatus> getAiStatuses() {
        return List.of(
                new AdminDashboardResponse.AiStatus("gateway", "AI Gateway", STATUS_NORMAL, 82, "방금 전"),
                new AdminDashboardResponse.AiStatus("recommendation", "추천 모델", STATUS_NORMAL, 144, "1분 전"),
                new AdminDashboardResponse.AiStatus("explanation", "결과 해석", STATUS_WARNING, 310, "3분 전")
        );
    }

    public AdminDashboardResponse.DataOperationStatus getDataOperationStatus() {
        List<DatasetResponse> datasets = dataSourceService.getDatasetStatuses();
        long warningCount = dataValidationService.getValidationResults().stream()
                .filter(result -> VALIDATION_LEVEL_WARN.equals(result.level()) || VALIDATION_LEVEL_ERROR.equals(result.level()))
                .count();
        String status = warningCount == 0 ? STATUS_NORMAL : STATUS_WARNING;
        return new AdminDashboardResponse.DataOperationStatus(
                status,
                datasets.size(),
                warningCount,
                Instant.now().toString()
        );
    }

    public AdminDashboardResponse.PromptRecommendationStatus getPromptRecommendationStatus() {
        return new AdminDashboardResponse.PromptRecommendationStatus(
                STATUS_NORMAL,
                "v1.0-placeholder",
                "v1.0-placeholder",
                Instant.now().toString()
        );
    }

    private double resolveErrorRate(List<ValidationResultResponse> validationResults) {
        if (validationResults.isEmpty()) {
            return 0;
        }
        long errorCount = validationResults.stream()
                .filter(result -> VALIDATION_LEVEL_ERROR.equals(result.level()))
                .count();
        return round((double) errorCount / validationResults.size() * 100);
    }

    private double round(double value) {
        return BigDecimal.valueOf(value).setScale(2, RoundingMode.HALF_UP).doubleValue();
    }
}
