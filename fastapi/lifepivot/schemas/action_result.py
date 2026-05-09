from pydantic import BaseModel, Field


class ActionResult(BaseModel):
    """7.4 action_result — 실행 액션."""

    action_id: str
    user_id: str | None = None
    priority: int = Field(default=1, ge=1)
    action_title: str
    action_reason: str | None = None
    source_data: str | None = None
    action_link: str | None = None
