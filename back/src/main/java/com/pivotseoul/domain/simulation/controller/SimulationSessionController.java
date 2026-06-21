package com.pivotseoul.domain.simulation.controller;

import com.pivotseoul.domain.simulation.dto.CreateSessionRequest;
import com.pivotseoul.domain.simulation.dto.CreateSessionResponse;
import com.pivotseoul.domain.simulation.service.SimulationSessionService;
import com.pivotseoul.global.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/simulation")
public class SimulationSessionController {

    private final SimulationSessionService simulationSessionService;

    public SimulationSessionController(SimulationSessionService simulationSessionService) {
        this.simulationSessionService = simulationSessionService;
    }

    @PostMapping("/sessions")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<CreateSessionResponse> createSession(@RequestBody CreateSessionRequest request) {
        return ApiResponse.of(simulationSessionService.createSession(request));
    }
}
