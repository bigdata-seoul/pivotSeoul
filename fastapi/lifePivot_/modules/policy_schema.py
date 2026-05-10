from pydantic import BaseModel, Field


class PolicyRequest(BaseModel):
    query: str


class PolicyResult(BaseModel):
    query: str
    candidates: list[str] = Field(default_factory=list)
