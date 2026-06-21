from lifePivot_.app.modules.recommendation.schema import RecommendationItem, SourceEvidence


DEFAULT_SOURCE_KEY = "placeholder-rag"
DEFAULT_SOURCE_TITLE = "RAG placeholder evidence"


def map_sources(snippets: list[str], recommendations: list[RecommendationItem]) -> list[SourceEvidence]:
    source_keys = _collect_source_keys(recommendations)
    if not snippets:
        return []

    sources: list[SourceEvidence] = []
    for index, snippet in enumerate(snippets, start=1):
        source_key = source_keys[index - 1] if index <= len(source_keys) else f"{DEFAULT_SOURCE_KEY}-{index}"
        sources.append(
            SourceEvidence(
                source_key=source_key,
                title=DEFAULT_SOURCE_TITLE,
                snippet=snippet,
                confidence=0.5,
                metadata={"rank": index},
            )
        )
    return sources


def _collect_source_keys(recommendations: list[RecommendationItem]) -> list[str]:
    keys: list[str] = []
    for item in recommendations:
        for source_key in item.source_keys:
            if source_key not in keys:
                keys.append(source_key)
    return keys
