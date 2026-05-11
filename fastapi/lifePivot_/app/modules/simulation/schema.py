from typing import Any, Literal

from pydantic import BaseModel, Field


# ===== Spring → FastAPI 요청 DTO 섹션 =====
# Spring SimulationEngineService가 보내는 비식별 시나리오 입력입니다.
class SimulationRequest(BaseModel):
    life_stage: Literal["youth", "family", "senior"] = Field(..., description="생애 단계")
    district: str
    monthly_income: int = Field(..., ge=0)
    target_job: str
    weekly_study_hours: float = Field(default=0.0, ge=0)
    child_age: int | None = None


# ===== FastAPI → Spring 응답 DTO 섹션 =====
# Spring이 검증/저장/화면 응답으로 재가공할 수 있게 모듈 결과와 해설을 함께 반환합니다.
class SimulationResponse(BaseModel):
    input_normalized: dict[str, str]
    modules_used: list[str]
    module_results: dict[str, Any] = Field(default_factory=dict)
    final_explanation: str | None = None
    first_action_title: str | None = None
    first_action_link: str | None = None
