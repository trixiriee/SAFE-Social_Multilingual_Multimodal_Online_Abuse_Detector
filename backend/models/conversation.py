# File: backend/models/conversation.py

from typing import List, Dict
import math
import time

from config import settings

class ConversationScorer:
    """
    Computes:
      - aggression_level: avg aggression
      - repetition_score: time-decayed sum of aggression
      - intent_to_harm: weighted mean of aggression
    """

    def __init__(self, decay_lambda: float = None):
        self.decay_lambda = decay_lambda or settings.DECAY_LAMBDA

    def score_conversation(self, messages: List[Dict]) -> Dict:
        """
        messages: list of dict:
        {
            "sender": str,
            "receiver": str,
            "text": str,
            "timestamp": float,
            "aggression_score": float in [0,1],
            "weight": float
        }
        """
        if not messages:
            return {
                "aggression_level": 0.0,
                "repetition_score": 0.0,
                "intent_to_harm": 0.0,
            }

        now = time.time()
        n = len(messages)

        # Aggression level
        agg_vals = [m.get("aggression_score", 0.0) for m in messages]
        aggression_level = sum(agg_vals) / max(1, n)

        # Repetition (time-decayed)
        repetition_score = 0.0
        for m in messages:
            a = m.get("aggression_score", 0.0)
            ts = m.get("timestamp", now)
            dt = max(0.0, now - ts)
            decay = math.exp(-self.decay_lambda * dt)
            repetition_score += a * decay

        # Intent to harm (weighted mean)
        sum_w = 0.0
        sum_aw = 0.0
        for m in messages:
            a = m.get("aggression_score", 0.0)
            w = m.get("weight", 1.0)
            sum_aw += a * w
            sum_w += w

        intent_to_harm = sum_aw / sum_w if sum_w > 0 else 0.0

        return {
            "aggression_level": float(aggression_level),
            "repetition_score": float(repetition_score),
            "intent_to_harm": float(intent_to_harm),
        }
