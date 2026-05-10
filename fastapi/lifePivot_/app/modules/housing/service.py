from lifePivot_.app.modules.housing.pipelines.result_builder import build_housing_result
from lifePivot_.app.modules.housing.schema import HousingRequest, HousingResult


class HousingService:
    """
    Housing domain application service.

    Responsibility:
    - Accept validated API input (schema layer)
    - Trigger domain pipeline (pipeline layer)
    - Return API-safe result model (schema layer)
    """

    def run(self, request: HousingRequest) -> HousingResult:
        return build_housing_result(request)
