"""FastAPI 애플리케이션 조립 지점입니다.

실행 흐름:
1. Spring AiGatewayService가 ``PIVOT_FASTAPI_BASE_URL``을 통해 이 앱을 호출합니다.
2. 모든 기능 API는 ``/api/v1`` 아래에 붙습니다.
3. 기능 라우터는 각자의 서비스/파이프라인 모듈을 호출하고 JSON을 Spring으로 반환합니다.

일반 제품 흐름에서는 브라우저가 이 앱을 직접 호출하지 않습니다.
검증, 저장, 보안의 공개 API 경계는 Spring으로 유지합니다.
"""

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

# 모든 기능 라우터를 하나의 버전 접두사 아래에 붙여서 Spring이
# `/api/ai/{feature}`를 FastAPI `/api/v1/{feature}`로 예측 가능하게 매핑합니다.
app.include_router(api_v1_router, prefix="/api/v1")


# Spring `/api/ai/status`가 AI 서비스 연결 가능 여부를 확인할 때 호출합니다.
@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "fastapi"}


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "Pivot Seoul FastAPI"}
