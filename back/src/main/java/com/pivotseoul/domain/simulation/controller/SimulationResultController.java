package com.pivotseoul.domain.simulation.controller;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.pivotseoul.domain.simulation.service.SimulationEngineService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/simulation")
public class SimulationResultController {

    // ===== 조회 설명 섹션 =====
    // 현재는 마지막 실행 결과를 메모리에서 읽습니다.
    // DB 저장이 연결되면 ScenarioResult/ThresholdResult 기반 조회 API로 교체합니다.

    private final SimulationEngineService simulationEngineService;

    public SimulationResultController(SimulationEngineService simulationEngineService) {
        this.simulationEngineService = simulationEngineService;
    }

    /**
     * 현재 단계에서는 DB 조회 대신 마지막 실행 결과를 반환합니다.
     * 이후 ScenarioResult/ThresholdResult 저장이 붙으면 repository 조회로 교체합니다.
     */
    @GetMapping("/results/latest")
    public ObjectNode latest() {
        return simulationEngineService.latestRun();
    }
}
