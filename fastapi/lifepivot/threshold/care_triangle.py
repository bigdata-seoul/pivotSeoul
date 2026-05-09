"""돌봄 삼각 동선 — 시간 붕괴 임계 (문서 4.3 스켈레톤)."""


def exceeds_time_collapse_threshold(total_travel_minutes_one_way: float) -> bool:
    """왕복 2시간 초과 시 True (분 단위 왕복 기준으로 해석 시 조정)."""
    round_trip = total_travel_minutes_one_way * 2
    return round_trip > 120
