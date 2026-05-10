from fastapi import APIRouter

from lifePivot_.modules.career_schema import CareerRequest, CareerResult
from lifePivot_.modules.career_service import CareerService

router = APIRouter(prefix="/career", tags=["career"])
service = CareerService()


@router.post("/recommend", response_model=CareerResult)
def recommend_career(body: CareerRequest) -> CareerResult:
    return service.run(body)
