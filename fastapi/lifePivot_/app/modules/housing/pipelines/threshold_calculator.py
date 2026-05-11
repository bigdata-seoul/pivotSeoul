def calculate_rir(monthly_income: int | None, monthly_housing_cost: int | None) -> float | None:
    """
    RIR(Rent-to-Income Ratio)을 계산한다.
    RIR = 월 주거비 / 월 소득
    """
    if monthly_income is None or monthly_housing_cost is None:
        return None

    if monthly_income <= 0:
        return None

    return round(monthly_housing_cost / monthly_income, 4)


def classify_housing_status(rir: float | None) -> tuple[str, bool]:
    """
    RIR 기준으로 주거비 부담 상태를 분류한다.

    기준:
    - 0.30 이하: stable
    - 0.30 초과 ~ 0.40 이하: warning
    - 0.40 초과: danger / red zone
    """
    if rir is None:
        return "unknown", False

    if rir <= 0.30:
        return "stable", False

    if rir <= 0.40:
        return "warning", False

    return "danger", True