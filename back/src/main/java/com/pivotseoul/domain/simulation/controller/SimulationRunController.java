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
public class SimulationRunController {

    // ===== 연결 설명 섹션 =====
    // 프론트 결과 화면은 이 컨트롤러의 /runs만 호출합니다.
    // 실제 기능별 AI 호출은 SimulationEngineService가 Spring 내부에서 수행합니다.

    private final SimulationEngineService simulationEngineService;

    public SimulationRunController(SimulationEngineService simulationEngineService) {
        this.simulationEngineService = simulationEngineService;
    }

    /**
     * 운영 플로우 진입점입니다.
     * 프론트는 이 API만 호출하고, Spring이 내부에서 FastAPI AI 모듈들을 호출해 결과를 모읍니다.
     */
    @PostMapping("/runs")
    public ObjectNode run(@RequestBody(required = false) JsonNode body) {
        return simulationEngineService.runIntegratedSimulation(body);
    }
}
