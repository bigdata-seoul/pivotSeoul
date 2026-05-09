from lifepivot.schemas.district_summary import DistrictSummary


def stub_district_summary(district: str) -> DistrictSummary:
    """실제로는 전월세·공급계획 집계 결과를 연결."""
    return DistrictSummary(district=district)
