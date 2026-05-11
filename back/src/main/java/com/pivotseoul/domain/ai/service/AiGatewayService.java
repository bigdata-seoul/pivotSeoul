package com.pivotseoul.domain.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Spring → FastAPI 연결을 담당하는 AI 게이트웨이 서비스입니다.
 *
 * <p>역할 분리:
 * <ul>
 *   <li>Spring: 인증, 입력 검증, 영속화, API 게이트웨이 경계</li>
 *   <li>FastAPI: 주거/커리어/보육/노년/정책/RAG/LLM 등 계산 파이프라인</li>
 * </ul>
 *
 * <p>현재는 FastAPI JSON을 그대로 통과시키는 얇은 프록시입니다.
 * 나중에 "시뮬레이션 실행"을 완성할 때는 domain/simulation 서비스가 이 클래스를 호출하고,
 * 응답 JSON을 DTO/Entity로 검증·저장한 뒤 사용자 조회 API로 노출하면 됩니다.
 */
@Service
public class AiGatewayService {

    private static final String API_V1 = "/api/v1";

    private final RestTemplate aiRestTemplate;
    private final ObjectMapper objectMapper;
    private final String fastApiBaseUrl;

    public AiGatewayService(
            @Qualifier("aiRestTemplate") RestTemplate aiRestTemplate,
            ObjectMapper objectMapper,
            @Value("${pivotseoul.ai.fastapi-base-url:http://127.0.0.1:8000}") String fastApiBaseUrl) {

        this.aiRestTemplate = aiRestTemplate;
        this.objectMapper = objectMapper;
        this.fastApiBaseUrl = trimTrailingSlash(fastApiBaseUrl);
    }

    private static String trimTrailingSlash(String url) {
        if (url == null || url.isEmpty()) {
            return "http://127.0.0.1:8000";
        }
        return url.endsWith("/") ? url.substring(0, url.length() - 1) : url;
    }

    /** FastAPI 기본 URL과 `/api/v1/...` 경로를 결합합니다. */
    private String url(String pathStartingWithSlash) {
        return fastApiBaseUrl + pathStartingWithSlash;
    }

    /**
     * POST 프록시 공통 처리.
     * 프론트가 보낸 JSON 본문을 Spring에서 재해석하지 않고 FastAPI로 전달합니다.
     */
    public ResponseEntity<JsonNode> postJson(String fastApiPath, JsonNode body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        JsonNode payload = body != null ? body : objectMapper.createObjectNode();
        HttpEntity<JsonNode> entity = new HttpEntity<>(payload, headers);
        try {
            return aiRestTemplate.exchange(url(fastApiPath), HttpMethod.POST, entity, JsonNode.class);
        } catch (ResourceAccessException e) {
            return unreachable(e);
        }
    }

    /** GET 프록시 공통 처리. 상태 조회/데이터 소스 조회처럼 본문이 없는 호출에 사용합니다. */
    public ResponseEntity<JsonNode> getJson(String fastApiPath) {
        try {
            return aiRestTemplate.exchange(url(fastApiPath), HttpMethod.GET, null, JsonNode.class);
        } catch (ResourceAccessException e) {
            return unreachable(e);
        }
    }

    /**
     * FastAPI가 내려가 있어도 Spring 자체는 503 JSON을 반환해 프론트에서 원인을 볼 수 있게 합니다.
     */
    private ResponseEntity<JsonNode> unreachable(ResourceAccessException e) {
        ObjectNode err = objectMapper.createObjectNode();
        err.put("error", "FASTAPI_UNREACHABLE");
        err.put("detail", e.getMessage());
        err.put("upstream", fastApiBaseUrl);
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(err);
    }

    /** 게이트웨이 메타 정보와 FastAPI {@code /health} 가용성을 함께 반환합니다. */
    public Map<String, Object> bridgeStatus() {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("role", "gateway");
        m.put("fastapiBaseUrl", fastApiBaseUrl);
        m.put("pipelines", "fastapi/lifePivot_/app/modules/*/pipelines");
        try {
            ResponseEntity<String> health = aiRestTemplate.getForEntity(url("/health"), String.class);
            m.put("fastapiHealthHttpStatus", health.getStatusCode().value());
        } catch (Exception e) {
            m.put("fastapiHealthHttpStatus", "down");
            m.put("fastapiHealthError", e.getMessage());
        }
        return m;
    }

    // 기능별 메서드는 "Spring 경로 ↔ FastAPI 경로" 매핑을 코드에서 명시하기 위한 얇은 래퍼입니다.
    public ResponseEntity<JsonNode> housingAnalyze(JsonNode body) {
        return postJson(API_V1 + "/housing/analyze", body);
    }

    public ResponseEntity<JsonNode> careerRecommend(JsonNode body) {
        return postJson(API_V1 + "/career/recommend", body);
    }

    public ResponseEntity<JsonNode> childcareAnalyze(JsonNode body) {
        return postJson(API_V1 + "/childcare/analyze", body);
    }

    public ResponseEntity<JsonNode> seniorAnalyze(JsonNode body) {
        return postJson(API_V1 + "/senior/analyze", body);
    }

    public ResponseEntity<JsonNode> policyRecommend(JsonNode body) {
        return postJson(API_V1 + "/policy/recommend", body);
    }

    public ResponseEntity<JsonNode> simulationRun(JsonNode body) {
        return postJson(API_V1 + "/simulation/run", body);
    }

    public ResponseEntity<JsonNode> llmExplanationGenerate(JsonNode body) {
        return postJson(API_V1 + "/llm-explanation/generate", body);
    }

    public ResponseEntity<JsonNode> dataSourceSources() {
        return getJson(API_V1 + "/data-source/sources");
    }

    public ResponseEntity<JsonNode> dataSourceIngest(JsonNode body) {
        return postJson(API_V1 + "/data-source/ingest", body);
    }
}
