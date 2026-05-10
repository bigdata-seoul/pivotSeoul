from lifePivot_.app.modules.policy.pipelines.result_builder import build_policy_result
from lifePivot_.app.modules.policy.schema import PolicyRequest, PolicyResult


class PolicyService:
    def run(self, request: PolicyRequest) -> PolicyResult:
        return build_policy_result(request)
