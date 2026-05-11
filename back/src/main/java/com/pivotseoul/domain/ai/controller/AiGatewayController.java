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
 * 프론트/API 클라이언트가 AI 기능을 호출할 때 들어오는 Spring 게이트웨이 계층입니다.
 *
 * <p>전체 흐름:
 * <ol>
 *   <li>프론트는 {@code NEXT_PUBLIC_API_BASE}/api/ai/* 만 호출합니다.</li>
 *   <li>이 컨트롤러는 HTTP 메서드와 경로를 기능별 메서드로 받습니다.</li>
 *   <li>{@link AiGatewayService}가 FastAPI 기본 URL과 {@code /api/v1/*} 경로를 조합합니다.</li>
 *   <li>FastAPI 모듈 파이프라인이 계산한 JSON을 그대로 프론트에 반환합니다.</li>
 * </ol>
 *
 * <p>주의: 이 계층은 "프록시/경계"입니다. DB 저장·검증이 필요한 운영 플로우는
 * 향후 domain/simulation 서비스에서 이 서비스를 호출해 결과를 검증한 뒤 저장하는 방향입니다.
 */
@RestController
@RequestMapping("/api/ai")
public class AiGatewayController {

    private final AiGatewayService aiGatewayService;

    public AiGatewayController(AiGatewayService aiGatewayService) {
        this.aiGatewayService = aiGatewayService;
    }

    /**
     * 개발/운영 점검용: Spring 게이트웨이 설정과 FastAPI `/health` 연결 상태를 함께 확인합니다.
     */
    @GetMapping("/status")
    public Map<String, Object> status() {
        return aiGatewayService.bridgeStatus();
    }

    // 기능별 프록시 엔드포인트입니다. 요청 본문은 해석하지 않고 FastAPI 파이프라인으로 전달합니다.
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
