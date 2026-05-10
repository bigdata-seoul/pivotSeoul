from dataclasses import dataclass


@dataclass(frozen=True)
class Scenario:
    name: str
    district: str
