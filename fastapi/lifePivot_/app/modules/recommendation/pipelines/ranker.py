from lifePivot_.app.modules.recommendation.schema import RecommendationCandidate, RecommendationRequest


DEFAULT_BASE_SCORE = 0.5
TAG_MATCH_WEIGHT = 0.2
QUERY_MATCH_WEIGHT = 0.15
ANALYSIS_MATCH_WEIGHT = 0.15


def rank_recommendations(
    candidates: list[RecommendationCandidate],
    request: RecommendationRequest,
) -> list[tuple[RecommendationCandidate, float]]:
    scored = [(candidate, _calculate_score(candidate, request)) for candidate in candidates]
    return sorted(scored, key=lambda item: item[1], reverse=True)


def _calculate_score(candidate: RecommendationCandidate, request: RecommendationRequest) -> float:
    score = candidate.score if candidate.score is not None else DEFAULT_BASE_SCORE
    score += _tag_match_score(candidate, request)
    score += _query_match_score(candidate, request.query)
    score += _analysis_match_score(candidate, request)
    return round(max(score, 0.0), 4)


def _tag_match_score(candidate: RecommendationCandidate, request: RecommendationRequest) -> float:
    profile_tags = _normalize_values(request.user_profile.get("tags", []))
    candidate_tags = _normalize_values(candidate.tags)
    if not profile_tags or not candidate_tags:
        return 0.0
    return TAG_MATCH_WEIGHT if not profile_tags.isdisjoint(candidate_tags) else 0.0


def _query_match_score(candidate: RecommendationCandidate, query: str) -> float:
    query_tokens = _tokenize(query)
    if not query_tokens:
        return 0.0
    text = f"{candidate.title} {candidate.description or ''} {' '.join(candidate.tags)}".lower()
    return QUERY_MATCH_WEIGHT if any(token in text for token in query_tokens) else 0.0


def _analysis_match_score(candidate: RecommendationCandidate, request: RecommendationRequest) -> float:
    result_tags = _normalize_values(request.analysis_result.get("tags", []))
    candidate_tags = _normalize_values(candidate.tags)
    if not result_tags or not candidate_tags:
        return 0.0
    return ANALYSIS_MATCH_WEIGHT if not result_tags.isdisjoint(candidate_tags) else 0.0


def _normalize_values(values: object) -> set[str]:
    if isinstance(values, str):
        return {values.strip().lower()} if values.strip() else set()
    if isinstance(values, list):
        return {str(value).strip().lower() for value in values if str(value).strip()}
    return set()


def _tokenize(value: str) -> set[str]:
    return {token.lower() for token in value.split() if len(token.strip()) >= 2}
