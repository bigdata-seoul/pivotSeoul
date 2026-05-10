# FastAPI Backend Overview

## Purpose

이 디렉토리는 Life Pivot 백엔드 API 서버입니다.
구조는 기능 중심으로 유지하면서, 파일 탐색성을 위해 3뎁스 이하 평탄화 규칙을 적용했습니다.

## Entry Points

- `main.py`: 실행 진입점 (`lifePivot_.main`의 `app` export)
- `lifePivot_/main.py`: 실제 FastAPI 앱 구성
- `lifePivot_/api_router.py`: 기능 모듈 라우터 통합

## Domain Modules

- `housing`
- `career`
- `childcare`
- `senior`
- `policy`
- `simulation`
- `llm_explanation`
- `data_source`

## Data Location

원천 데이터는 `lifePivot_/data` 아래에 평탄화되어 있습니다.
기존 경로 대비 매핑은 `lifePivot_/data/MIGRATION_MAP.csv`에서 확인할 수 있습니다.

## Run

1. `pip install -r requirements.txt`
2. `uvicorn main:app --reload --port 8000`
