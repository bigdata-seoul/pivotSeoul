from lifePivot_.app.modules.housing.schema import HousingRequest, HousingResult
from lifePivot_.app.modules.housing.pipelines.preprocessing import normalize_district_name
from lifePivot_.app.modules.housing.pipelines.threshold_calculator import (
    calculate_rir,
    classify_housing_status,
)


def build_housing_result(request: HousingRequest) -> HousingResult:
    district = normalize_district_name(request.district)

    rir = calculate_rir(
        monthly_income=request.monthly_income,
        monthly_housing_cost=request.monthly_housing_cost,
    )

    housing_status, is_red_zone = classify_housing_status(rir)

    return HousingResult(
        district=district,
        monthly_income=request.monthly_income,
        monthly_housing_cost=request.monthly_housing_cost,
        rir=rir,
        housing_status=housing_status,
        is_red_zone=is_red_zone,
    )