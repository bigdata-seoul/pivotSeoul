from lifePivot_.app.modules.housing.schema import HousingRequest, HousingResult
from lifePivot_.app.modules.housing.pipelines.preprocessing import normalize_district_name
from lifePivot_.app.modules.housing.pipelines.threshold_calculator import (
    calculate_rir,
    classify_housing_status,
    calculate_housing_risk_score,
    calculate_confidence_score,
)


def build_housing_result(request: HousingRequest) -> HousingResult:
    district = normalize_district_name(request.district)

    rir = calculate_rir(
        monthly_income=request.monthly_income,
        monthly_housing_cost=request.monthly_housing_cost,
    )

    housing_status, is_red_zone = classify_housing_status(rir)
    risk_score = calculate_housing_risk_score(rir)
    confidence_score = calculate_confidence_score(rir)

    return HousingResult(
        district=district,
        monthly_income=request.monthly_income,
        monthly_housing_cost=request.monthly_housing_cost,
        rir=rir,
        housing_status=housing_status,
        is_red_zone=is_red_zone,
        risk_score=risk_score,
        confidence_score=confidence_score,
    )