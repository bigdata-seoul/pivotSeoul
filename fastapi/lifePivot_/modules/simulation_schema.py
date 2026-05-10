from typing import Literal

from pydantic import BaseModel, Field


class SimulationRequest(BaseModel):
    life_stage: Literal["youth", "family", "senior"] = Field(..., description="생애 단계")
    district: str
    monthly_income: int = Field(..., ge=0)
    target_job: str
    weekly_study_hours: float = Field(default=0.0, ge=0)
    child_age: int | None = None


class SimulationResponse(BaseModel):
    input_normalized: dict[str, str]
    modules_used: list[str]
