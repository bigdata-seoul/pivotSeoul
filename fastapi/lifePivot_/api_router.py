from fastapi import APIRouter

from lifePivot_.modules.career_router import router as career_router
from lifePivot_.modules.childcare_router import router as childcare_router
from lifePivot_.modules.data_source_router import router as data_source_router
from lifePivot_.modules.housing_router import router as housing_router
from lifePivot_.modules.llm_explanation_router import router as llm_explanation_router
from lifePivot_.modules.policy_router import router as policy_router
from lifePivot_.modules.senior_router import router as senior_router
from lifePivot_.modules.simulation_router import router as simulation_router

api_v1_router = APIRouter()

# Module registration order follows runtime composition:
# 1) core domain analyzers (housing/career/childcare/senior/policy)
# 2) cross-domain orchestrator (simulation)
# 3) explanation and data source utilities
api_v1_router.include_router(housing_router)
api_v1_router.include_router(career_router)
api_v1_router.include_router(childcare_router)
api_v1_router.include_router(senior_router)
api_v1_router.include_router(policy_router)
api_v1_router.include_router(simulation_router)
api_v1_router.include_router(llm_explanation_router)
api_v1_router.include_router(data_source_router)
