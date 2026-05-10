from lifePivot_.pipelines.policy_result_builder import build_policy_result
from lifePivot_.modules.policy_schema import PolicyRequest, PolicyResult


class PolicyService:
    def run(self, request: PolicyRequest) -> PolicyResult:
        return build_policy_result(request)
