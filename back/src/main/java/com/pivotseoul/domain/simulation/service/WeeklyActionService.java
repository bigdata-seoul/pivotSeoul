package com.pivotseoul.domain.simulation.service;

import com.pivotseoul.domain.simulation.dto.WeeklyActionResponse;
import com.pivotseoul.domain.simulation.entity.WeeklyAction;
import com.pivotseoul.domain.simulation.repository.WeeklyActionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WeeklyActionService {

    private static final String DEFAULT_SOURCE_LABEL = "Pivot Seoul";
    private static final String ACTION_POLICY = "POLICY";
    private static final String ACTION_DATA_CHECK = "DATA_CHECK";
    private static final String ACTION_CONSULTING = "CONSULTING";

    private final WeeklyActionRepository weeklyActionRepository;

    public WeeklyActionService(WeeklyActionRepository weeklyActionRepository) {
        this.weeklyActionRepository = weeklyActionRepository;
    }

    public List<WeeklyActionResponse> getWeeklyActions(Long scenarioResultId) {
        List<WeeklyActionResponse> actions = weeklyActionRepository
                .findByScenarioResultIdOrderByPriorityOrderAscWeeklyActionIdAsc(scenarioResultId)
                .stream()
                .map(this::toResponse)
                .toList();
        if (actions.isEmpty()) {
            return placeholderActions();
        }
        return actions;
    }

    private WeeklyActionResponse toResponse(WeeklyAction action) {
        return new WeeklyActionResponse(
                action.getWeeklyActionId(),
                action.getActionTitle(),
                DEFAULT_SOURCE_LABEL,
                action.getActionType(),
                action.getActionDescription(),
                action.getPriorityOrder(),
                action.getServiceLinkId()
        );
    }

    private List<WeeklyActionResponse> placeholderActions() {
        return List.of(
                new WeeklyActionResponse(1L, "결과 요약에서 위험 지표 확인", DEFAULT_SOURCE_LABEL, ACTION_DATA_CHECK, "가장 높은 위험 점수와 임계값 초과 여부를 먼저 확인합니다.", 1, null),
                new WeeklyActionResponse(2L, "정책 지원 대상 여부 확인", DEFAULT_SOURCE_LABEL, ACTION_POLICY, "주거, 보육, 청년 지원 정책 중 즉시 신청 가능한 항목을 확인합니다.", 2, null),
                new WeeklyActionResponse(3L, "상담 또는 추가 시나리오 비교", DEFAULT_SOURCE_LABEL, ACTION_CONSULTING, "대안 시나리오를 한 번 더 비교하고 필요하면 상담으로 연결합니다.", 3, null)
        );
    }
}
