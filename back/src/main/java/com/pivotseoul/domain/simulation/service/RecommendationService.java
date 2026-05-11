package com.pivotseoul.domain.simulation.service;

import com.pivotseoul.domain.simulation.dto.RecommendationResponse;
import com.pivotseoul.domain.simulation.dto.ResultSummaryResponse;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class RecommendationService {

    private static final String KIND_RELOCATION = "relocation";
    private static final String KIND_POLICY = "policy";
    private static final String KIND_WORK = "work";
    private static final String PRIORITY_HIGH = "high";
    private static final String PRIORITY_MEDIUM = "medium";
    private static final String STATUS_DANGER = "danger";

    private final SimulationResultService simulationResultService;

    public RecommendationService(SimulationResultService simulationResultService) {
        this.simulationResultService = simulationResultService;
    }

    public List<RecommendationResponse> getRecommendations(Long scenarioResultId) {
        ResultSummaryResponse summary = simulationResultService.getSummary(scenarioResultId);
        return buildRecommendations(summary.riskStatus());
    }

    public List<RecommendationResponse> buildRecommendations(Map<String, Object> request) {
        String riskStatus = request == null ? null : String.valueOf(request.getOrDefault("riskStatus", STATUS_DANGER));
        return buildRecommendations(riskStatus);
    }

    private List<RecommendationResponse> buildRecommendations(String riskStatus) {
        String topPriority = STATUS_DANGER.equals(riskStatus) ? PRIORITY_HIGH : PRIORITY_MEDIUM;
        return List.of(
                new RecommendationResponse(
                        "relocation",
                        KIND_RELOCATION,
                        "거주지 조정 검토",
                        "현재 조건",
                        "비용 부담이 낮은 대안",
                        "주거비 부담률 완화",
                        "통근 시간과 생활권 변화를 함께 확인해야 합니다.",
                        topPriority,
                        "위험도와 주거 관련 점수를 기준으로 우선 검토할 항목입니다."
                ),
                new RecommendationResponse(
                        "policy",
                        KIND_POLICY,
                        "정책 지원 확인",
                        "미신청",
                        "서울시 지원 정책",
                        "현금흐름 보완",
                        "자격 요건과 증빙 서류 확인이 필요합니다.",
                        PRIORITY_HIGH,
                        "결과 해석에 필요한 즉시 실행 가능한 보완책입니다."
                ),
                new RecommendationResponse(
                        "work",
                        KIND_WORK,
                        "복직/근무 조건 재점검",
                        "현재 계획",
                        "소득 회복 시점 조정",
                        "소득 공백 축소",
                        "보육 부담과 근무 가능 시간을 같이 비교해야 합니다.",
                        PRIORITY_MEDIUM,
                        "시간 손실과 커리어 점수 변화를 완화하기 위한 추천입니다."
                )
        );
    }
}
