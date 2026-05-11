from lifePivot_.app.modules.recommendation.schema import RecommendationItem


EMPTY_SUMMARY = "No recommendation summary is available."


def summarize_recommendations(recommendations: list[RecommendationItem]) -> str:
    if not recommendations:
        return EMPTY_SUMMARY
    top_titles = ", ".join(item.title for item in recommendations[:3])
    return f"{len(recommendations)} recommendation(s) prepared. Top recommendation(s): {top_titles}."
