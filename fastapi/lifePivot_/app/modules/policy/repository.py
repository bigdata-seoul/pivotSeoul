from lifePivot_.app.modules.policy.model import PolicyCandidate


class PolicyRepository:
    def list_candidates(self, query: str) -> list[PolicyCandidate]:
        _ = query
        return []
