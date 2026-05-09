from lifepivot.features.housing import stub_district_summary
from lifepivot.llm.service import generate_explanation_stub
from lifepivot.preprocessing.pipeline import normalize_district_name
from lifepivot.rag.service import retrieve_policy_chunks_stub
from lifepivot.schemas.action_result import ActionResult
from lifepivot.schemas.recommendation_candidates import RecommendationCandidate
from lifepivot.schemas.user_input import UserInput
from lifepivot.schemas.user_scenario_result import UserScenarioResult


def run_pipeline_stub(inp: UserInput) -> dict:
    """
    전체 흐름 스텁: 입력 정규화 → 요약 Feature → 임계값 플레이스홀더 → RAG·LLM 스텁 → 표준 출력 필드.
    실제 수치는 원천 데이터·모델 연결 후 대체.
    """
    district = normalize_district_name(inp.district)
    summary_a = stub_district_summary(district)
    summary_b = stub_district_summary(district)  # 비교 시나리오는 동일 스텁

    scenario_a = UserScenarioResult(
        scenario="A",
        district=district,
        RIR=None,
        housing_status="pending",
        total_score=None,
        threshold_status="pending",
    )
    scenario_b = UserScenarioResult(
        scenario="B",
        district=district,
        RIR=None,
        housing_status="pending",
        total_score=None,
        threshold_status="pending",
    )

    rag_chunks = retrieve_policy_chunks_stub(f"{inp.target_job} {district}")
    llm_out = generate_explanation_stub(
        user_summary=f"{inp.life_stage}, {district}",
        metrics_summary=str(summary_a.model_dump()),
        rag_snippets=[c.retrieved_chunk for c in rag_chunks],
    )

    candidates: list[RecommendationCandidate] = []

    actions = [
        ActionResult(
            action_id="act-1",
            user_id=None,
            priority=1,
            action_title=llm_out.first_action_title or "데이터 연결 후 첫 액션",
            action_reason=llm_out.final_explanation[:200]
            if llm_out.final_explanation
            else None,
            source_data="pipeline_stub",
            action_link=llm_out.first_action_link,
        )
    ]

    return {
        "input_normalized": {"district": district},
        "district_summary": {
            "A": summary_a.model_dump(),
            "B": summary_b.model_dump(),
        },
        "user_scenario_result": [scenario_a.model_dump(), scenario_b.model_dump()],
        "recommendation_candidates": [c.model_dump() for c in candidates],
        "action_result": [a.model_dump() for a in actions],
        "llm": llm_out.model_dump(),
        "rag_chunk_count": len(rag_chunks),
    }
