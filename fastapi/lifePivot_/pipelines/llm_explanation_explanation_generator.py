from lifePivot_.pipelines.llm_explanation_context_builder import build_context
from lifePivot_.pipelines.llm_explanation_groq_client import call_groq
from lifePivot_.pipelines.llm_explanation_guardrails import apply_guardrails
from lifePivot_.pipelines.llm_explanation_prompt_builder import build_prompt
from lifePivot_.modules.llm_explanation_schema import LLMExplanationRequest, LLMExplanationResponse


def generate_explanation(request: LLMExplanationRequest) -> LLMExplanationResponse:
    context = build_context(request.user_summary, request.metrics_summary, request.rag_snippets)
    prompt = build_prompt(context)
    safe_prompt = apply_guardrails(prompt)
    final_text = call_groq(safe_prompt)
    return LLMExplanationResponse(final_explanation=final_text)
