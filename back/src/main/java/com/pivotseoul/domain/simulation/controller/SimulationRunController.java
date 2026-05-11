package com.pivotseoul.domain.simulation.controller;

import com.pivotseoul.domain.simulation.dto.RunSimulationRequest;
import com.pivotseoul.domain.simulation.dto.RunSimulationResponse;
import com.pivotseoul.domain.simulation.service.SimulationEngineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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