from lifePivot_.app.modules.career.pipelines.cosine_matcher import cosine_match
from lifePivot_.app.modules.career.pipelines.preprocessing import preprocess_career_text
from lifePivot_.app.modules.career.pipelines.recommendation_ranker import rank_recommendations
from lifePivot_.app.modules.career.pipelines.sentence_bert_matcher import sentence_bert_match
from lifePivot_.app.modules.career.pipelines.text_feature_builder import build_text_features
from lifePivot_.app.modules.career.schema import CareerRequest, CareerResult


def build_career_result(request: CareerRequest) -> CareerResult:
    text = preprocess_career_text(request.target_job)
    features = build_text_features(text)
    candidates = cosine_match(features) + sentence_bert_match(features)
    ranked = rank_recommendations(candidates)
    return CareerResult(target_job=text, recommendations=ranked)
