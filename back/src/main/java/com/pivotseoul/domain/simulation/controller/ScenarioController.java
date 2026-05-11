package com.pivotseoul.domain.simulation.controller;

import com.pivotseoul.domain.simulation.dto.CreateScenarioRequest;
import com.pivotseoul.domain.simulation.dto.CreateScenarioResponse;
import com.pivotseoul.domain.simulation.dto.ScenarioSummaryResponse;
import com.pivotseoul.domain.simulation.dto.ScenarioVariableRequest;
import com.pivotseoul.domain.simulation.dto.ScenarioVariableResponse;
import com.pivotseoul.domain.simulation.service.ScenarioService;
import com.pivotseoul.domain.simulation.service.ScenarioVariableService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * [Controller] 시나리오
 *
 * 시나리오 및 시나리오 변수에 대한 REST API 엔드포인트를 제공한다.
 *
 * 현재 엔드포인트:
 *   POST   /api/simulations/{sessionId}/scenarios        - 시나리오 생성
 *   GET    /api/simulations/{sessionId}/scenarios        - 세션 내 시나리오 목록 조회
 *   GET    /api/scenarios/{scenarioId}                   - 시나리오 단건 조회
 *   PATCH  /api/scenarios/{scenarioId}                   - 시나리오 수정
 *   DELETE /api/scenarios/{scenarioId}                   - 시나리오 삭제
 *   POST   /api/scenarios/{scenarioId}/variables         - 변수 단건 저장
 *   POST   /api/scenarios/{scenarioId}/variables/bulk    - 변수 복수 저장 (TODO)
 *   GET    /api/scenarios/{scenarioId}/variables         - 변수 목록 조회
 *
 * TODO 추후 엔드포인트:
 *   POST   /api/scenarios/{scenarioId}/copy              - 시나리오 복사
 *   POST   /api/scenarios/compare                        - 다중 시나리오 비교
 *   GET    /api/scenarios/{scenarioId}/versions          - 시나리오 버전 이력
 */
@RestController
public class ScenarioController {

    private final ScenarioService scenarioService;
    private final ScenarioVariableService scenarioVariableService;

    public ScenarioController(
            ScenarioService scenarioService,
            ScenarioVariableService scenarioVariableService
    ) {
        this.scenarioService = scenarioService;
        this.scenarioVariableService = scenarioVariableService;
    }

    // ========================
    // 시나리오 CRUD
    // ========================

    /**
     * 시나리오 생성
     * POST /api/simulations/{sessionId}/scenarios
     */
    @PostMapping("/api/simulations/{sessionId}/scenarios")
    public ResponseEntity<CreateScenarioResponse> createScenario(
            @PathVariable Long sessionId,
            @RequestBody CreateScenarioRequest request
    ) {
        CreateScenarioResponse response = scenarioService.createScenario(sessionId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * 세션 내 시나리오 목록 조회
     * GET /api/simulations/{sessionId}/scenarios
     */
    @GetMapping("/api/simulations/{sessionId}/scenarios")
    public ResponseEntity<List<ScenarioSummaryResponse>> getScenariosBySession(
            @PathVariable Long sessionId
    ) {
        List<ScenarioSummaryResponse> response = scenarioService.getScenariosBySession(sessionId);
        return ResponseEntity.ok(response);
    }

    /**
     * 시나리오 단건 상세 조회
     * GET /api/scenarios/{scenarioId}
     */
    @GetMapping("/api/scenarios/{scenarioId}")
    public ResponseEntity<ScenarioSummaryResponse> getScenario(
            @PathVariable Long scenarioId
    ) {
        ScenarioSummaryResponse response = scenarioService.getScenario(scenarioId);
        return ResponseEntity.ok(response);
    }

    /**
     * 시나리오 수정 (제목, 지역, 표시 순서)
     * PATCH /api/scenarios/{scenarioId}
     */
    @PatchMapping("/api/scenarios/{scenarioId}")
    public ResponseEntity<ScenarioSummaryResponse> updateScenario(
            @PathVariable Long scenarioId,
            @RequestBody CreateScenarioRequest request
    ) {
        ScenarioSummaryResponse response = scenarioService.updateScenario(scenarioId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * 시나리오 삭제 (연관 변수 포함)
     * DELETE /api/scenarios/{scenarioId}
     */
    @DeleteMapping("/api/scenarios/{scenarioId}")
    public ResponseEntity<Void> deleteScenario(
            @PathVariable Long scenarioId
    ) {
        scenarioService.deleteScenario(scenarioId);
        return ResponseEntity.noContent().build(); // 204 No Content
    }

    // ========================
    // 시나리오 변수
    // ========================

    /**
     * 변수 단건 저장 (upsert)
     * POST /api/scenarios/{scenarioId}/variables
     */
    @PostMapping("/api/scenarios/{scenarioId}/variables")
    public ResponseEntity<ScenarioVariableResponse> saveVariable(
            @PathVariable Long scenarioId,
            @RequestBody ScenarioVariableRequest request
    ) {
        ScenarioVariableResponse response =
                scenarioVariableService.saveVariable(scenarioId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * 변수 복수 저장 (upsert bulk)
     * POST /api/scenarios/{scenarioId}/variables/bulk
     * TODO: 프론트 변수 일괄 저장 구현 시 연동
     */
    @PostMapping("/api/scenarios/{scenarioId}/variables/bulk")
    public ResponseEntity<List<ScenarioVariableResponse>> saveVariables(
            @PathVariable Long scenarioId,
            @RequestBody ScenarioVariableRequest.Bulk request
    ) {
        List<ScenarioVariableResponse> response =
                scenarioVariableService.saveVariables(scenarioId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * 변수 목록 조회
     * GET /api/scenarios/{scenarioId}/variables
     */
    @GetMapping("/api/scenarios/{scenarioId}/variables")
    public ResponseEntity<List<ScenarioVariableResponse>> getVariables(
            @PathVariable Long scenarioId
    ) {
        List<ScenarioVariableResponse> response =
                scenarioVariableService.getVariables(scenarioId);
        return ResponseEntity.ok(response);
    }
}