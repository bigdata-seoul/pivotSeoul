from pydantic import BaseModel, Field


class DistrictSummary(BaseModel):
    """7.1 district_summary — 자치구별 기본 지표."""

    district: str
    avg_monthly_rent: float | None = None
    avg_deposit: float | None = None
    public_housing_opportunity_score: float | None = Field(
        default=None, description="공공임대 공급 기회 점수"
    )
    childcare_supply_score: float | None = None
    care_center_count: int | None = None
    facility_access_score: float | None = None
