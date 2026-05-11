package com.pivotseoul.domain.simulation.controller;

import com.pivotseoul.domain.simulation.dto.RunSimulationRequest;
import com.pivotseoul.domain.simulation.dto.RunSimulationResponse;
import com.pivotseoul.domain.simulation.service.SimulationEngineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 이 파일은 시뮬레이션을 실행하라는 '명령'을 받는 창구입니다.
 * 
 * 비전공자를 위한 설명:
 * 사용자가 웹사이트에서 "결과 보기"나 "시뮬레이션 시작" 버튼을 누르면 이리로 요청이 옵니다.
 * 이 컨트롤러는 직접 계산을 하기보다는, 'SimulationEngineService'라는 전문 기술자에게 
 * "사용자가 보낸 정보로 시뮬레이션을 돌려줘!"라고 요청을 전달하는 안내데스크 역할을 합니다.
 */
@RestController
@RequestMapping("/api/simulation-sessions")
public class SimulationRunController {

    private final SimulationEngineService simulationEngineService;

    public SimulationRunController(SimulationEngineService simulationEngineService) {
        this.simulationEngineService = simulationEngineService;
    }

    @PostMapping("/{sessionId}/run")
    public ResponseEntity<RunSimulationResponse> runSimulation(
            @PathVariable String sessionId,
            @RequestBody RunSimulationRequest request) {
        return simulationEngineService.runSimulation(sessionId, request);
    }
}
