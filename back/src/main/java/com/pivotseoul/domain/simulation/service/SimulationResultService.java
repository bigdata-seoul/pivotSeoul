package com.pivotseoul.domain.simulation.service;

import com.pivotseoul.domain.simulation.dto.EvidenceResponse;
import com.pivotseoul.domain.simulation.dto.ResultSummaryResponse;
import com.pivotseoul.domain.simulation.dto.SimulationResultResponse;
import com.pivotseoul.domain.simulation.dto.ThresholdResultResponse;
import com.pivotseoul.domain.simulation.entity.ScenarioResult;
import com.pivotseoul.domain.simulation.entity.SimulationDataUsage;
import com.pivotseoul.domain.simulation.entity.ThresholdResult;
import com.pivotseoul.domain.simulation.repository.ScenarioResultRepository;
import com.pivotseoul.domain.simulation.repository.SimulationDataUsageRepository;
import com.pivotseoul.domain.simulation.repository.ThresholdResultRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class SimulationResultService {

    private static final String STATUS_SAFE = "safe";
    private static final String STATUS_WARNING = "warning";
    private static final String STATUS_DANGER = "danger";
    private static final String RESULT_STATUS_PLACEHOLDER = "PLACEHOLDER";
    private static final String MESSAGE_SAFE = "주요 임계값이 안정 범위입니다.";
    private static final String MESSAGE_WARNING = "일부 지표가 주의 구간에 진입했습니다.";
    private static final String MESSAGE_DANGER = "위험 임계값을 초과한 지표가 있습니다.";
    private static final BigDecimal WARNING_RISK_SCORE = new BigDecimal("40");
    private static final BigDecimal DANGER_RISK_SCORE = new BigDecimal("70");

    private final ScenarioResultRepository scenarioResultRepository;
    private final ThresholdResultRepository thresholdResultRepository;
    private final SimulationDataUsageRepository simulationDataUsageRepository;

    public SimulationResultService(
            ScenarioResultRepository scenarioResultRepository,
            ThresholdResultRepository thresholdResultRepository,
            SimulationDataUsageRepository simulationDataUsageRepository
    ) {
        this.scenarioResultRepository = scenarioResultRepository;
        this.thresholdResultRepository = thresholdResultRepository;
        this.simulationDataUsageRepository = simulationDataUsageRepository;
    }

    public SimulationResultResponse getResult(Long scenarioResultId) {
        return scenarioResultRepository.findById(scenarioResultId)
                .map(this::toResultResponse)
                .orElseGet(() -> placeholderResult(scenarioResultId));
    }

    public ResultSummaryResponse getSummary(Long scenarioResultId) {
        return scenarioResultRepository.findById(scenarioResultId)
                .map(this::toSummaryResponse)
                .orElseGet(() -> placeholderSummary(scenarioResultId));
    }

    public List<ResultSummaryResponse> getHistory(Long simulationRunId) {
        if (simulationRunId == null) {
            return scenarioResultRepository.findAll().stream()
                    .map(this::toSummaryResponse)
                    .toList();
        }
        return scenarioResultRepository.findBySimulationRunIdOrderByScenarioResultIdDesc(simulationRunId)
                .stream()
                .map(this::toSummaryResponse)
                .toList();
    }

    private SimulationResultResponse toResultResponse(ScenarioResult result) {
        List<ThresholdResultResponse> thresholds = thresholdResultRepository
                .findByScenarioResultIdOrderByThresholdResultIdAsc(result.getScenarioResultId())
                .stream()
                .map(this::toThresholdResponse)
                .toList();
        List<EvidenceResponse> dataSources = simulationDataUsageRepository
                .findBySimulationRunIdOrderByUsageIdAsc(result.getSimulationRunId())
                .stream()
                .map(this::toEvidenceResponse)
                .toList();
        ResultSummaryResponse summary = toSummaryResponse(result, thresholds);

        return new SimulationResultResponse(
                result.getScenarioResultId(),
                result.getSimulationRunId(),
                result.getScenarioId(),
                result.getResultStatus(),
                summary.riskStatus(),
                summary,
                buildScoreMap(result),
                thresholds,
                dataSources
        );
    }

    private ResultSummaryResponse toSummaryResponse(ScenarioResult result) {
        List<ThresholdResultResponse> thresholds = thresholdResultRepository
                .findByScenarioResultIdOrderByThresholdResultIdAsc(result.getScenarioResultId())
                .stream()
                .map(this::toThresholdResponse)
                .toList();
        return toSummaryResponse(result, thresholds);
    }

    private ResultSummaryResponse toSummaryResponse(
            ScenarioResult result,
            List<ThresholdResultResponse> thresholds
    ) {
        long redZoneCount = thresholds.stream().filter(ThresholdResultResponse::redZone).count();
        String riskStatus = resolveRiskStatus(result.getRiskScore(), redZoneCount);
        return new ResultSummaryResponse(
                result.getScenarioResultId(),
                result.getSimulationRunId(),
                result.getScenarioId(),
                result.getResultStatus(),
                riskStatus,
                result.getTotalScore(),
                result.getRiskScore(),
                result.getConfidenceScore(),
                redZoneCount,
                resolveSummaryMessage(riskStatus)
        );
    }

    private Map<String, BigDecimal> buildScoreMap(ScenarioResult result) {
        Map<String, BigDecimal> scores = new LinkedHashMap<>();
        scores.put("housing", result.getHousingScore());
        scores.put("disposableIncome", result.getDisposableIncomeScore());
        scores.put("career", result.getCareerScore());
        scores.put("timeLoss", result.getTimeLossScore());
        scores.put("opportunity", result.getOpportunityIndex());
        scores.put("childcare", result.getChildcareScore());
        scores.put("policy", result.getPolicyScore());
        scores.put("seniorSustainability", result.getSeniorSustainabilityScore());
        return scores;
    }

    private ThresholdResultResponse toThresholdResponse(ThresholdResult threshold) {
        return new ThresholdResultResponse(
                threshold.getThresholdResultId(),
                threshold.getThresholdTypeId(),
                threshold.getThresholdStatus(),
                threshold.getCalculatedValue(),
                threshold.getThresholdValue(),
                threshold.isRedZone(),
                threshold.getCalculationSummary()
        );
    }

    private EvidenceResponse toEvidenceResponse(SimulationDataUsage usage) {
        return new EvidenceResponse(
                usage.getUsageId(),
                usage.getDataSnapshotId(),
                usage.getUsedFor(),
                usage.getUsedFieldList(),
                usage.getSourceWeight()
        );
    }

    private String resolveRiskStatus(BigDecimal riskScore, long redZoneCount) {
        if (redZoneCount > 0 || isAtLeast(riskScore, DANGER_RISK_SCORE)) {
            return STATUS_DANGER;
        }
        if (isAtLeast(riskScore, WARNING_RISK_SCORE)) {
            return STATUS_WARNING;
        }
        return STATUS_SAFE;
    }

    private boolean isAtLeast(BigDecimal value, BigDecimal threshold) {
        return value != null && value.compareTo(threshold) >= 0;
    }

    private String resolveSummaryMessage(String riskStatus) {
        return switch (riskStatus) {
            case STATUS_DANGER -> MESSAGE_DANGER;
            case STATUS_WARNING -> MESSAGE_WARNING;
            default -> MESSAGE_SAFE;
        };
    }

    private SimulationResultResponse placeholderResult(Long scenarioResultId) {
        ResultSummaryResponse summary = placeholderSummary(scenarioResultId);
        return new SimulationResultResponse(
                scenarioResultId,
                null,
                null,
                RESULT_STATUS_PLACEHOLDER,
                STATUS_WARNING,
                summary,
                Map.of(),
                List.of(),
                List.of()
        );
    }

    private ResultSummaryResponse placeholderSummary(Long scenarioResultId) {
        return new ResultSummaryResponse(
                scenarioResultId,
                null,
                null,
                RESULT_STATUS_PLACEHOLDER,
                STATUS_WARNING,
                null,
                null,
                null,
                0,
                MESSAGE_WARNING
        );
    }
}
