from lifePivot_.app.modules.llm.explanation_builder import build_interpretation
from lifePivot_.app.modules.llm.summarizer import summarize_recommendations
from lifePivot_.app.modules.rag.prompt_builder import build_recommendation_prompt
from lifePivot_.app.modules.rag.retriever import retrieve_context
from lifePivot_.app.modules.rag.source_mapper import map_sources
from lifePivot_.app.modules.recommendation.pipelines.policy_filter import filter_policy_candidates
from lifePivot_.app.modules.recommendation.pipelines.ranker import rank_recommendations
from lifePivot_.app.modules.recommendation.schema import (
    DEFAULT_ERROR_MESSAGE,
    RecommendationItem,
    RecommendationRequest,
    RecommendationResponse,
)


EMPTY_RECOMMENDATION_MESSAGE = "no recommendation candidates available"


def build_recommendation_result(request: RecommendationRequest) -> RecommendationResponse:
    try:
        filtered = filter_policy_candidates(request.candidates, request)
        ranked = rank_recommendations(filtered, request)
        top_ranked = ranked[: max(request.top_k, 0)]
        items = [_build_item(candidate, score, index) for index, (candidate, score) in enumerate(top_ranked, start=1)]
        context = retrieve_context(request.query, request.rag_context, top_k=request.top_k)
        sources = map_sources(context, items)
        prompt = build_recommendation_prompt(request, items, sources)
        summary = summarize_recommendations(items)
        interpretation = build_interpretation(request, items, sources)
        message = EMPTY_RECOMMENDATION_MESSAGE if not items else "recommendation generated"

        return RecommendationResponse(
            status="success",
            message=message,
            query=request.query,
            summary=summary,
            interpretation=interpretation,
            recommendations=items,
            sources=sources,
            prompt=prompt,
        )
    except Exception as exc:
        return RecommendationResponse(
            status="error",
            message=DEFAULT_ERROR_MESSAGE,
            query=request.query,
            error=str(exc),
        )


def _build_item(candidate, score: float, priority: int) -> RecommendationItem:
    identifier = candidate.id or f"recommendation-{priority}"
    description = candidate.description or "Detailed description will be provided after model integration."
    reason = _build_reason(candidate, score)
    return RecommendationItem(
        id=identifier,
        title=candidate.title,
        category=candidate.category,
        description=description,
        priority=priority,
        score=score,
        reason=reason,
        source_keys=candidate.source_keys,
        metadata=candidate.metadata,
    )


def _build_reason(candidate, score: float) -> str:
    tags = ", ".join(candidate.tags[:3])
    tag_text = f" Matching tags: {tags}." if tags else ""
    return f"Priority score {score:.2f} was calculated from candidate fit and request context.{tag_text}"
