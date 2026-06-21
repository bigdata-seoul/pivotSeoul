from pydantic import BaseModel, Field


class LLMExplanationRequest(BaseModel):
    user_summary: str
    metrics_summary: str
    rag_snippets: list[str] = Field(default_factory=list)


class LLMExplanationResponse(BaseModel):
    final_explanation: str = '(stub) 연결 후 생성됩니다.'
    first_action_title: str | None = None
    first_action_link: str | None = None
