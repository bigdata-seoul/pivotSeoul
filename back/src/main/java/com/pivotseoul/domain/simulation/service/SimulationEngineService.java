package com.pivotseoul.domain.simulation.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.pivotseoul.domain.ai.service.AiGatewayService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.concurrent.atomic.AtomicReference;

/**
 * Front → Spring 운영 API → Spring AI 게이트웨이 → FastAPI 전체 호출을 한 곳에서 조립합니다.
 *
 * <p>설명 섹션:
 * <ol>
 *   <li>프론트 요청을 비식별 실행 입력으로 해석합니다.</li>
 *   <li>Spring 내부에서 FastAPI 모듈별 AI API를 호출합니다.</li>
 *   <li>각 호출 결과를 성공/실패 메타와 함께 모읍니다.</li>
 *   <li>아직 DB 저장 전 단계이므로 최신 실행 결과를 메모리에 보관합니다.</li>
 * </ol>
 */
@Service
public class SimulationEngineService {

    // ===== 의존성 섹션: FastAPI 호출 경계와 JSON 조립 도구 =====
    private final AiGatewayService aiGatewayService;
    private final ObjectMapper objectMapper;
    private final AtomicReference<ObjectNode> latestRun = new AtomicReference<>();

    public SimulationEngineService(AiGatewayService aiGatewayService, ObjectMapper objectMapper) {
        this.aiGatewayService = aiGatewayService;
        this.objectMapper = objectMapper;
    }

    /**
     * 프론트는 운영 API인 `/api/simulation/runs`만 호출하고,
     * 이 서비스가 Spring 내부에서 FastAPI AI 게이트웨이를 순서대로 호출합니다.
     *
     * <p>아직 영속화 단계가 완성되기 전이므로 결과는 응답과 메모리 latestRun에만 보관합니다.
     * DB 저장은 이 메서드의 backendVerification 이후에 entity/repository 매핑을 붙이면 됩니다.
     */
    public ObjectNode runIntegratedSimulation(JsonNode request) {
        if (request == null) {
            request = objectMapper.createObjectNode();
        }
        ObjectNode root = objectMapper.createObjectNode();
        ArrayNode errors = objectMapper.createArrayNode();

        // ===== 1. 요청 분해 섹션: 프론트 payload를 profile / A / B 시나리오로 나눕니다. =====
        JsonNode scenarioPayloads = request.path("scenarioPayloads");
        JsonNode payloadA = scenarioPayloads.path("A");
        JsonNode payloadB = scenarioPayloads.path("B");
        JsonNode profile = request.path("profile");
        JsonNode scenarioA = request.path("scenarioA");
        JsonNode scenarioB = request.path("scenarioB");

        // ===== 2. 실행 메타 섹션: Spring 운영 API가 관리하는 run envelope를 만듭니다. =====
        root.put("runStatus", "running");
        root.put("runId", "local-" + Instant.now().toEpochMilli());
        root.put("startedAt", Instant.now().toString());
        root.set("inputSummary", inputSummary(profile, scenarioA, scenarioB));
        root.set("gatewayStatus", objectMapper.valueToTree(aiGatewayService.bridgeStatus()));

        // ===== 3. AI 오케스트레이션 섹션: FastAPI simulation 집계 결과를 A/B로 호출합니다. =====
        ObjectNode ai = objectMapper.createObjectNode();
        ai.set("scenarioA", call("simulationA", aiGatewayService.simulationRun(payloadA), errors));
        ai.set("scenarioB", call("simulationB", aiGatewayService.simulationRun(payloadB), errors));

        // ===== 4. 기능 모듈 섹션: ERD 기능 단위별 FastAPI 모듈을 Spring에서 모두 호출합니다. =====
        ObjectNode modules = objectMapper.createObjectNode();
        modules.set("housingA", call("housingA", aiGatewayService.housingAnalyze(housingPayload(scenarioA, profile)), errors));
        modules.set("housingB", call("housingB", aiGatewayService.housingAnalyze(housingPayload(scenarioB, profile)), errors));
        modules.set("childcareA", call("childcareA", aiGatewayService.childcareAnalyze(childcarePayload(scenarioA, payloadA)), errors));
        modules.set("childcareB", call("childcareB", aiGatewayService.childcareAnalyze(childcarePayload(scenarioB, payloadB)), errors));
        modules.set("seniorA", call("seniorA", aiGatewayService.seniorAnalyze(seniorPayload(scenarioA, profile)), errors));
        modules.set("seniorB", call("seniorB", aiGatewayService.seniorAnalyze(seniorPayload(scenarioB, profile)), errors));
        modules.set("career", call("career", aiGatewayService.careerRecommend(careerPayload(profile, payloadA)), errors));
        modules.set("policy", call("policy", aiGatewayService.policyRecommend(policyPayload(profile, scenarioB)), errors));
        ai.set("modules", modules);

        // ===== 5. 해설/출처 섹션: 정책 근거와 로컬 지표를 LLM 해설 및 데이터 출처 조회에 연결합니다. =====
        JsonNode policyBody = modules.path("policy").path("body");
        JsonNode localRisk = request.path("localRisk");
        ai.set("explanation", call("explanation", aiGatewayService.llmExplanationGenerate(explanationPayload(profile, scenarioA, scenarioB, localRisk, policyBody)), errors));
        ai.set("dataSources", call("dataSources", aiGatewayService.dataSourceSources(), errors));
        root.set("ai", ai);

        // ===== 6. Backend 검증 섹션: 현재는 실패 모듈 수집과 memory-only 저장 상태를 명시합니다. =====
        ObjectNode backendVerification = objectMapper.createObjectNode();
        backendVerification.put("passed", errors.isEmpty());
        backendVerification.put("stored", false);
        backendVerification.put("storageMode", "memory-only");
        backendVerification.put("note", "FastAPI 결과를 Spring 운영 API에서 수집했습니다. DB 영속화는 다음 단계에서 repository 매핑으로 연결합니다.");
        root.set("backendVerification", backendVerification);
        root.set("errors", errors);
        root.put("runStatus", errors.isEmpty() ? "completed" : "partial_failure");
        root.put("completedAt", Instant.now().toString());

        // ===== 7. 조회 연결 섹션: /api/simulation/results/latest가 반환할 최신 결과를 보관합니다. =====
        latestRun.set(root.deepCopy());
        return root;
    }

