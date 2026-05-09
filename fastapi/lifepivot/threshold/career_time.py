"""커리어 가용 학습시간 (문서 4.4 개념 스켈레톤)."""


def available_study_hours_per_day(
    work_hours: float,
    commute_hours_one_way: float,
    sleep_meal_hours: float = 8.0,
) -> float:
    return max(0.0, 24.0 - work_hours - commute_hours_one_way * 2 - sleep_meal_hours)
