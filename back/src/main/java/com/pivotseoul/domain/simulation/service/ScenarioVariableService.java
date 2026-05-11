package com.pivotseoul.domain.simulation.service;

import com.pivotseoul.domain.simulation.dto.ScenarioVariableRequest;
import com.pivotseoul.domain.simulation.dto.ScenarioVariableResponse;
import com.pivotseoul.domain.simulation.entity.ScenarioVariable;
import com.pivotseoul.domain.simulation.repository.ScenarioRepository;
import com.pivotseoul.domain.simulation.repository.ScenarioVariableRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * [Service] 시나리오 변수
 *
 * 시나리오에 속한 조건 변수(소득, 보증금, 월세, 통근시간 등)의
 * 저장, 조회, 수정 비즈니스 로직을 담당한다.
 *
 * 변수 저장 방식: upsert 전략 사용
 * - 동일 시나리오 + 동일 varKey가 이미 존재하면 값 업데이트
 * - 없으면 신규 저장
 */
@Service
@Transactional(readOnly = true)
public class ScenarioVariableService {

    private final ScenarioVariableRepository scenarioVariableRepository;
    private final ScenarioRepository scenarioRepository;

    public ScenarioVariableService(
            ScenarioVariableRepository scenarioVariableRepository,
            ScenarioRepository scenarioRepository
    ) {
        this.scenarioVariableRepository = scenarioVariableRepository;
        this.scenarioRepository = scenarioRepository;
    }

    // ========================
    // 저장 (upsert)
    // ========================

    /**
     * 시나리오 변수 단건 저장 (upsert)
     *
     * - 동일 scenarioId + varKey가 존재하면 값 업데이트
     * - 없으면 신규 insert
     * TODO: 복수 변수 일괄 저장 시 saveAll로 성능 개선 가능
     *
     * @param scenarioId 시나리오 ID (PathVariable)
     * @param request    변수 저장 요청 DTO
     * @return 저장된 변수 응답 DTO
     */
    @Transactional
    public ScenarioVariableResponse saveVariable(Long scenarioId, ScenarioVariableRequest request) {

        // 시나리오 존재 여부 확인
        if (!scenarioRepository.existsById(scenarioId)) {
            throw new IllegalArgumentException(
                    "시나리오를 찾을 수 없습니다. scenarioId=" + scenarioId);
        }

        // 동일 키 존재 시 업데이트, 없으면 신규 생성 (upsert)
        ScenarioVariable variable = scenarioVariableRepository
                .findByScenarioIdAndVarKey(scenarioId, request.getVarKey())
                .map(existing -> {
                    existing.updateValue(request.getVarValue());
                    return existing;
                })
                .orElseGet(() -> request.toEntity(scenarioId));

        ScenarioVariable saved = scenarioVariableRepository.save(variable);
        return ScenarioVariableResponse.from(saved);
    }

    /**
     * 시나리오 변수 복수 저장 (upsert bulk)
     * POST /api/scenarios/{scenarioId}/variables/bulk
     *
     * - 입력된 변수 목록을 순서대로 upsert 처리
     * TODO: 복수 저장 API 엔드포인트 Controller에 추가 필요
     *
     * @param scenarioId 시나리오 ID
     * @param bulk       복수 변수 저장 요청 래퍼 DTO
     * @return 저장된 변수 응답 DTO 목록
     */
    @Transactional
    public List<ScenarioVariableResponse> saveVariables(
            Long scenarioId,
            ScenarioVariableRequest.Bulk bulk
    ) {
        return bulk.getVariables().stream()
                .map(request -> saveVariable(scenarioId, request))
                .collect(Collectors.toList());
    }

    // ========================
    // 조회
    // ========================

    /**
     * 시나리오 전체 변수 목록 조회
     * GET /api/scenarios/{scenarioId}/variables
     *
     * @param scenarioId 시나리오 ID
     * @return 변수 응답 DTO 목록
     */
    public List<ScenarioVariableResponse> getVariables(Long scenarioId) {
        return scenarioVariableRepository.findByScenarioId(scenarioId)
                .stream()
                .map(ScenarioVariableResponse::from)
                .collect(Collectors.toList());
    }
}