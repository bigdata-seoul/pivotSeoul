package com.pivotseoul.domain.simulation.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.pivotseoul.domain.simulation.service.SimulationEngineService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/simulation")
public class SimulationSessionController {

    // ===== 세션 설명 섹션 =====
    // 입력 플로우가 Spring 운영 API로 들어오는 지점을 미리 열어둡니다.
    // 이후 SimulationSession/Scenario 저장과 연결하면 실제 운영 세션이 됩니다.

    private final SimulationEngineService simulationEngineService;

    public SimulationSessionController(SimulationEngineService simulationEngineService) {
        this.simulationEngineService = simulationEngineService;
    }

    /**
     * 세션 생성 진입점입니다. 현재는 비식별 요청 요약만 메모리 응답으로 돌려줍니다.
     */
    @PostMapping("/sessions")
    public ObjectNode create(@RequestBody(required = false) JsonNode body) {
        return simulationEngineService.createSession(body);
    }
}
