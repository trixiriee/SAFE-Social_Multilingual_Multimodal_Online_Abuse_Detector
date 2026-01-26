# backend/models/text_model.py

import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from pathlib import Path

class TextAggressionModel:
    def __init__(self, model_path: Path):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

        # DO NOT convert to string
        # Pass Path object directly
        self.tokenizer = AutoTokenizer.from_pretrained(
            model_path,
            local_files_only=True
        )

        self.model = AutoModelForSequenceClassification.from_pretrained(
            model_path,
            local_files_only=True
        )

        self.model.to(self.device)
        self.model.eval()

    def predict_scores(self, texts):
        inputs = self.tokenizer(
            texts,
            padding=True,
            truncation=True,
            max_length=64,
            return_tensors="pt"
        ).to(self.device)

        with torch.no_grad():
            outputs = self.model(**inputs)
            probs = torch.softmax(outputs.logits, dim=1)

        return probs[:, 1].cpu().tolist()
