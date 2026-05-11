package com.pivotseoul.domain.simulation.controller;

import com.pivotseoul.domain.simulation.dto.ResultSummaryResponse;
import com.pivotseoul.domain.simulation.dto.SimulationResultResponse;
import com.pivotseoul.domain.simulation.dto.WeeklyActionResponse;
import com.pivotseoul.domain.simulation.service.SimulationResultService;
import com.pivotseoul.domain.simulation.service.WeeklyActionService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/simulation")
public class SimulationResultController {

    private final SimulationResultService simulationResultService;
    private final WeeklyActionService weeklyActionService;

    public SimulationResultController(
            SimulationResultService simulationResultService,
            WeeklyActionService weeklyActionService
    ) {
        this.simulationResultService = simulationResultService;
        this.weeklyActionService = weeklyActionService;
    }

    @GetMapping("/results/{scenarioResultId}")
    public SimulationResultResponse getResult(@PathVariable Long scenarioResultId) {
        return simulationResultService.getResult(scenarioResultId);
    }

    @GetMapping("/results/{scenarioResultId}/summary")
    public ResultSummaryResponse getSummary(@PathVariable Long scenarioResultId) {
        return simulationResultService.getSummary(scenarioResultId);
    }

    @GetMapping("/results")
    public List<ResultSummaryResponse> getResults(@RequestParam(required = false) Long simulationRunId) {
        return simulationResultService.getHistory(simulationRunId);
    }

    @GetMapping("/results/{scenarioResultId}/weekly-actions")
    public List<WeeklyActionResponse> getWeeklyActions(@PathVariable Long scenarioResultId) {
        return weeklyActionService.getWeeklyActions(scenarioResultId);
    }
}
