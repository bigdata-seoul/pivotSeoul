def build_context(user_summary: str, metrics_summary: str, rag_snippets: list[str]) -> str:
    return f"{user_summary}\n{metrics_summary}\n" + "\n".join(rag_snippets)
