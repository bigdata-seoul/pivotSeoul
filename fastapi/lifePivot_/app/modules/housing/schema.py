from pydantic import BaseModel, Field


class HousingRequest(BaseModel):
    district: str
    monthly_income: int | None = Field(default=None, ge=0)
    monthly_housing_cost: int | None = Field(default=None, ge=0)


class HousingResult(BaseModel):
    district: str
    monthly_income: int | None = None
    monthly_housing_cost: int | None = None
    rir: float | None = None
    housing_status: str = "pending"
    is_red_zone: bool = False