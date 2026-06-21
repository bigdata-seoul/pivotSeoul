from dataclasses import dataclass


@dataclass(frozen=True)
class ChildcareFacility:
    name: str
    district: str
