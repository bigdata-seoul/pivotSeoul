from fastapi import APIRouter

from lifePivot_.modules.senior_schema import SeniorRequest, SeniorResult
from lifePivot_.modules.senior_service import SeniorService

router = APIRouter(prefix="/senior", tags=["senior"])
service = SeniorService()


@router.post("/analyze", response_model=SeniorResult)
def analyze_senior(body: SeniorRequest) -> SeniorResult:
    return service.run(body)
