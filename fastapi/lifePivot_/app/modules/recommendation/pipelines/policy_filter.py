from lifePivot_.app.modules.recommendation.schema import RecommendationCandidate, RecommendationRequest


DEFAULT_EXCLUDED_STATUSES = {"inactive", "closed", "expired", "disabled"}


def filter_policy_candidates(
    candidates: list[RecommendationCandidate],
    request: RecommendationRequest,
) -> list[RecommendationCandidate]:
    """Keep only candidates that can be recommended to Spring callers."""
    profile_tags = _normalize_values(request.user_profile.get("tags", []))
    filtered: list[RecommendationCandidate] = []

    for candidate in candidates:
        if not candidate.eligible:
            continue
        if _is_excluded_status(candidate):
            continue
        if profile_tags and candidate.tags:
            candidate_tags = _normalize_values(candidate.tags)
            if profile_tags.isdisjoint(candidate_tags):
                continue
        filtered.append(candidate)

    return filtered


def _is_excluded_status(candidate: RecommendationCandidate) -> bool:
    status = str(candidate.metadata.get("status", "")).lower()
    return status in DEFAULT_EXCLUDED_STATUSES


def _normalize_values(values: object) -> set[str]:
    if isinstance(values, str):
        return {values.strip().lower()} if values.strip() else set()
    if isinstance(values, list):
        return {str(value).strip().lower() for value in values if str(value).strip()}
    return set()
