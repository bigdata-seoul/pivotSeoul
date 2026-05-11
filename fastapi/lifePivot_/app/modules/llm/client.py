PLACEHOLDER_RESPONSE = "LLM integration is not configured. Placeholder response returned."


class LLMClient:
    def generate(self, prompt: str) -> str:
        if not prompt.strip():
            return PLACEHOLDER_RESPONSE
        return f"{PLACEHOLDER_RESPONSE} Prompt length: {len(prompt)}."
