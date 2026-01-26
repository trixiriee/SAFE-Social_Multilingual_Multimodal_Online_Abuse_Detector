import torch
import requests
from PIL import Image
from io import BytesIO
from transformers import CLIPProcessor, CLIPModel

DEVICE = "cpu"  # keep CPU for demo stability

# Load CLIP once
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(DEVICE)
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

# Prompts CLIP will compare against
LABELS = [
    "a normal image",
    "an abusive meme",
    "a hateful meme",
    "a cyberbullying image"
]

def predict_image_abuse(image_url: str) -> float:
    """
    Returns abuse probability score between 0 and 1
    """
    try:
        response = requests.get(image_url, timeout=5)
        image = Image.open(BytesIO(response.content)).convert("RGB")

        inputs = processor(
            text=LABELS,
            images=image,
            return_tensors="pt",
            padding=True
        )

        with torch.no_grad():
            outputs = model(**inputs)

        probs = outputs.logits_per_image.softmax(dim=1)

        # Take max of abusive labels (ignore "normal image")
        abuse_score = float(probs[0][1:].max())
        return abuse_score

    except Exception as e:
        print("CLIP image error:", e)
        return 0.0
