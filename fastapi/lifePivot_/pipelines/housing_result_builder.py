from lifePivot_.modules.housing_schema import HousingRequest, HousingResult
from lifePivot_.pipelines.housing_feature_engineering import build_housing_features
from lifePivot_.pipelines.housing_preprocessing import normalize_district_name
from lifePivot_.pipelines.housing_threshold_calculator import calculate_rir_threshold


def build_housing_result(request: HousingRequest) -> HousingResult:
    district = normalize_district_name(request.district)
    features = build_housing_features(district)
    rir = calculate_rir_threshold(features)
    return HousingResult(district=district, rir=rir, housing_status="pending")
