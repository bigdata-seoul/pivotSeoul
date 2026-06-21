from dataclasses import dataclass


@dataclass(frozen=True)
class TrainingCourse:
    title: str
    score: float = 0.0
