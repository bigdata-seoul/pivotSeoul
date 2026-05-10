package com.pivotseoul.domain.ai.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.pivotseoul.domain.ai.service.AiGatewayService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * 브라우저·관리도구는 이 컨트롤러만 호출하고, 여기서 기능별 FastAPI 경로로 프록시합니다.
 *
 * <p>매핑: {@code /api/ai/{기능}/...} → FastAPI {@code /api/v1/{기능}/...}
 */
@RestController
@RequestMapping("/api/ai")
public class AiGatewayController {

    private final AiGatewayService aiGatewayService;

    public AiGatewayController(AiGatewayService aiGatewayService) {
        this.aiGatewayService = aiGatewayService;
    }

    @GetMapping("/status")
    public Map<String, Object> status() {
        return aiGatewayService.bridgeStatus();
    }

    @PostMapping("/housing/analyze")
    public ResponseEntity<JsonNode> housingAnalyze(@RequestBody(required = false) JsonNode body) {
        return aiGatewayService.housingAnalyze(body);
    }

    @PostMapping("/career/recommend")
    public ResponseEntity<JsonNode> careerRecommend(@RequestBody(required = false) JsonNode body) {
        return aiGatewayService.careerRecommend(body);
    }

    @PostMapping("/childcare/analyze")
    public ResponseEntity<JsonNode> childcareAnalyze(@RequestBody(required = false) JsonNode body) {
        return aiGatewayService.childcareAnalyze(body);
    }

    @PostMapping("/senior/analyze")
    public ResponseEntity<JsonNode> seniorAnalyze(@RequestBody(required = false) JsonNode body) {
        return aiGatewayService.seniorAnalyze(body);
    }

    @PostMapping("/policy/recommend")
    public ResponseEntity<JsonNode> policyRecommend(@RequestBody(required = false) JsonNode body) {
        return aiGatewayService.policyRecommend(body);
    }

    @PostMapping("/simulation/run")
    public ResponseEntity<JsonNode> simulationRun(@RequestBody(required = false) JsonNode body) {
        return aiGatewayService.simulationRun(body);
    }

    @PostMapping("/llm-explanation/generate")
    public ResponseEntity<JsonNode> llmExplanationGenerate(@RequestBody(required = false) JsonNode body) {
        return aiGatewayService.llmExplanationGenerate(body);
    }

    @GetMapping("/data-source/sources")
    public ResponseEntity<JsonNode> dataSourceSources() {
        return aiGatewayService.dataSourceSources();
    }

    @PostMapping("/data-source/ingest")
    public ResponseEntity<JsonNode> dataSourceIngest(@RequestBody(required = false) JsonNode body) {
        return aiGatewayService.dataSourceIngest(body);
    }
}
