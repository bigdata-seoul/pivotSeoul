"""시뮬레이션 오케스트레이션 흐름입니다.

예상되는 전체 흐름:
1. Spring이 시뮬레이션 실행 요청을 받고 저장된 세션/시나리오 데이터를 불러올 수 있습니다.
2. Spring이 AiGatewayService를 통해 FastAPI `/api/v1/simulation/run`을 호출합니다.
3. 이 흐름은 입력을 정규화하고 기능 모듈들을 조율합니다.
4. 응답에는 어떤 모듈이 결과에 기여했는지 담겨 Spring이 감사/저장에 활용할 수 있습니다.

현재 구현은 각 기능 파이프라인이 아직 가볍거나 스텁 상태여도 모든 기능 서비스를 서로 연결합니다.
그래야 지금 제품 흐름이 끊기지 않고, 이후 Spring/프론트 경로를 바꾸지 않아도 각 모듈을 고도화할 수 있습니다.
"""

from lifePivot_.app.modules.career.schema import CareerRequest
from lifePivot_.app.modules.career.service import CareerService
from lifePivot_.app.modules.childcare.schema import ChildcareRequest
from lifePivot_.app.modules.childcare.service import ChildcareService
from lifePivot_.app.modules.housing.schema import HousingRequest
from lifePivot_.app.modules.housing.service import HousingService
from lifePivot_.app.modules.llm_explanation.schema import LLMExplanationRequest
from lifePivot_.app.modules.llm_explanation.service import LLMExplanationService
from lifePivot_.app.modules.policy.schema import PolicyRequest
from lifePivot_.app.modules.policy.service import PolicyService
from lifePivot_.app.modules.senior.schema import SeniorRequest
from lifePivot_.app.modules.senior.service import SeniorService
from lifePivot_.app.modules.simulation.schema import SimulationRequest, SimulationResponse

# ===== 서비스 조립 섹션 =====
# 각 기능 모듈의 service를 모아 simulation flow에서 순서대로 호출합니다.
housing_service = HousingService()
career_service = CareerService()
childcare_service = ChildcareService()
senior_service = SeniorService()
policy_service = PolicyService()
llm_service = LLMExplanationService()


# ===== 응답 변환 섹션 =====
# Pydantic 버전에 상관없이 Spring으로 보낼 dict 형태로 맞춥니다.
def _dump(model: object) -> dict[str, object]:
    """Pydantic v1/v2 모두에서 동작하는 모델→dict 변환 헬퍼입니다."""
    if hasattr(model, "model_dump"):
        return getattr(model, "model_dump")()
    if hasattr(model, "dict"):
        return getattr(model, "dict")()
    return dict(model) if isinstance(model, dict) else {"value": model}


# ===== 오케스트레이션 섹션 =====
# Spring에서 받은 비식별 Scenario DTO 하나를 기능별 계산 결과와 LLM 해설로 확장합니다.
def run_simulation_flow(request: SimulationRequest) -> SimulationResponse:
    # 1단계: 모듈별 점수를 계산하기 전에 사용자/세션 입력을 정규화합니다.
    district = request.district.strip()
    target_job = request.target_job.strip()

    # 2단계: 각 기능 모듈은 서비스 경계를 통해 호출합니다.
    # 라우트용 스키마와 파이프라인 호출은 각 서비스가 책임지고, 오케스트레이터는 결과만 합칩니다.
    housing = housing_service.run(HousingRequest(district=district, monthly_income=request.monthly_income))
    career = career_service.run(
        CareerRequest(target_job=target_job, weekly_study_hours=request.weekly_study_hours)
    )
    childcare = childcare_service.run(ChildcareRequest(district=district, child_age=request.child_age))
    senior = senior_service.run(SeniorRequest(district=district, monthly_income=request.monthly_income))
    policy = policy_service.run(PolicyRequest(query=f"{request.life_stage} {district} 정책 {target_job}"))

    module_results = {
        "housing": _dump(housing),
        "career": _dump(career),
        "childcare": _dump(childcare),
        "senior": _dump(senior),
        "policy": _dump(policy),
    }

    # 3단계: 정규화된 사용자 맥락과 모듈 출력값을 바탕으로 서술형 해설을 생성합니다.
    explanation = llm_service.run(
        LLMExplanationRequest(
            user_summary=f"life_stage={request.life_stage}, district={district}, target_job={target_job}",
            metrics_summary=str(module_results),
            rag_snippets=policy.candidates,
        )
    )

    return SimulationResponse(
        input_normalized={
            "life_stage": request.life_stage,
            "district": district,
            "target_job": target_job,
        },
        modules_used=["housing", "career", "childcare", "senior", "policy", "llm_explanation"],
        module_results=module_results,
        final_explanation=explanation.final_explanation,
        first_action_title=explanation.first_action_title,
        first_action_link=explanation.first_action_link,
    )
