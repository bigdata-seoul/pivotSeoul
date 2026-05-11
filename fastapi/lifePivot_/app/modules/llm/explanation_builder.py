from lifePivot_.app.modules.llm.client import LLMClient
from lifePivot_.app.modules.rag.prompt_builder import build_recommendation_prompt
from lifePivot_.app.modules.recommendation.schema import (
    RecommendationItem,
    RecommendationRequest,
    SourceEvidence,
)


DEFAULT_INTERPRETATION = "Recommendation interpretation is ready for Spring response handling."


def build_interpretation(
    request: RecommendationRequest,
    recommendations: list[RecommendationItem],
    sources: list[SourceEvidence],
) -> str:
    if not recommendations:
        return "No eligible recommendation candidate was found."
    prompt = build_recommendation_prompt(request, recommendations, sources)
    llm_text = LLMClient().generate(prompt)
    return f"{DEFAULT_INTERPRETATION} {llm_text}"
