# File: backend/models/meme_model.py

from typing import List, Dict
from utils.image_utils import download_image
from utils.logger import get_logger

logger = get_logger(__name__)

class MemeAnalysisModel:
    """
    Placeholder for YOLO + OCR + text-aggression pipeline.
    For now returns offensive_score = 0.0 for all images,
    so the system still runs and you can test the text + extension loop.
    """

    def __init__(self):
        logger.info("MemeAnalysisModel initialized (stub).")
        # TODO: load YOLO model + OCR here later

    def analyze_images(self, image_urls: List[str]) -> List[Dict]:
        results = []
        for url in image_urls:
            # In future:
            #   img = download_image(url)
            #   run YOLO -> text regions
            #   OCR on regions -> texts
            #   call TextAggressionModel on extracted texts
            #   combine into offensive_score
            img = download_image(url)
            if img is None:
                score = 0.0
            else:
                score = 0.0  # placeholder

            results.append({
                "image_url": url,
                "offensive_score": float(score),
            })
        return results
