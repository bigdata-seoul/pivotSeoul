from pydantic import BaseModel, Field


class LLMExplanationResult(BaseModel):
    final_explanation: str = Field(default="", description="최종 해설")
    first_action_title: str | None = None
    first_action_link: str | None = None


def generate_explanation_stub(
    *,
    user_summary: str,
    metrics_summary: str,
    rag_snippets: list[str],
) -> LLMExplanationResult:
    """실제 구현: 프롬프트 템플릿 + 외부 LLM API."""
    _ = (user_summary, metrics_summary, rag_snippets)
    return LLMExplanationResult(
        final_explanation="(stub) 연결 후 생성됩니다.",
        first_action_title=None,
        first_action_link=None,
    )