    /**
     * 결과 조회 섹션입니다.
     * 현재는 마지막 실행 결과를 반환하고, DB 저장이 붙으면 repository 조회로 교체합니다.
     */
    public ObjectNode latestRun() {
        ObjectNode latest = latestRun.get();
        if (latest == null) {
            ObjectNode empty = objectMapper.createObjectNode();
            empty.put("runStatus", "empty");
            empty.put("message", "아직 실행된 시뮬레이션 결과가 없습니다.");
            return empty;
        }
        return latest.deepCopy();
    }

    /**
     * 세션 생성 섹션입니다.
     * 현재는 운영 API 연결을 위해 세션 envelope만 반환하고, 이후 SimulationSession 저장으로 교체합니다.
     */
    public ObjectNode createSession(JsonNode request) {
        ObjectNode session = objectMapper.createObjectNode();
        session.put("sessionId", "local-session-" + Instant.now().toEpochMilli());
        session.put("sessionStatus", "created");
        session.put("storageMode", "memory-only");
        session.put("createdAt", Instant.now().toString());
        session.set("request", request == null ? objectMapper.createObjectNode() : request);
        return session;
    }

    /**
     * FastAPI 호출 결과 표준화 섹션입니다.
     * 성공/실패 여부를 같은 모양으로 감싸 프론트가 모듈별 상태를 표시할 수 있게 합니다.
     */
    private ObjectNode call(String name, ResponseEntity<JsonNode> response, ArrayNode errors) {
        ObjectNode node = objectMapper.createObjectNode();
        int status = response.getStatusCode().value();
        node.put("httpStatus", status);
        node.put("ok", response.getStatusCode().is2xxSuccessful());
        node.set("body", response.getBody() == null ? objectMapper.createObjectNode() : response.getBody());
        if (!response.getStatusCode().is2xxSuccessful()) {
            ObjectNode error = objectMapper.createObjectNode();
            error.put("module", name);
            error.put("httpStatus", status);
            error.set("body", node.path("body"));
            errors.add(error);
        }
        return node;
    }

