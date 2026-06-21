from lifePivot_.app.modules.llm_explanation.pipelines.explanation_generator import generate_explanation
from lifePivot_.app.modules.llm_explanation.schema import LLMExplanationRequest, LLMExplanationResponse


class LLMExplanationService:
    def run(self, request: LLMExplanationRequest) -> LLMExplanationResponse:
        return generate_explanation(request)
