from lifePivot_.pipelines.policy_condition_matcher import match_conditions
from lifePivot_.pipelines.policy_policy_ranker import rank_policy_candidates
from lifePivot_.pipelines.policy_preprocessing import preprocess_policy_query
from lifePivot_.pipelines.policy_rag_retriever import retrieve_policy_chunks
from lifePivot_.modules.policy_schema import PolicyRequest, PolicyResult


def build_policy_result(request: PolicyRequest) -> PolicyResult:
    query = preprocess_policy_query(request.query)
    _ = match_conditions(query)
    rag_chunks = retrieve_policy_chunks(query)
    ranked = rank_policy_candidates(rag_chunks)
    return PolicyResult(query=query, candidates=ranked)
