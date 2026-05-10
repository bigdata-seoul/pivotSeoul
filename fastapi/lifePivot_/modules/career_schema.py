from pydantic import BaseModel, Field


class CareerRequest(BaseModel):
    target_job: str
    weekly_study_hours: float = 0.0


class CareerResult(BaseModel):
    target_job: str
    recommendations: list[str] = Field(default_factory=list)
