from fastapi import APIRouter

from lifePivot_.app.modules.childcare.schema import ChildcareRequest, ChildcareResult
from lifePivot_.app.modules.childcare.service import ChildcareService

router = APIRouter(prefix="/childcare", tags=["childcare"])
service = ChildcareService()


@router.post("/analyze", response_model=ChildcareResult)
def analyze_childcare(body: ChildcareRequest) -> ChildcareResult:
    return service.run(body)
