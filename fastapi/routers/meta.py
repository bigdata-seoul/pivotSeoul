from fastapi import APIRouter

from lifepivot.data_sources.registry import list_sources
from lifepivot.pipeline.stages import stage_descriptions

router = APIRouter()


@router.get("/meta/stages")
def get_pipeline_stages():
    return {"stages": stage_descriptions()}


@router.get("/meta/data-sources")
def get_data_sources():
    return {"sources": list_sources()}
