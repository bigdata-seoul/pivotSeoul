package com.pivotseoul.domain.ai.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pivotseoul.domain.ai.service.AiGatewayService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Spring 백엔드의 AI 게이트웨이 컨트롤러 기능 테스트입니다.
 *
 * <p>여기서는 FastAPI를 실제로 띄우지 않고 {@link AiGatewayService}를 mock 처리합니다.
 * 따라서 "백엔드 API 라우팅/응답 계약이 맞는지"를 빠르게 확인할 수 있습니다.
 */
class AiGatewayControllerTest {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    @DisplayName("AI status is served by the Spring backend gateway without calling domain logic directly")
    void statusReturnsBackendGatewayState() throws Exception {
        // Given: FastAPI health 확인 결과를 포함한 게이트웨이 상태 응답을 준비합니다.
        AiGatewayService aiGatewayService = mock(AiGatewayService.class);
        when(aiGatewayService.bridgeStatus()).thenReturn(Map.of(
                "role", "gateway",
                "fastapiBaseUrl", "http://ai-service:8000",
                "fastapiHealthHttpStatus", 200));
        MockMvc mockMvc = MockMvcBuilders
                .standaloneSetup(new AiGatewayController(aiGatewayService))
                .build();

        // When & Then: 백엔드 단독으로 /api/ai/status 계약을 지키는지 확인합니다.
        mockMvc.perform(get("/api/ai/status"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("gateway"))
                .andExpect(jsonPath("$.fastapiBaseUrl").value("http://ai-service:8000"))
                .andExpect(jsonPath("$.fastapiHealthHttpStatus").value(200));
    }

    @Test
    @DisplayName("Backend AI proxy accepts housing requests and returns the AI payload unchanged")
    void housingAnalyzeProxiesThroughBackendEndpoint() throws Exception {
        // Given: AI 주거 분석 결과가 돌아온 상황을 백엔드 게이트웨이 응답으로 고정합니다.
        AiGatewayService aiGatewayService = mock(AiGatewayService.class);
        JsonNode aiPayload = objectMapper.readTree("""
                {
                  "district": "마포구",
                  "rir": 0.45,
                  "housing_status": "danger",
                  "is_red_zone": true,
                  "risk_score": 80
                }
                """);
        when(aiGatewayService.housingAnalyze(any(JsonNode.class)))
                .thenReturn(ResponseEntity.ok(aiPayload));
        MockMvc mockMvc = MockMvcBuilders
                .standaloneSetup(new AiGatewayController(aiGatewayService))
                .build();

        // When & Then: 프론트가 호출하는 백엔드 경로가 AI payload를 그대로 JSON으로 반환하는지 검증합니다.
        mockMvc.perform(post("/api/ai/housing/analyze")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"district":"서울 마포구","monthly_income":3000000,"monthly_housing_cost":1350000}
                                """))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.district").value("마포구"))
                .andExpect(jsonPath("$.housing_status").value("danger"))
                .andExpect(jsonPath("$.is_red_zone").value(true))
                .andExpect(jsonPath("$.risk_score").value(80));

        // Then: 컨트롤러가 직접 계산하지 않고 게이트웨이 서비스에 위임했는지 확인합니다.
        verify(aiGatewayService).housingAnalyze(any(JsonNode.class));
    }
}
