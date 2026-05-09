from fastapi import APIRouter

from lifepivot.pipeline.orchestrator import run_pipeline_stub
from lifepivot.schemas.user_input import UserInput

router = APIRouter()


@router.post("/pipeline/run")
def run_pipeline(body: UserInput):
    """통합 파이프라인 스텁 실행 — 추후 DB·모델 연결."""
    return run_pipeline_stub(body)
