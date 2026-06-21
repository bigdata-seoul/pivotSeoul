from fastapi import APIRouter

from lifePivot_.app.modules.llm_explanation.schema import LLMExplanationRequest, LLMExplanationResponse
from lifePivot_.app.modules.llm_explanation.service import LLMExplanationService

router = APIRouter(prefix='/llm-explanation', tags=['llm_explanation'])
service = LLMExplanationService()


@router.post('/generate', response_model=LLMExplanationResponse)
def generate_llm_explanation(body: LLMExplanationRequest) -> LLMExplanationResponse:
    return service.run(body)
