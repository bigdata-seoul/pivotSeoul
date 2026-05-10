from fastapi import APIRouter

from lifePivot_.modules.housing_schema import HousingRequest, HousingResult
from lifePivot_.modules.housing_service import HousingService

router = APIRouter(prefix="/housing", tags=["housing"])
service = HousingService()


@router.post("/analyze", response_model=HousingResult)
def analyze_housing(body: HousingRequest) -> HousingResult:
    return service.run(body)
