from lifePivot_.pipelines.senior_gnn_connectivity import estimate_connectivity_score
from lifePivot_.pipelines.senior_preprocessing import preprocess_senior_input
from lifePivot_.pipelines.senior_senior_threshold import calculate_senior_threshold
from lifePivot_.pipelines.senior_welfare_facility_matcher import match_welfare_facilities
from lifePivot_.modules.senior_schema import SeniorRequest, SeniorResult


def build_senior_result(request: SeniorRequest) -> SeniorResult:
    district = preprocess_senior_input(request.district)
    facilities = match_welfare_facilities(district)
    score = estimate_connectivity_score(facilities)
    status = calculate_senior_threshold(score)
    return SeniorResult(district=district, threshold_status=status)
