package com.pivotseoul.domain.simulation.controller;

import com.pivotseoul.domain.simulation.dto.CreateSessionRequest;
import com.pivotseoul.domain.simulation.dto.CreateSessionResponse;
import com.pivotseoul.domain.simulation.service.SimulationSessionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/simulations")
public class SimulationController {

    private final SimulationSessionService simulationSessionService;

    public SimulationController(SimulationSessionService simulationSessionService) {
        this.simulationSessionService = simulationSessionService;
    }

    @PostMapping("/sessions")
    public ResponseEntity<CreateSessionResponse> createSession(@RequestBody CreateSessionRequest request) {
        CreateSessionResponse response = simulationSessionService.createSession(request);
        return ResponseEntity.ok(response);
    }
}