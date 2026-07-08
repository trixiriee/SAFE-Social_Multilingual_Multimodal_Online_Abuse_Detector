# SAFE – Social Multilingual Multimodal Abuse Detector

## Overview
SAFE is a web-based system that detects abusive content in multilingual(Hindi, Telugu, Tamil, Malayalam, Kannada, Urdu),
code-mixed text and images(Memes) using NLP(BERT and RoBERTa) and OCR-based analysis.

## Features
- Multilingual & code-mixed text abuse detection
- OCR-based meme and image text extraction
- Combined text + image decision pipeline
- User-facing moderation controls
- centralized user control 

## Tech Stack
Python, Deep Learning, NLP(BERT,RoBERTa), YOLOv4, YOLOv5, OCR (Tesseract), FastAPI
HTML,CSS,Js

## Datasets
HASOC Dataset
Dravidian Codemixed Dataset
Twitter Hatespeech Dataset
US Election 2019 Dataset

## Architecture
the architechture is the combination of text and image level models 
-- the comments are handled by BERT model 
-- the text inside meme images is scanned using OCR and then passed down to BERT

                  webpage is scanned 
                          |
         the comments/images are extracted from the DOM
                          |
            comments are passsed down to BERT 
                          |
            images are passed down to the OCR
                          |
     the backend gives response such as offensive or not
                          |
    based on the response the content is managed such flagging/blocking/blurring
             (according to the user preferences)
             

