"""
FastAPI route definitions.
"""
import time
import logging
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, File, UploadFile, HTTPException, Query
from fastapi.responses import JSONResponse

from app.config import (
    MODEL_PATHS, DEFAULT_MODEL, CLASS_INFO,
    MAX_FILE_SIZE_MB, ALLOWED_EXTENSIONS
)
from app.model_manager import ModelManager
from app.inference import run_inference

logger = logging.getLogger(__name__)
router = APIRouter()


# ─── Health ─────────────────────────────────────────────────────────────────

@router.get("/health", tags=["System"])
def health():
    loaded = ModelManager.loaded_models()
    return {
        "status":        "ok",
        "loaded_models": loaded,
        "load_times_s":  ModelManager.load_times(),
        "demo_mode":     len(loaded) == 0,
    }


# ─── Models ─────────────────────────────────────────────────────────────────

@router.get("/models", tags=["Models"])
def list_models():
    """Return available models and their status."""
    result = []
    for key, path in MODEL_PATHS.items():
        result.append({
            "key":      key,
            "name":     key.replace("_", " ").title(),
            "path":     str(path),
            "loaded":   key in ModelManager.loaded_models(),
            "exists":   Path(path).exists(),
            "is_default": key == DEFAULT_MODEL,
            "accuracy": {"convnext_tiny": 95.69, "efficientnet_b4": 94.75}.get(key),
        })
    return {"models": result}


@router.post("/models/{model_key}/load", tags=["Models"])
def load_model(model_key: str):
    """Manually trigger model loading."""
    if model_key not in MODEL_PATHS:
        raise HTTPException(404, f"Unknown model: {model_key}. Available: {list(MODEL_PATHS.keys())}")

    try:
        ModelManager.load(model_key, MODEL_PATHS[model_key])
        return {"status": "loaded", "model": model_key}
    except FileNotFoundError as e:
        raise HTTPException(404, str(e))
    except Exception as e:
        raise HTTPException(500, f"Failed to load model: {e}")


# ─── Predict ────────────────────────────────────────────────────────────────

@router.post("/predict", tags=["Inference"])
async def predict(
    file:  UploadFile = File(..., description="MRI scan image (JPG/PNG/DCM)"),
    model: Optional[str] = Query(DEFAULT_MODEL, description="Model key to use"),
):
    """
    Run brain tumor classification on an uploaded MRI scan.
    Returns prediction, confidence, per-class probabilities, and warnings.
    """
    # Validate file extension
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_EXTENSIONS and ext != "":
        raise HTTPException(
            400,
            f"Unsupported file type: {ext}. Allowed: {ALLOWED_EXTENSIONS}"
        )

    # Validate model key
    if model not in MODEL_PATHS:
        raise HTTPException(
            400,
            f"Unknown model '{model}'. Available: {list(MODEL_PATHS.keys())}"
        )

    # Read file
    contents = await file.read()

    # File size check
    mb = len(contents) / (1024 * 1024)
    if mb > MAX_FILE_SIZE_MB:
        raise HTTPException(413, f"File too large ({mb:.1f} MB). Max: {MAX_FILE_SIZE_MB} MB")

    # Ensure model is loaded
    if model not in ModelManager.loaded_models():
        try:
            ModelManager.load(model, MODEL_PATHS[model])
        except FileNotFoundError:
            logger.warning(f"Model {model} not found — running in DEMO mode")

    try:
        result = run_inference(contents, file.filename or "scan.jpg", model_key=model)
        return JSONResponse(content=result)
    except Exception as e:
        logger.exception("Inference failed")
        raise HTTPException(500, f"Inference error: {e}")


# ─── Classes ────────────────────────────────────────────────────────────────

@router.get("/classes", tags=["Info"])
def get_classes():
    """Return tumor class definitions."""
    return {"classes": CLASS_INFO}


# ─── Stats ──────────────────────────────────────────────────────────────────

@router.get("/stats", tags=["Info"])
def get_stats():
    """Return model performance stats."""
    return {
        "models": {
            "convnext_tiny": {
                "accuracy": 95.69, "precision": 96.07,
                "recall": 95.69,   "f1": 95.63, "mcc": 0.944,
                "per_class": {
                    "glioma":     {"sensitivity": 84.25, "specificity": 99.99},
                    "meningioma": {"sensitivity": 99.25, "specificity": 95.67},
                    "notumor":    {"sensitivity": 99.99, "specificity": 98.83},
                    "pituitary":  {"sensitivity": 99.25, "specificity": 99.75},
                }
            },
            "efficientnet_b4": {
                "accuracy": 94.75, "precision": 94.90,
                "recall": 94.75,   "f1": 94.65, "mcc": 0.931,
                "per_class": {
                    "glioma":     {"sensitivity": 83.75, "specificity": 99.25},
                    "meningioma": {"sensitivity": 96.00, "specificity": 96.83},
                    "notumor":    {"sensitivity": 99.75, "specificity": 97.67},
                    "pituitary":  {"sensitivity": 99.50, "specificity": 99.25},
                }
            }
        }
    }
