from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from typing import Dict
from contextlib import asynccontextmanager

from backend.config import (
    TEXT_MODEL_NAME,
    THRESH_BLOCK,
    THRESH_BLUR,
    THRESH_WARN
)
from backend.models.text_model import TextAggressionModel
from backend.models.image_clip import predict_image_abuse

# ---------- GLOBALS ----------
text_model = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Runs BEFORE the server starts accepting requests
    global text_model
    print("Loading text model...")
    try:
        text_model = TextAggressionModel(TEXT_MODEL_NAME)
        print("Text model loaded successfully.")
    except Exception as e:
        print(f"ERROR loading text model: {e}")
        raise  # This will show you the real error
    yield
    # Runs on shutdown (cleanup if needed)
    print("Shutting down...")

app = FastAPI(title="Cyberbullying Detection API", lifespan=lifespan)

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

    images = payload.get("images", [])
    for img in images:
        try:
            score = predict_image_abuse(img["src"])
            action = map_score_to_action(score)
            decisions.append({
                "id": img["id"],
                "item_type": "image",
                "score": score,
                "action": action,
                "badge": "🚫 Abusive Meme" if action != "none" else ""
            })
        except Exception as e:
            print(f"Image error: {e}")

    return {"decisions": decisions}

@app.get("/")
def root():
    return {"status": "API running"}