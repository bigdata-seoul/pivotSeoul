from typing import Literal, Optional

from pydantic import BaseModel, Field


class UserInput(BaseModel):
    """1단계 사용자 입력·화면 기준 (선우 문서)."""

    life_stage: Literal["youth", "family", "senior"] = Field(
        ..., description="생애 단계"
    )
    district: str = Field(..., description="거주 자치구")
    monthly_income: int = Field(..., ge=0, description="월 소득(원)")
    target_job: str = Field(..., description="목표 직무 텍스트")
    weekly_study_hours: float = Field(
        default=0.0, ge=0, description="주간 학습 가능 시간"
    )
    child_age: Optional[int] = Field(
        default=None, description="자녀 나이(없으면 null)"
    )
