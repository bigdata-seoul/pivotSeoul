"""API v1의 모든 기능 라우터를 모읍니다.

라우터 흐름:
- 개별 기능 모듈이 각자의 라우트/서비스/파이프라인 코드를 소유합니다.
- 이 파일은 해당 라우터들을 버전이 붙은 API 표면에 연결만 합니다.
- Spring의 AiGatewayService는 이 경로들이 안정적으로 유지된다는 전제에 의존합니다.
"""

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

# 포함 순서는 사용자 흐름을 따릅니다.
# 1) 도메인 분석기: 주거/커리어/보육/노년/정책
# 2) 오케스트레이션: 시뮬레이션이 모듈별 신호를 합칩니다.
# 3) 설명/데이터 유틸: LLM 해설과 데이터 소스 수집
api_v1_router.include_router(housing_router)
api_v1_router.include_router(career_router)
api_v1_router.include_router(childcare_router)
api_v1_router.include_router(senior_router)
api_v1_router.include_router(policy_router)
api_v1_router.include_router(simulation_router)
api_v1_router.include_router(llm_explanation_router)
api_v1_router.include_router(data_source_router)
