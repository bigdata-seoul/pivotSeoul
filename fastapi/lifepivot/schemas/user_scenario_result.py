from typing import Literal

from pydantic import BaseModel, Field


class UserScenarioResult(BaseModel):
    """7.2 user_scenario_result — A/B 시나리오 결과."""

    user_id: str | None = None
    scenario: Literal["A", "B"]
    district: str
    RIR: float | None = Field(default=None, description="주거비 부담률")
    housing_status: str | None = None
    care_score: float | None = None
    career_score: float | None = None
    policy_score: float | None = None
    total_score: float | None = None
    threshold_status: str | None = Field(
        default=None, description="최종 임계점 판정"
    )
