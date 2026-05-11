from fastapi import APIRouter

from lifePivot_.app.modules.recommendation.schema import RecommendationRequest, RecommendationResponse
from lifePivot_.app.modules.recommendation.service import RecommendationService

router = APIRouter(prefix="/recommendation", tags=["recommendation"])
service = RecommendationService()


@router.post("/recommend", response_model=RecommendationResponse)
def recommend(body: RecommendationRequest) -> RecommendationResponse:
    return service.run(body)
