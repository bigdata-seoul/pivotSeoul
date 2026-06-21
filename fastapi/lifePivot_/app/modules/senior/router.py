from fastapi import APIRouter

from lifePivot_.app.modules.senior.schema import SeniorRequest, SeniorResult
from lifePivot_.app.modules.senior.service import SeniorService

router = APIRouter(prefix="/senior", tags=["senior"])
service = SeniorService()


@router.post("/analyze", response_model=SeniorResult)
def analyze_senior(body: SeniorRequest) -> SeniorResult:
    return service.run(body)
