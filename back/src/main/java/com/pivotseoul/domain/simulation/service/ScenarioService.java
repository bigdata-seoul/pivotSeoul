package com.pivotseoul.domain.simulation.service;

import com.pivotseoul.domain.simulation.dto.CreateScenarioRequest;
import com.pivotseoul.domain.simulation.dto.CreateScenarioResponse;
import com.pivotseoul.domain.simulation.dto.ScenarioSummaryResponse;
import com.pivotseoul.domain.simulation.entity.Scenario;
import com.pivotseoul.domain.simulation.entity.ScenarioVariable;
import com.pivotseoul.domain.simulation.repository.ScenarioRepository;
import com.pivotseoul.domain.simulation.repository.ScenarioVariableRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * [Service] 시나리오
 *
 * 시나리오의 생성, 조회, 수정, 삭제 비즈니스 로직을 담당한다.
 * ScenarioVariableService와 협력해 시나리오 요약(변수 포함) 응답을 구성한다.
 */
@Service
@Transactional(readOnly = true) // 기본 읽기 전용 — 쓰기 메서드에는 개별 @Transactional 적용
public class ScenarioService {

    private final ScenarioRepository scenarioRepository;
    private final ScenarioVariableRepository scenarioVariableRepository;

    public ScenarioService(
            ScenarioRepository scenarioRepository,
            ScenarioVariableRepository scenarioVariableRepository
    ) {
        this.scenarioRepository = scenarioRepository;
        this.scenarioVariableRepository = scenarioVariableRepository;
    }

    // ========================
    // 생성
    // ========================

    /**
     * 시나리오 생성
     * POST /api/simulations/{sessionId}/scenarios
     *
     * - scenarioTitle이 없으면 자동 생성
     * - displayOrder가 없으면 현재 시나리오 수 기반으로 자동 부여
     *
     * @param sessionId 세션 ID (PathVariable)
     * @param request   시나리오 생성 요청 DTO
     * @return 생성된 시나리오 응답 DTO
     */
    @Transactional
    public CreateScenarioResponse createScenario(Long sessionId, CreateScenarioRequest request) {

        // 제목 미입력 시 자동 생성 (예: "시나리오 1")
        if (request.getScenarioTitle() == null || request.getScenarioTitle().isBlank()) {
            int count = scenarioRepository.countBySessionId(sessionId);
            request.setScenarioTitle("시나리오 " + (count + 1));
        }

        // 표시 순서 미입력 시 현재 개수 기반 자동 부여
        if (request.getDisplayOrder() == null) {
            int count = scenarioRepository.countBySessionId(sessionId);
            request.setDisplayOrder(count + 1);
        }

        Scenario saved = scenarioRepository.save(request.toEntity(sessionId));
        return CreateScenarioResponse.from(saved);
    }

    // ========================
    // 조회
    // ========================

    /**
     * 세션 내 시나리오 목록 조회 (변수 포함 요약)
     * GET /api/simulations/{sessionId}/scenarios
     *
     * @param sessionId 세션 ID (PathVariable)
     * @return 시나리오 요약 응답 DTO 목록 (표시 순서 정렬)
     */
    public List<ScenarioSummaryResponse> getScenariosBySession(Long sessionId) {
        List<Scenario> scenarios = scenarioRepository
                .findBySessionIdOrderByDisplayOrderAsc(sessionId);

        return scenarios.stream()
                .map(scenario -> {
                    // 시나리오별 변수 목록 조회 후 요약 응답 구성
                    List<ScenarioVariable> variables =
                            scenarioVariableRepository.findByScenarioId(scenario.getScenarioId());
                    return ScenarioSummaryResponse.from(scenario, variables);
                })
                .collect(Collectors.toList());
    }

    /**
     * 시나리오 단건 상세 조회 (변수 포함 요약)
     * GET /api/scenarios/{scenarioId}
     *
     * @param scenarioId 시나리오 ID (PathVariable)
     * @return 시나리오 요약 응답 DTO
     * @throws IllegalArgumentException 시나리오가 존재하지 않을 경우
     */
    public ScenarioSummaryResponse getScenario(Long scenarioId) {
        Scenario scenario = scenarioRepository.findById(scenarioId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "시나리오를 찾을 수 없습니다. scenarioId=" + scenarioId));

        List<ScenarioVariable> variables =
                scenarioVariableRepository.findByScenarioId(scenarioId);

        return ScenarioSummaryResponse.from(scenario, variables);
    }

    // ========================
    // 수정
    // ========================

    /**
     * 시나리오 수정 (제목, 지역, 표시 순서)
     * PATCH /api/scenarios/{scenarioId}
     *
     * - 변수 수정은 ScenarioVariableService에서 별도 처리
     *
     * @param scenarioId 수정할 시나리오 ID
     * @param request    수정 요청 DTO (CreateScenarioRequest 재사용)
     * @return 수정된 시나리오 요약 응답 DTO
     */
    @Transactional
    public ScenarioSummaryResponse updateScenario(Long scenarioId, CreateScenarioRequest request) {
        Scenario scenario = scenarioRepository.findById(scenarioId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "시나리오를 찾을 수 없습니다. scenarioId=" + scenarioId));

        // 엔티티 내부 update 메서드로 변경 — dirty checking으로 자동 반영
        scenario.update(
                request.getScenarioTitle(),
                request.getCurrentDistrictId(),
                request.getCompareDistrictId(),
                request.getDisplayOrder()
        );

        List<ScenarioVariable> variables =
                scenarioVariableRepository.findByScenarioId(scenarioId);

        return ScenarioSummaryResponse.from(scenario, variables);
    }

    // ========================
    // 삭제
    // ========================

    /**
     * 시나리오 삭제
     * DELETE /api/scenarios/{scenarioId}
     *
     * - 연관된 ScenarioVariable도 함께 삭제
     * TODO: Cascade 전략 적용 시 deleteByScenarioId 호출 제거
     *
     * @param scenarioId 삭제할 시나리오 ID
     */
    @Transactional
    public void deleteScenario(Long scenarioId) {
        // 존재 여부 확인
        if (!scenarioRepository.existsById(scenarioId)) {
            throw new IllegalArgumentException(
                    "시나리오를 찾을 수 없습니다. scenarioId=" + scenarioId);
        }

        // 연관 변수 먼저 삭제 후 시나리오 삭제
        scenarioVariableRepository.deleteByScenarioId(scenarioId);
        scenarioRepository.deleteById(scenarioId);
    }
}