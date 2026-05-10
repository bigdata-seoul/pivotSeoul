from fastapi import APIRouter

from lifePivot_.app.modules.policy.schema import PolicyRequest, PolicyResult
from lifePivot_.app.modules.policy.service import PolicyService

router = APIRouter(prefix="/policy", tags=["policy"])
service = PolicyService()


@router.post("/recommend", response_model=PolicyResult)
def recommend_policy(body: PolicyRequest) -> PolicyResult:
    return service.run(body)
