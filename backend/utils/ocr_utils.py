# File: backend/utils/ocr_utils.py

from typing import List, Tuple, Optional

try:
    import easyocr
except ImportError:
    easyocr = None

from PIL import Image

class OCREngine:
    def __init__(self, languages: List[str] = ["en"]):
        self.reader = None
        if easyocr is not None:
            self.reader = easyocr.Reader(languages)
        # If easyocr is None, you can later integrate Tesseract instead.

    def extract_text(self, image: Image.Image) -> List[str]:
        if self.reader is None:
            return []
        try:
            result = self.reader.readtext(image)
            texts = [item[1] for item in result]
            return texts
        except Exception:
            return []
