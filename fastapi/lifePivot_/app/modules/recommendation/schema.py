from typing import Any

from pydantic import BaseModel, Field


DEFAULT_SUCCESS_MESSAGE = "recommendation generated"
DEFAULT_ERROR_MESSAGE = "recommendation generation failed"


class RecommendationCandidate(BaseModel):
    id: str | None = None
    title: str
    category: str | None = None
    description: str | None = None
    score: float | None = None
    tags: list[str] = Field(default_factory=list)
    source_keys: list[str] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)
    eligible: bool = True


class RecommendationRequest(BaseModel):
    query: str = ""
    user_profile: dict[str, Any] = Field(default_factory=dict)
    analysis_result: dict[str, Any] = Field(default_factory=dict)
    candidates: list[RecommendationCandidate] = Field(default_factory=list)
    rag_context: list[str] = Field(default_factory=list)
    top_k: int = 5


class SourceEvidence(BaseModel):
    source_key: str
    title: str
    snippet: str
    confidence: float = 0.0
    metadata: dict[str, Any] = Field(default_factory=dict)


class RecommendationItem(BaseModel):
    id: str
    title: str
    category: str | None = None
    description: str
    priority: int
    score: float
    reason: str
    source_keys: list[str] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)


class RecommendationResponse(BaseModel):
    status: str = "success"
    message: str = DEFAULT_SUCCESS_MESSAGE
    query: str = ""
    summary: str = ""
    interpretation: str = ""
    recommendations: list[RecommendationItem] = Field(default_factory=list)
    sources: list[SourceEvidence] = Field(default_factory=list)
    prompt: str | None = None
    error: str | None = None
