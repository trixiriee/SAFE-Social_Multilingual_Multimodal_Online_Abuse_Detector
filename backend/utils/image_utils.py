# File: backend/utils/image_utils.py

from typing import Optional
from PIL import Image
import io
import requests

from config import settings

def download_image(url: str) -> Optional[Image.Image]:
    try:
        resp = requests.get(url, timeout=settings.IMAGE_DOWNLOAD_TIMEOUT)
        resp.raise_for_status()
        img = Image.open(io.BytesIO(resp.content)).convert("RGB")
        return img
    except Exception:
        return None
