from pydantic import BaseModel, Field


class RetrievedChunk(BaseModel):
    retrieved_chunk: str
    source_link: str | None = None
    retrieval_score: float | None = None


def retrieve_policy_chunks_stub(query: str, top_k: int = 5) -> list[RetrievedChunk]:
    """실제 구현: 임베딩 저장소 + 유사도 검색."""
    _ = (query, top_k)
    return []
