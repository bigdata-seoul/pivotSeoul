# FastAPI Backend Overview

## Purpose

Life Pivot API 서버. **기능 도메인별 폴더**(`lifePivot_/app/modules/{기능}/`) 안에 HTTP 계약(`router`, `schema`)과 **같은 기능의 파이프라인**(`pipelines/`)을 둔다.

## Entry points

- `main.py` — `uvicorn main:app` (이 디렉터리를 `/app`으로 두고 실행)
- `lifePivot_/app/main.py` — FastAPI 인스턴스
- `lifePivot_/app/api/v1/router.py` — v1 라우터 조합

## Domain modules (under `lifePivot_/app/modules/`)

`housing`, `career`, `childcare`, `senior`, `policy`, `simulation`, `llm_explanation`, `data_source`

## Data

원천 데이터는 `lifePivot_/data` 아래. 매핑은 `lifePivot_/data/MIGRATION_MAP.csv`.

## Run

1. `pip install -r requirements.txt`
2. `uvicorn main:app --reload --port 8000` (현재 디렉터리가 `fastapi`일 때)
