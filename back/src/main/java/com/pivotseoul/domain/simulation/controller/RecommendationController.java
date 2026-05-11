package com.pivotseoul.domain.simulation.controller;

import com.pivotseoul.domain.simulation.dto.RecommendationResponse;
import com.pivotseoul.domain.simulation.service.RecommendationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/simulation")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping("/results/{scenarioResultId}/recommendations")
    public List<RecommendationResponse> getRecommendations(@PathVariable Long scenarioResultId) {
        return recommendationService.getRecommendations(scenarioResultId);
    }

    @PostMapping("/recommendations")
    public Map<String, List<RecommendationResponse>> buildRecommendations(@RequestBody Map<String, Object> request) {
        return Map.of("recommendations", recommendationService.buildRecommendations(request));
    }
}
