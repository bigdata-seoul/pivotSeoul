from dataclasses import dataclass


@dataclass(frozen=True)
class OpenDataSource:
    """서울 열린데이터 등 원천 소스 한 줄 요약."""

    key: str
    open_api_or_dataset_id: str
    purpose: str


# 통합 문서 2단계·윤서 레이어 기준 스텁 레지스트리
SOURCES: tuple[OpenDataSource, ...] = (
    OpenDataSource(
        "rent",
        "OA-21276",
        "전월세가 — 주거비·월세·보증금 원천",
    ),
    OpenDataSource(
        "public_rental_supply",
        "OA-12918",
        "국민임대 공급계획 — 주거 안정성·공공임대 기회",
    ),
    OpenDataSource(
        "education",
        "OA-15357",
        "서울일자리포털 교육정보 — 커리어 연결",
    ),
    OpenDataSource(
        "childcare_stats",
        "OA-15460",
        "어린이집 정원현원 — 보육 인프라",
    ),
    OpenDataSource(
        "care_center_gis",
        "OA-20965",
        "우리동네키움센터 — 돌봄 접근성 GIS",
    ),
    OpenDataSource(
        "welfare_facilities",
        "OA-20412",
        "사회복지시설 — GNN·지역 네트워크",
    ),
    OpenDataSource(
        "policy_rag",
        "OA-22188",
        "몽땅정보 만능키 — 정책 RAG",
    ),
    OpenDataSource(
        "youth_survey",
        "OA-22753",
        "서울 청년실태조사 — LLM 비교 맥락",
    ),
)


def list_sources() -> list[dict[str, str]]:
    return [
        {"key": s.key, "dataset_id": s.open_api_or_dataset_id, "purpose": s.purpose}
        for s in SOURCES
    ]
