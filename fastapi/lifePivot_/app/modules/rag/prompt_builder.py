from lifePivot_.app.modules.recommendation.schema import (
    RecommendationItem,
    RecommendationRequest,
    SourceEvidence,
)


def build_recommendation_prompt(
    request: RecommendationRequest,
    recommendations: list[RecommendationItem],
    sources: list[SourceEvidence],
) -> str:
    query = request.query.strip() or "No query provided"
    recommendation_lines = [
        f"{item.priority}. {item.title} - {item.reason}" for item in recommendations
    ] or ["No recommendation candidates were selected."]
    source_lines = [
        f"- {source.source_key}: {source.snippet}" for source in sources
    ] or ["- No external evidence was provided."]

    return "\n".join(
        [
            "Create a concise Korean explanation for the recommendation result.",
            f"User query: {query}",
            "Recommendations:",
            *recommendation_lines,
            "Evidence:",
            *source_lines,
        ]
    )
