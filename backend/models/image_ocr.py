import easyocr
import requests
from PIL import Image
from io import BytesIO

# ONE stable OCR reader (no conflicts)
reader = easyocr.Reader(
    ["en", "hi"],
    gpu=False
)

def extract_text_from_image(image_url: str) -> str:
    try:
        response = requests.get(image_url, timeout=5)
        image = Image.open(BytesIO(response.content)).convert("RGB")

        results = reader.readtext(image, detail=0)
        return " ".join(results)

    except Exception:
        return ""
