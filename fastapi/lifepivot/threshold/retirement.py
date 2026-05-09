"""노후 지속 임계점 — 자산수명 (문서 4.2 스켈레톤)."""


def asset_runway_months(
    surplus: float,
    monthly_coverage_gap: float,
) -> float | None:
    """surplus / monthly_coverage; 분모 0 시 None."""
    if monthly_coverage_gap <= 0:
        return None
    return surplus / monthly_coverage_gap
