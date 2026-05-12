"""FastAPI AI 엔진의 주요 기능 흐름을 검증하는 테스트입니다.

이 파일은 Spring 백엔드 없이 AI 서버만 독립적으로 실행 가능한지 확인하고,
마지막 테스트에서는 AI 내부 모듈들이 simulation flow에서 함께 연결되는지도 확인합니다.
"""

import sys
from pathlib import Path

# pytest를 repo root에서 실행해도 fastapi/lifePivot_ 패키지를 import할 수 있게 경로를 보정합니다.
PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from lifePivot_.app.main import app, health
from lifePivot_.app.modules.housing.schema import HousingRequest
from lifePivot_.app.modules.housing.service import HousingService
from lifePivot_.app.modules.llm_explanation.schema import LLMExplanationRequest
from lifePivot_.app.modules.llm_explanation.service import LLMExplanationService
from lifePivot_.app.modules.simulation.schema import SimulationRequest
from lifePivot_.app.modules.simulation.service import SimulationService


def test_fastapi_app_registers_major_ai_contract_routes():
    # Given: FastAPI 앱에 등록된 라우트 목록을 HTTP method + path 형태로 수집합니다.
    route_contract = {(next(iter(route.methods)), route.path) for route in app.routes if hasattr(route, "methods")}

    # Then: Spring AiGatewayService가 의존하는 주요 AI 기능 경로가 모두 살아있어야 합니다.
    assert ("GET", "/health") in route_contract
    assert ("POST", "/api/v1/housing/analyze") in route_contract
    assert ("POST", "/api/v1/career/recommend") in route_contract
    assert ("POST", "/api/v1/childcare/analyze") in route_contract
    assert ("POST", "/api/v1/senior/analyze") in route_contract
    assert ("POST", "/api/v1/policy/recommend") in route_contract
    assert ("POST", "/api/v1/simulation/run") in route_contract
    assert ("POST", "/api/v1/llm-explanation/generate") in route_contract


def test_ai_health_endpoint_contract_is_available_without_backend():
    # Then: FastAPI 단독 health check 응답 계약을 확인합니다.
    assert health() == {"status": "ok", "service": "fastapi"}


def test_ai_housing_pipeline_calculates_red_zone_result_independently():
    # When: 주거비가 소득의 45%인 입력을 AI 주거 서비스에 직접 전달합니다.
    result = HousingService().run(
        HousingRequest(
            district="서울 마포구",
            monthly_income=3_000_000,
            monthly_housing_cost=1_350_000,
        )
    )

    # Then: AI 주거 파이프라인이 지역명 정규화, RIR, red-zone 판단을 독립적으로 수행해야 합니다.
    assert result.district == "마포구"
    assert result.rir == 0.45
    assert result.housing_status == "danger"
    assert result.is_red_zone is True
    assert result.risk_score == 80
    assert result.confidence_score == 0.85


def test_ai_llm_explanation_pipeline_returns_safe_stub_independently():
    # When: LLM 설명 모듈에 사용자 맥락과 RAG snippet을 전달합니다.
    result = LLMExplanationService().run(
        LLMExplanationRequest(
            user_summary="청년 1인가구",
            metrics_summary="주거비 위험",
            rag_snippets=["서울시 청년 주거 지원"],
        )
    )

    # Then: 외부 LLM 연동 전에도 안전한 stub 설명을 반환해 전체 흐름이 끊기지 않아야 합니다.
    assert result.final_explanation == "(stub) 연결 후 생성됩니다."
    assert result.first_action_title is None
    assert result.first_action_link is None


def test_ai_integrated_simulation_runs_housing_career_and_explanation_modules_together():
    # When: simulation service에 생애단계/지역/직무 정보를 넣어 통합 AI flow를 실행합니다.
    result = SimulationService().run(
        SimulationRequest(
            life_stage="youth",
            district="서울 마포구",
            monthly_income=3_000_000,
            target_job="데이터 분석가",
            weekly_study_hours=8,
        )
    )

    # Then: 입력 정규화 결과가 응답에 남아 Spring 저장/감사 로직에서 재사용될 수 있어야 합니다.
    assert result.input_normalized == {
        "life_stage": "youth",
        "district": "서울 마포구",
        "target_job": "데이터 분석가",
    }

    # Then: 주요 AI 모듈들이 하나의 시뮬레이션 flow 안에서 모두 연결되어야 합니다.
    assert result.modules_used == [
        "housing",
        "career",
        "childcare",
        "senior",
        "policy",
        "llm_explanation",
    ]
    assert result.module_results["housing"]["district"] == "마포구"
    assert result.module_results["housing"]["housing_status"] == "unknown"
    assert result.module_results["career"]["target_job"] == "데이터 분석가"
    assert result.module_results["childcare"]["district"] == "서울 마포구"
    assert result.module_results["policy"]["query"] == "youth 서울 마포구 정책 데이터 분석가"
    assert result.final_explanation == "(stub) 연결 후 생성됩니다."
