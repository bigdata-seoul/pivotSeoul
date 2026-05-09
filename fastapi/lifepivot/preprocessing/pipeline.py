def normalize_district_name(raw: str) -> str:
    """예: '서울 송파구' → '송파구'. 실제 구현 시 규칙 테이블 확장."""
    s = raw.strip()
    if s.startswith("서울"):
        s = s.replace("서울특별시", "").replace("서울시", "").replace("서울", "").strip()
    return s
