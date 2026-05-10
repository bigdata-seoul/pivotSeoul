from lifePivot_.pipelines.childcare_capacity_calculator import calculate_capacity
from lifePivot_.pipelines.childcare_childcare_threshold import calculate_childcare_threshold
from lifePivot_.pipelines.childcare_gis_access_analyzer import analyze_gis_access
from lifePivot_.pipelines.childcare_preprocessing import preprocess_childcare_input
from lifePivot_.modules.childcare_schema import ChildcareRequest, ChildcareResult


def build_childcare_result(request: ChildcareRequest) -> ChildcareResult:
    district = preprocess_childcare_input(request.district)
    _ = calculate_capacity(district)
    metrics = analyze_gis_access(district)
    status = calculate_childcare_threshold(metrics)
    return ChildcareResult(district=district, capacity_status=status)
