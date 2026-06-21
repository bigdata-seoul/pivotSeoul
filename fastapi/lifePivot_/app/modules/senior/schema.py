from pydantic import BaseModel


class SeniorRequest(BaseModel):
    district: str
    monthly_income: int | None = None


class SeniorResult(BaseModel):
    district: str
    threshold_status: str = "pending"
