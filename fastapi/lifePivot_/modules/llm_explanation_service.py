from lifePivot_.pipelines.llm_explanation_explanation_generator import generate_explanation
from lifePivot_.modules.llm_explanation_schema import LLMExplanationRequest, LLMExplanationResponse


class LLMExplanationService:
    def run(self, request: LLMExplanationRequest) -> LLMExplanationResponse:
        return generate_explanation(request)
