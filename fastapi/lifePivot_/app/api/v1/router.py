"""Aggregate all feature routers for API v1."""

from fastapi import APIRouter

from lifePivot_.app.modules.career.router import router as career_router
from lifePivot_.app.modules.childcare.router import router as childcare_router
from lifePivot_.app.modules.data_source.router import router as data_source_router
from lifePivot_.app.modules.housing.router import router as housing_router
from lifePivot_.app.modules.llm_explanation.router import router as llm_explanation_router
from lifePivot_.app.modules.policy.router import router as policy_router
from lifePivot_.app.modules.senior.router import router as senior_router
from lifePivot_.app.modules.simulation.router import router as simulation_router

api_v1_router = APIRouter()

# 1) domain analyzers  2) orchestrator  3) explanation + data utilities
api_v1_router.include_router(housing_router)
api_v1_router.include_router(career_router)
api_v1_router.include_router(childcare_router)
api_v1_router.include_router(senior_router)
api_v1_router.include_router(policy_router)
api_v1_router.include_router(simulation_router)
api_v1_router.include_router(llm_explanation_router)
api_v1_router.include_router(data_source_router)
