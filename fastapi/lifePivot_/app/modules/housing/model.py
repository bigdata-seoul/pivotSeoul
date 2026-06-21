from dataclasses import dataclass


@dataclass(frozen=True)
class HousingSnapshot:
    district: str
    avg_rent: float | None = None
