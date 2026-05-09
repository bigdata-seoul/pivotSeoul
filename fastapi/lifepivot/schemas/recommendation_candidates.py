from typing import Literal

from pydantic import BaseModel, Field


class RecommendationCandidate(BaseModel):
    """7.3 recommendation_candidates — 추천 후보."""

    candidate_id: str
    candidate_type: Literal["education", "policy", "job", "facility"]
    title: str
    district: str | None = None
    fit_score: float | None = None
    reason: str | None = None
    source_link: str | None = None
