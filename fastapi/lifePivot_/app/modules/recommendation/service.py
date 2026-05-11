from lifePivot_.app.modules.recommendation.pipelines.result_builder import build_recommendation_result
from lifePivot_.app.modules.recommendation.schema import RecommendationRequest, RecommendationResponse


class RecommendationService:
    def run(self, request: RecommendationRequest) -> RecommendationResponse:
        return build_recommendation_result(request)