    // ===== payload builder 섹션: 프론트 camelCase 입력을 FastAPI snake_case DTO로 변환합니다. =====
    private ObjectNode inputSummary(JsonNode profile, JsonNode scenarioA, JsonNode scenarioB) {
        ObjectNode node = objectMapper.createObjectNode();
        node.put("lifeStage", text(profile, "lifeStage", "family"));
        node.put("currentDistrict", text(scenarioA, "district", ""));
        node.put("compareDistrict", text(scenarioB, "district", ""));
        node.put("monthlyIncome", integer(profile, "monthlyIncome", 0));
        node.put("anonymized", true);
        return node;
    }

    private ObjectNode housingPayload(JsonNode scenario, JsonNode profile) {
        ObjectNode node = objectMapper.createObjectNode();
        node.put("district", text(scenario, "district", ""));
        node.put("monthly_income", integer(profile, "monthlyIncome", 0));
        return node;
    }

    private ObjectNode childcarePayload(JsonNode scenario, JsonNode simulationPayload) {
        ObjectNode node = objectMapper.createObjectNode();
        node.put("district", text(scenario, "district", ""));
        JsonNode childAge = simulationPayload.path("child_age");
        if (childAge.isNumber()) {
            node.put("child_age", childAge.asInt());
        } else {
            node.putNull("child_age");
        }
        return node;
    }

    private ObjectNode seniorPayload(JsonNode scenario, JsonNode profile) {
        ObjectNode node = objectMapper.createObjectNode();
        node.put("district", text(scenario, "district", ""));
        node.put("monthly_income", integer(profile, "monthlyIncome", 0));
        return node;
    }

    private ObjectNode careerPayload(JsonNode profile, JsonNode fallbackPayload) {
        ObjectNode node = objectMapper.createObjectNode();
        node.put("target_job", text(fallbackPayload, "target_job", targetJob(text(profile, "lifeStage", "family"))));
        node.put("weekly_study_hours", decimal(fallbackPayload, "weekly_study_hours", 2.0));
        return node;
    }

    private ObjectNode policyPayload(JsonNode profile, JsonNode scenarioB) {
        ObjectNode node = objectMapper.createObjectNode();
        node.put("query", text(profile, "lifeStage", "family") + " " + text(scenarioB, "district", "") + " 주거 보육 복지 정책");
        return node;
    }

    private ObjectNode explanationPayload(JsonNode profile, JsonNode scenarioA, JsonNode scenarioB, JsonNode localRisk, JsonNode policyBody) {
        ObjectNode node = objectMapper.createObjectNode();
        node.put("user_summary", text(profile, "name", "사용자") + " / " + text(profile, "lifeStage", "family") + " / " + text(scenarioA, "district", "") + " vs " + text(scenarioB, "district", ""));
        node.put("metrics_summary", localRisk.isMissingNode() ? "{}" : localRisk.toString());
        ArrayNode snippets = objectMapper.createArrayNode();
        JsonNode candidates = policyBody.path("candidates");
        if (candidates.isArray()) {
            candidates.forEach(candidate -> snippets.add(candidate));
        }
        if (snippets.isEmpty()) {
            snippets.add(policyPayload(profile, scenarioB).path("query").asText());
        }
        node.set("rag_snippets", snippets);
        return node;
    }

    // ===== 작은 변환 헬퍼 섹션: 기본값/타입/생애단계별 문구를 안전하게 보정합니다. =====
    private String targetJob(String lifeStage) {
        return switch (lifeStage) {
            case "senior" -> "노후 생활 안정";
            case "youth" -> "커리어 전환";
            default -> "복직 및 돌봄 병행";
        };
    }

    private String text(JsonNode node, String field, String fallback) {
        JsonNode value = node.path(field);
        return value.isTextual() && !value.asText().isBlank() ? value.asText() : fallback;
    }

    private int integer(JsonNode node, String field, int fallback) {
        JsonNode value = node.path(field);
        return value.isNumber() ? value.asInt() : fallback;
    }

    private double decimal(JsonNode node, String field, double fallback) {
        JsonNode value = node.path(field);
        return value.isNumber() ? value.asDouble() : fallback;
    }
}
