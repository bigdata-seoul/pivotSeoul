from lifePivot_.app.modules.childcare.pipelines.result_builder import build_childcare_result
from lifePivot_.app.modules.childcare.schema import ChildcareRequest, ChildcareResult


class ChildcareService:
    def run(self, request: ChildcareRequest) -> ChildcareResult:
        return build_childcare_result(request)
