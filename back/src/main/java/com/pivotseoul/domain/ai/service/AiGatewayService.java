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
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * FastAPI(lifePivot_) 기능 모듈로 HTTP 프록시.
 * Spring은 요청 검증·응답 표준화·영속성 경계를 유지하고,
 * 실제 계산은 FastAPI 업스트림에 위임한다.
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

    private String url(String pathStartingWithSlash) {
        return fastApiBaseUrl + pathStartingWithSlash;
    }

    public ResponseEntity<JsonNode> postJson(String fastApiPath, JsonNode body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        JsonNode payload = body != null ? body : objectMapper.createObjectNode();
        HttpEntity<JsonNode> entity = new HttpEntity<>(payload, headers);

        try {
            return aiRestTemplate.exchange(
                    url(fastApiPath),
                    HttpMethod.POST,
                    entity,
                    JsonNode.class);
        } catch (HttpStatusCodeException e) {
            return upstreamError(e);
        } catch (ResourceAccessException e) {
            return unreachable(e);
        }
    }

    public ResponseEntity<JsonNode> getJson(String fastApiPath) {
        try {
            return aiRestTemplate.exchange(
                    url(fastApiPath),
                    HttpMethod.GET,
                    null,
                    JsonNode.class);
        } catch (HttpStatusCodeException e) {
            return upstreamError(e);
        } catch (ResourceAccessException e) {
            return unreachable(e);
        }
    }

    private ResponseEntity<JsonNode> unreachable(ResourceAccessException e) {
        ObjectNode err = objectMapper.createObjectNode();
        err.put("error", "FASTAPI_UNREACHABLE");
        err.put("detail", e.getMessage());
        err.put("upstream", fastApiBaseUrl);

        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(err);
    }

    private ResponseEntity<JsonNode> upstreamError(HttpStatusCodeException e) {
        ObjectNode err = objectMapper.createObjectNode();
        err.put("error", "FASTAPI_ERROR");
        err.put("status", e.getStatusCode().value());
        err.put("detail", e.getResponseBodyAsString());
        err.put("upstream", fastApiBaseUrl);

        return ResponseEntity.status(e.getStatusCode()).body(err);
    }

    /**
     * Gateway 상태와 FastAPI health 상태를 확인한다.
     */
    public Map<String, Object> bridgeStatus() {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("role", "gateway");
        m.put("fastapiBaseUrl", fastApiBaseUrl);
        m.put("pipelines", "fastapi/lifePivot_/app/modules/*/pipelines");

        try {
            ResponseEntity<String> health = aiRestTemplate.getForEntity(
                    url("/health"),
                    String.class);
            m.put("fastapiHealthHttpStatus", health.getStatusCode().value());
        } catch (Exception e) {
            m.put("fastapiHealthHttpStatus", "down");
            m.put("fastapiHealthError", e.getMessage());
        }

        return m;
    }

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