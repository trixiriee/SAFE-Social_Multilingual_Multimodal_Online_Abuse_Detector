from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from typing import Dict

from backend.config import (
    TEXT_MODEL_NAME,
    THRESH_BLOCK,
    THRESH_BLUR,
    THRESH_WARN
)
from backend.models.text_model import TextAggressionModel
from backend.models.image_clip import predict_image_abuse

app = FastAPI(title="Cyberbullying Detection API")

# ---------- CORS ----------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- STATIC FILES ----------
app.mount("/static", StaticFiles(directory="backend/static"), name="static")

# ---------- MODELS ----------
text_model = TextAggressionModel(TEXT_MODEL_NAME)

# ---------- UTILS ----------
def map_score_to_action(score: float) -> str:
    if score >= THRESH_BLOCK:
        return "block"
    elif score >= THRESH_BLUR:
        return "blur"
    elif score >= THRESH_WARN:
        return "warn"
    return "none"

# ---------- API ----------
@app.post("/analyze_page")
def analyze_page(payload: Dict):
    decisions = []

    # -------- TEXT MODERATION --------
    messages = payload.get("messages", [])
    texts = [m["text"] for m in messages if "text" in m]

    if texts:
        scores = text_model.predict_scores(texts)
        for msg, score in zip(messages, scores):
            decisions.append({
                "id": msg["id"],
                "item_type": "text",
                "score": float(score),
                "action": map_score_to_action(score)
            })

    # -------- IMAGE MODERATION (CLIP) --------
    images = payload.get("images", [])

    for img in images:
        score = predict_image_abuse(img["src"])
        action = map_score_to_action(score)

        decisions.append({
            "id": img["id"],
            "item_type": "image",
            "score": score,
            "action": action,
            "badge": "🚫 Abusive Meme" if action != "none" else ""
        })

    return {"decisions": decisions}

@app.get("/")
def root():
    return {"status": "API running"}
