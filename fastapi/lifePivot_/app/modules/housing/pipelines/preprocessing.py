def normalize_district_name(raw: str) -> str:
    s = raw.strip()
    if s.startswith("서울"):
        s = s.replace("서울특별시", "").replace("서울시", "").replace("서울", "").strip()
    return s
