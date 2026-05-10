from fastapi import APIRouter

from lifePivot_.modules.childcare_schema import ChildcareRequest, ChildcareResult
from lifePivot_.modules.childcare_service import ChildcareService

router = APIRouter(prefix="/childcare", tags=["childcare"])
service = ChildcareService()


@router.post("/analyze", response_model=ChildcareResult)
def analyze_childcare(body: ChildcareRequest) -> ChildcareResult:
    return service.run(body)
