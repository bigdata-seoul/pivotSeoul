"""ASGI entry shim: Docker / uvicorn `lifePivot_.main:app` stays valid."""

from lifePivot_.app.main import app

__all__ = ["app"]
