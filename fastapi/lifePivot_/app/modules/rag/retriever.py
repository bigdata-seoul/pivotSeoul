DEFAULT_TOP_K = 5


def retrieve_context(query: str, seed_context: list[str] | None = None, top_k: int = DEFAULT_TOP_K) -> list[str]:
    """Return RAG context snippets while preserving placeholder behavior."""
    snippets = [snippet.strip() for snippet in (seed_context or []) if snippet and snippet.strip()]
    if snippets:
        return snippets[: max(top_k, 0)]
    if not query.strip():
        return []
    return [f"Placeholder evidence for query: {query.strip()}"][: max(top_k, 0)]
