from lifePivot_.app.modules.career.pipelines.result_builder import build_career_result
from lifePivot_.app.modules.career.schema import CareerRequest, CareerResult


class CareerService:
    def run(self, request: CareerRequest) -> CareerResult:
        return build_career_result(request)
