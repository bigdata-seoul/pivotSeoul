from enum import Enum


class PipelineStage(str, Enum):
    """통합 문서 단계와 대응."""

    USER_INPUT_SCREEN = "0_user_input_screen"  # 선우
    RAW_DATA_SOURCES = "1_raw_data_sources"  # 윤서
    PREPROCESSING = "2_preprocessing"  # 사랑
    FEATURES = "3_features"  # 사랑 + 선우 화면 단위
    THRESHOLD = "4_threshold"  # 사랑
    RECOMMENDATION = "5_recommendation"  # 사랑
    RAG = "6_rag"  # 사랑
    LLM = "7_llm"  # 사랑
    RESULT_UI = "8_result_ab_ui"  # 선우 (프론트)


def stage_descriptions() -> list[dict[str, str]]:
    return [
        {"id": s.value, "name": s.name.replace("_", " ")} for s in PipelineStage
    ]
