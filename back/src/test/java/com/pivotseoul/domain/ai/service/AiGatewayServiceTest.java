package com.pivotseoul.domain.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.client.ExpectedCount.once;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.content;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withServerError;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

/**
 * Spring 백엔드와 FastAPI AI 서버 사이의 HTTP 연결 계약을 검증합니다.
 *
 * <p>{@link MockRestServiceServer}를 사용해 실제 네트워크 없이도
 * 백엔드가 어떤 FastAPI URL로 어떤 JSON을 보내는지 확인합니다.
 */
class AiGatewayServiceTest {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    @DisplayName("Backend gateway connects to the FastAPI housing endpoint with the same JSON contract")
    void housingAnalyzeForwardsRequestToFastApiAndReturnsResponse() throws Exception {
        // Given: RestTemplate 호출을 가로채는 mock FastAPI 서버와 게이트웨이 서비스를 준비합니다.
        RestTemplate restTemplate = new RestTemplate();
        MockRestServiceServer server = MockRestServiceServer.bindTo(restTemplate).build();
        AiGatewayService service = new AiGatewayService(
                restTemplate,
                objectMapper,
                "http://fastapi.local:8000/");
        JsonNode request = objectMapper.readTree("""
                {"district":"서울 마포구","monthly_income":3000000,"monthly_housing_cost":1350000}
                """);

        // Expect: 백엔드가 trailing slash를 정리한 FastAPI 주거 분석 URL로 원본 JSON을 전달해야 합니다.
        server.expect(once(), requestTo("http://fastapi.local:8000/api/v1/housing/analyze"))
                .andExpect(method(HttpMethod.POST))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().json("""
                        {"district":"서울 마포구","monthly_income":3000000,"monthly_housing_cost":1350000}
                        """))
                .andRespond(withSuccess("""
                        {
                          "district": "마포구",
                          "monthly_income": 3000000,
                          "monthly_housing_cost": 1350000,
                          "rir": 0.45,
                          "housing_status": "danger",
                          "is_red_zone": true,
                          "risk_score": 80,
                          "confidence_score": 0.9
                        }
                        """, MediaType.APPLICATION_JSON));

        // When: 백엔드 게이트웨이에서 AI 주거 분석 기능을 호출합니다.
        ResponseEntity<JsonNode> response = service.housingAnalyze(request);

        // Then: FastAPI 응답 JSON이 백엔드 응답으로 보존되는지 확인합니다.
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().path("district").asText()).isEqualTo("마포구");
        assertThat(response.getBody().path("housing_status").asText()).isEqualTo("danger");
        assertThat(response.getBody().path("is_red_zone").asBoolean()).isTrue();
        server.verify();
    }

    @Test
    @DisplayName("Backend gateway converts FastAPI failures into visible JSON errors")
    void fastApiErrorIsReturnedAsGatewayErrorJson() throws Exception {
        // Given: FastAPI career 기능이 500 오류를 반환하는 상황을 준비합니다.
        RestTemplate restTemplate = new RestTemplate();
        MockRestServiceServer server = MockRestServiceServer.bindTo(restTemplate).build();
        AiGatewayService service = new AiGatewayService(
                restTemplate,
                objectMapper,
                "http://fastapi.local:8000");

        // Expect: 백엔드는 AI 기능별 경로를 호출하고, 업스트림 오류 본문을 받습니다.
        server.expect(once(), requestTo("http://fastapi.local:8000/api/v1/career/recommend"))
                .andExpect(method(HttpMethod.POST))
                .andRespond(withServerError().body("{\"detail\":\"model failed\"}")
                        .contentType(MediaType.APPLICATION_JSON));

        // When: career 추천 프록시를 호출합니다.
        ResponseEntity<JsonNode> response = service.careerRecommend(objectMapper.createObjectNode());

        // Then: 프론트가 원인을 볼 수 있도록 FASTAPI_ERROR JSON으로 변환되는지 확인합니다.
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().path("error").asText()).isEqualTo("FASTAPI_ERROR");
        assertThat(response.getBody().path("status").asInt()).isEqualTo(500);
        assertThat(response.getBody().path("upstream").asText()).isEqualTo("http://fastapi.local:8000");
        server.verify();
    }
}
