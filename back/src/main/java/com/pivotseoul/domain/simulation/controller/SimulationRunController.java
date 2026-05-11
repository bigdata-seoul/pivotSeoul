package com.pivotseoul.domain.simulation.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.pivotseoul.domain.simulation.service.SimulationEngineService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 이 파일은 시뮬레이션을 실행하라는 '명령'을 받는 창구입니다.
 * 
 * 비전공자를 위한 설명:
 * 사용자가 웹사이트에서 "결과 보기"나 "시뮬레이션 시작" 버튼을 누르면 이리로 요청이 옵니다.
 * 이 컨트롤러는 직접 계산을 하기보다는, 'SimulationEngineService'라는 전문 기술자에게 
 * "사용자가 보낸 정보로 시뮬레이션을 돌려줘!"라고 요청을 전달하는 안내데스크 역할을 합니다.
 */
@RestController
@RequestMapping("/api/simulation")
public class SimulationRunController {

    private final SimulationEngineService simulationEngineService;

    // 프로그램이 실행될 때 필요한 기술자(Service)를 미리 준비해둡니다.
    public SimulationRunController(SimulationEngineService simulationEngineService) {
        this.simulationEngineService = simulationEngineService;
    }

    /**
     * 시뮬레이션 실행 API (/api/simulation/runs)
     * 
     * 실행 흐름:
     * 1. 사용자가 입력한 데이터(나이, 수입, 거주지 등)를 body라는 바구니에 담아 보냅니다.
     * 2. 이 메서드가 그 바구니를 받아서 기술자(simulationEngineService)에게 넘깁니다.
     * 3. 기술자가 AI 엔진(FastAPI)과 협력하여 결과를 만들어내면, 그 결과물을 다시 사용자에게 돌려줍니다.
     */
    @PostMapping("/runs")
    public ObjectNode run(@RequestBody(required = false) JsonNode body) {
        // 실제 복잡한 통합 시뮬레이션 계산을 수행하고 결과를 반환합니다.
        return simulationEngineService.runIntegratedSimulation(body);
    }
}
