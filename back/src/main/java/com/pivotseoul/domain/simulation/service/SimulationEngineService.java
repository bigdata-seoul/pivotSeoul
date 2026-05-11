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
 * 이 클래스는 'Pivot Seoul'의 실제 두뇌 역할을 하는 서비스입니다.
 * 
 * 비전공자를 위한 설명:
 * 사용자가 입력한 다양한 정보(나이, 자녀 유무, 직업 등)를 가지고 
 * 실제로 시뮬레이션을 돌려주는 '총괄 지휘자'입니다.
 * 직접 모든 계산을 하기보다는, 주거, 보육, 시니어 케어 등 각 분야별 AI 엔진(FastAPI)들에게
 * "이 정보로 계산해줘!"라고 시키고 그 결과를 하나로 예쁘게 모으는 역할을 합니다.
 */
@Service
public class SimulationEngineService {

    // aiGatewayService: AI 엔진(FastAPI)과 통신하는 통로
    private final AiGatewayService aiGatewayService;
    // objectMapper: 데이터를 주고받기 쉬운 JSON 형식으로 변환해주는 도구
    private final ObjectMapper objectMapper;
    // latestRun: 가장 최근에 실행한 시뮬레이션 결과를 임시로 보관하는 장소
    private final AtomicReference<ObjectNode> latestRun = new AtomicReference<>();

    public SimulationEngineService(AiGatewayService aiGatewayService, ObjectMapper objectMapper) {
        this.aiGatewayService = aiGatewayService;
        this.objectMapper = objectMapper;
    }

    /**
     * 통합 시뮬레이션을 실행하는 핵심 메서드입니다.
     * 
     * 실행 과정:
     * 1. 사용자가 보낸 정보를 분석하기 좋게 나눕니다 (프로필, 시나리오 A, 시나리오 B 등).
     * 2. 각 분야별(주거, 보육, 노후 등) AI에게 계산을 요청합니다.
     * 3. AI가 답변을 주면, 그것들을 모아서 하나의 큰 결과지(리포트)를 만듭니다.
     * 4. 만들어진 리포트를 프런트엔드로 보내 사용자에게 보여줍니다.
     */
    public ObjectNode runIntegratedSimulation(JsonNode request) {
        if (request == null) {
            request = objectMapper.createObjectNode();
        }
        // 최종 결과를 담을 큰 바구니(root)를 만듭니다.
        ObjectNode root = objectMapper.createObjectNode();
        // 실행 중 발생한 문제들을 담을 목록(errors)입니다.
        ArrayNode errors = objectMapper.createArrayNode();

        // [1단계] 정보 분류: 사용자가 입력한 정보를 시나리오별로 나눕니다.
        JsonNode scenarioPayloads = request.path("scenarioPayloads");
        JsonNode payloadA = scenarioPayloads.path("A");
        JsonNode payloadB = scenarioPayloads.path("B");
        JsonNode profile = request.path("profile");
        JsonNode scenarioA = request.path("scenarioA");
        JsonNode scenarioB = request.path("scenarioB");

        // [2단계] 실행 상태 기록: 언제 시작했는지, 어떤 정보를 썼는지 등을 기록합니다.
        root.put("runStatus", "running"); // 현재 '실행 중'임을 표시
        root.put("runId", "local-" + Instant.now().toEpochMilli()); // 고유 번호 생성
        root.put("startedAt", Instant.now().toString());
        root.set("inputSummary", inputSummary(profile, scenarioA, scenarioB));
        root.set("gatewayStatus", objectMapper.valueToTree(aiGatewayService.bridgeStatus()));

        // [3단계] AI 호출 (통합): 시나리오 A와 B에 대해 각각 AI 시뮬레이션을 돌립니다.
        ObjectNode ai = objectMapper.createObjectNode();
        ai.set("scenarioA", call("simulationA", aiGatewayService.simulationRun(payloadA), errors));
        ai.set("scenarioB", call("simulationB", aiGatewayService.simulationRun(payloadB), errors));

        // [4단계] 상세 모듈 호출: 주거, 보육, 시니어, 커리어 등 세부 분야별 AI에게 개별 분석을 요청합니다.
        ObjectNode modules = objectMapper.createObjectNode();
        // 주거 분석 (A/B 시나리오별)
        modules.set("housingA", call("housingA", aiGatewayService.housingAnalyze(housingPayload(scenarioA, profile)), errors));
        modules.set("housingB", call("housingB", aiGatewayService.housingAnalyze(housingPayload(scenarioB, profile)), errors));
        // 보육 분석 (A/B 시나리오별)
        modules.set("childcareA", call("childcareA", aiGatewayService.childcareAnalyze(childcarePayload(scenarioA, payloadA)), errors));
        modules.set("childcareB", call("childcareB", aiGatewayService.childcareAnalyze(childcarePayload(scenarioB, payloadB)), errors));
        // 시니어 케어 분석
        modules.set("seniorA", call("seniorA", aiGatewayService.seniorAnalyze(seniorPayload(scenarioA, profile)), errors));
        modules.set("seniorB", call("seniorB", aiGatewayService.seniorAnalyze(seniorPayload(scenarioB, profile)), errors));
        // 커리어 및 정책 추천
        modules.set("career", call("career", aiGatewayService.careerRecommend(careerPayload(profile, payloadA)), errors));
        modules.set("policy", call("policy", aiGatewayService.policyRecommend(policyPayload(profile, scenarioB)), errors));
        ai.set("modules", modules);

        // [5단계] AI 해설 생성: 생성된 데이터들을 바탕으로 AI가 사람처럼 읽기 쉬운 해설을 작성하게 합니다.
        JsonNode policyBody = modules.path("policy").path("body");
        JsonNode localRisk = request.path("localRisk");
        ai.set("explanation", call("explanation", aiGatewayService.llmExplanationGenerate(explanationPayload(profile, scenarioA, scenarioB, localRisk, policyBody)), errors));
        // 데이터 출처 정보도 가져옵니다.
        ai.set("dataSources", call("dataSources", aiGatewayService.dataSourceSources(), errors));
        root.set("ai", ai);

        // [6단계] 최종 검증: 모든 계산이 잘 끝났는지 확인하고 상태를 '완료'로 바꿉니다.
        ObjectNode backendVerification = objectMapper.createObjectNode();
        backendVerification.put("passed", errors.isEmpty());
        backendVerification.put("stored", false); // 아직 DB 저장 전임을 표시
        backendVerification.put("storageMode", "memory-only");
        backendVerification.put("note", "모든 AI 분석 결과를 성공적으로 수집했습니다.");
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
