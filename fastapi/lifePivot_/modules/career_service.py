from lifePivot_.pipelines.career_result_builder import build_career_result
from lifePivot_.modules.career_schema import CareerRequest, CareerResult


class CareerService:
    def run(self, request: CareerRequest) -> CareerResult:
        return build_career_result(request)
