from lifePivot_.pipelines.childcare_result_builder import build_childcare_result
from lifePivot_.modules.childcare_schema import ChildcareRequest, ChildcareResult


class ChildcareService:
    def run(self, request: ChildcareRequest) -> ChildcareResult:
        return build_childcare_result(request)
