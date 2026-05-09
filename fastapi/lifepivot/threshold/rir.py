def rent_income_ratio(monthly_rent: float, monthly_income: float) -> float:
    if monthly_income <= 0:
        raise ValueError("monthly_income must be positive")
    return monthly_rent / monthly_income


def rir_status(rir: float) -> str:
    """문서 4.1 기준."""
    if rir < 0.30:
        return "stable"
    if rir <= 0.40:
        return "warning"
    return "risk"
