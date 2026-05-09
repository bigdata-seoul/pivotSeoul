from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import api_v1

app = FastAPI(
    title="Pivot Seoul API",
    version="0.1.0",
    description="FastAPI service for Life Pivot",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_v1)


@app.get("/health")
def health():
    return {"status": "ok", "service": "fastapi"}


@app.get("/")
def root():
    return {"message": "Pivot Seoul FastAPI"}
