"""
ml/routers/predict.py — POST /predict endpoint

Accepts raw text, runs ML inference, returns a structured result.

Swap the placeholder logic in `_run_inference()` for a real model call:
  - Load a model from ml/models/  (e.g. via transformers, torch, sklearn)
  - Call model.predict() / pipeline() here
  - Return the result in the PredictResponse schema
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter()


# ---------------------------------------------------------------------------
# Request / Response schemas
# ---------------------------------------------------------------------------

class PredictRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=15_000, description="Raw text to process")
    language: str = Field(default="en", description="ISO 639-1 language code (e.g. 'en', 'fr')")


class PredictResponse(BaseModel):
    result: str = Field(..., description="ML-processed output")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Model confidence score (0–1)")
    language: str = Field(..., description="Language used during inference")


# ---------------------------------------------------------------------------
# Inference logic (replace with real model call)
# ---------------------------------------------------------------------------

def _run_inference(text: str, language: str) -> dict:
    """
    Placeholder inference function.

    Replace this body with actual model loading and prediction, e.g.:
        pipeline = load_model("ml/models/my_model")
        output = pipeline(text)
        return {"result": output["label"], "confidence": output["score"]}
    """
    # TODO: load and call your model here
    processed = f"Processed ({language}): {text.strip()}"
    return {
        "result": processed,
        "confidence": 1.0,   # placeholder confidence
    }


# ---------------------------------------------------------------------------
# Route
# ---------------------------------------------------------------------------

@router.post("/", response_model=PredictResponse, summary="Run ML inference on text")
async def predict(payload: PredictRequest):
    """
    Receive raw text, run ML inference, return structured result.

    **Request body**
    - `text`     — raw string to process (1–15 000 chars)
    - `language` — ISO 639-1 code, default `"en"`

    **Response**
    - `result`     — ML output string
    - `confidence` — model confidence score between 0 and 1
    - `language`   — language that was used
    """
    try:
        inference = _run_inference(payload.text, payload.language)
        return PredictResponse(
            result=inference["result"],
            confidence=inference["confidence"],
            language=payload.language,
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"ML inference failed: {str(exc)}")
