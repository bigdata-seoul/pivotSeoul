from lifePivot_.app.modules.senior.pipelines.result_builder import build_senior_result
from lifePivot_.app.modules.senior.schema import SeniorRequest, SeniorResult


class SeniorService:
    def run(self, request: SeniorRequest) -> SeniorResult:
        return build_senior_result(request)
