"""FastAPI composition root (`app` package). Feature routers mount under `/api/v1`."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from lifePivot_.app.api.v1.router import api_v1_router

app = FastAPI(
    title="Pivot Seoul API",
    version="0.2.0",
    description="Domain-first FastAPI service for Life Pivot",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_v1_router, prefix="/api/v1")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "fastapi"}


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "Pivot Seoul FastAPI"}
