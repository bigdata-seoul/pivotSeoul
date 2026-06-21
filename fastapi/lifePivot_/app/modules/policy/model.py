from dataclasses import dataclass


@dataclass(frozen=True)
class PolicyCandidate:
    title: str
    score: float = 0.0
