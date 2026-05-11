from datetime import datetime, timezone

from fastapi import APIRouter

router = APIRouter(prefix="/health", tags=["health"])


@router.get("")
def health_check() -> dict[str, object]:
    return {
        "status": "ok",
        "service": "fastapi",
        "module": "ai",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "dependencies": {
            "llm": "placeholder",
            "rag": "placeholder",
            "recommendation": "available",
        },
    }
