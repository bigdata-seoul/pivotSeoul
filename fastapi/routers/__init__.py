from fastapi import APIRouter

from routers import meta, pipeline

api_v1 = APIRouter(prefix="/api/v1")
api_v1.include_router(meta.router, tags=["meta"])
api_v1.include_router(pipeline.router, tags=["pipeline"])
