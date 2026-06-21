"""FastAPI 애플리케이션 조립 지점입니다.

비전공자를 위한 설명:
이 프로그램은 'AI 엔진' 역할을 합니다. 
주로 데이터 분석이나 인공지능 관련 복잡한 계산을 수행하며, 
메인 서버(Spring Boot)에서 요청을 받으면 그 결과를 계산해서 다시 보내주는 방식으로 작동합니다.

실행 흐름:
1. 메인 서버(Spring Boot)가 이 AI 엔진을 호출합니다.
2. 모든 상세 기능들은 `/api/v1`이라는 주소 뒤에 붙어서 실행됩니다.
3. 요청이 들어오면 각 서비스 모듈이 계산을 수행하고 결과를 JSON(데이터 형식)으로 반환합니다.

일반 사용자가 웹 브라우저에서 이 AI 엔진을 직접 호출할 일은 거의 없습니다. 
보안이나 사용자 관리는 메인 서버에서 담당하기 때문입니다.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 실제 기능들이 들어있는 라우터(길잡이)를 가져옵니다.
from lifePivot_.app.api.v1.router import api_v1_router

# FastAPI 앱 객체를 생성합니다. (우리 AI 엔진의 본체입니다)
app = FastAPI(
    title="Pivot Seoul API",
    version="0.2.0",
    description="서울시 생활 피벗을 위한 도메인 우선 AI 서비스",
)

# CORS 설정: 다른 서버(예: 프런트엔드나 메인 서버)가 이 엔진에 접근할 수 있게 허용해주는 설정입니다.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 실제 기능들을 연결합니다. 모든 기능은 주소 앞에 /api/v1이 붙습니다.
# 예: /api/v1/housing, /api/v1/career 등
app.include_router(api_v1_router, prefix="/api/v1")


# 메인 서버가 이 AI 엔진이 살아있는지 확인(건강검진)할 때 호출하는 주소입니다.
@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "fastapi"}


# 가장 기본 주소(/)로 접속했을 때 보여줄 환영 메시지입니다.
@app.get("/")
def root() -> dict[str, str]:
    return {"message": "Pivot Seoul AI 엔진이 작동 중입니다."}
