from fastapi import APIRouter

from lifePivot_.modules.policy_schema import PolicyRequest, PolicyResult
from lifePivot_.modules.policy_service import PolicyService

router = APIRouter(prefix="/policy", tags=["policy"])
service = PolicyService()


@router.post("/recommend", response_model=PolicyResult)
def recommend_policy(body: PolicyRequest) -> PolicyResult:
    return service.run(body)
