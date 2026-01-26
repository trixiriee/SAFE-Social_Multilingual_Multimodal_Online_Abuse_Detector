# File: backend/models/fusion.py

from typing import Dict, List
from config import settings

class FusionEngine:
    """
    Combines:
      - max_text_aggression
      - max_meme_offensive
      - repetition_score
      - intent_to_harm
    into one final score + decision.
    """

    def __init__(
        self,
        alpha: float = None,
        beta: float = None,
        gamma: float = None,
        delta: float = None,
        threshold_warn: float = None,
        threshold_blur: float = None,
        threshold_block: float = None,
    ):
        self.alpha = alpha if alpha is not None else settings.FUSION_ALPHA
        self.beta = beta if beta is not None else settings.FUSION_BETA
        self.gamma = gamma if gamma is not None else settings.FUSION_GAMMA
        self.delta = delta if delta is not None else settings.FUSION_DELTA
        self.threshold_warn = threshold_warn if threshold_warn is not None else settings.THRESH_WARN
        self.threshold_blur = threshold_blur if threshold_blur is not None else settings.THRESH_BLUR
        self.threshold_block = threshold_block if threshold_block is not None else settings.THRESH_BLOCK

    def fuse(
        self,
        text_scores: List[float],
        meme_scores: List[float],
        conv_scores: Dict
    ) -> Dict:
        max_text_aggr = max(text_scores) if text_scores else 0.0
        max_meme_off = max(meme_scores) if meme_scores else 0.0
        repetition = conv_scores.get("repetition_score", 0.0)
        intent = conv_scores.get("intent_to_harm", 0.0)

        final_score = (
            self.alpha * max_text_aggr +
            self.beta * max_meme_off +
            self.gamma * repetition +
            self.delta * intent
        )

        if final_score >= self.threshold_block:
            label = "cyberbullying"
            severity = "high"
            action = "block"
        elif final_score >= self.threshold_blur:
            label = "aggressive"
            severity = "medium"
            action = "blur"
        elif final_score >= self.threshold_warn:
            label = "potentially_aggressive"
            severity = "low"
            action = "warn"
        else:
            label = "normal"
            severity = "none"
            action = "none"

        return {
            "final_score": float(final_score),
            "label": label,
            "severity": severity,
            "action": action,
        }
