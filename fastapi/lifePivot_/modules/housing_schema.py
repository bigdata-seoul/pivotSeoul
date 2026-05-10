from pydantic import BaseModel


class HousingRequest(BaseModel):
    district: str
    monthly_income: int | None = None


class HousingResult(BaseModel):
    district: str
    rir: float | None = None
    housing_status: str = "pending"
