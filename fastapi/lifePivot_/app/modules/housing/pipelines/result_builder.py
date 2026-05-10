from lifePivot_.app.modules.housing.schema import HousingRequest, HousingResult
from lifePivot_.app.modules.housing.pipelines.feature_engineering import build_housing_features
from lifePivot_.app.modules.housing.pipelines.preprocessing import normalize_district_name
from lifePivot_.app.modules.housing.pipelines.threshold_calculator import calculate_rir_threshold


def build_housing_result(request: HousingRequest) -> HousingResult:
    district = normalize_district_name(request.district)
    features = build_housing_features(district)
    rir = calculate_rir_threshold(features)
    return HousingResult(district=district, rir=rir, housing_status="pending")
