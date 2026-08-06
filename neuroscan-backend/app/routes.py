"""
FastAPI route definitions.
"""
import time
import uuid
import logging
from pathlib import Path
from typing import Optional
from datetime import datetime

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


# ─── Dual Predict (GradCAM — BBox + Heatmap) ────────────────────────────────

@router.post("/predict/dual", tags=["Inference"])
async def predict_dual(
    file: UploadFile = File(..., description="MRI scan image (JPG/PNG/DCM)"),
):
    """
    Run BOTH models on the uploaded MRI scan using GradCAM:
    - EfficientNet-B4 → Bounding Box overlay
    - ConvNeXt-Tiny   → GradCAM Heatmap overlay

    Returns base64-encoded images + predictions for both models.
    Falls back to demo mode if PyTorch models are not loaded.
    """
    # Validate extension
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_EXTENSIONS and ext != "":
        raise HTTPException(400, f"Unsupported file type: {ext}. Allowed: {ALLOWED_EXTENSIONS}")

    # Read & size-check
    contents = await file.read()
    mb = len(contents) / (1024 * 1024)
    if mb > MAX_FILE_SIZE_MB:
        raise HTTPException(413, f"File too large ({mb:.1f} MB). Max: {MAX_FILE_SIZE_MB} MB")

    scan_id = f"MR-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:6].upper()}"
    t_start = time.time()
    warnings = []

    # ── Try GradCAM (PyTorch models) ─────────────────────────────────────────
    demo_mode = False
    bbox_out  = None
    heat_out  = None

    try:
        from app.torch_model_manager import load_torch_model
        from gradcam import generate_dual_output

        model_bbox = load_torch_model("efficientnet_b4")
        model_heat = load_torch_model("convnext_tiny")

        if model_bbox is not None and model_heat is not None:
            dual = generate_dual_output(contents, model_bbox, model_heat)
            bbox_out = dual
            heat_out = dual
        else:
            demo_mode = True
            warnings.append("PyTorch models not loaded — running in demo mode")
    except Exception as e:
        logger.warning(f"GradCAM failed, falling back to demo: {e}")
        demo_mode = True
        warnings.append(f"GradCAM unavailable — demo mode active")

    # ── Demo mode: use ONNX inference for predictions, no images ─────────────
    if demo_mode:
        try:
            bbox_result = run_inference(contents, file.filename or "scan.jpg", model_key="efficientnet_b4")
            heat_result = run_inference(contents, file.filename or "scan.jpg", model_key="convnext_tiny")
        except Exception:
            import random
            # Pure demo — both models offline
            bbox_result = _demo_result("EfficientNet-B4")
            heat_result = _demo_result("ConvNeXt-Tiny")

        return JSONResponse(content={
            "scan_id":       scan_id,
            "filename":      file.filename,
            "demo_mode":     True,
            "total_ms":      round((time.time() - t_start) * 1000, 1),
            "analyzed_at":   datetime.now().isoformat(),
            "warnings":      warnings,
            "clinical_note": "Demo result — connect backend for real GradCAM output.",
            "bbox": {
                "model":      "EfficientNet-B4",
                "image_b64":  None,
                "prediction": {
                    "label":         bbox_result["prediction"],
                    "arabic":        bbox_result["arabic_label"],
                    "confidence":    bbox_result["confidence"],
                    "badge_color":   bbox_result["badge_color"],
                    "risk_level":    bbox_result["risk_level"],
                    "probabilities": bbox_result["probabilities"],
                }
            },
            "heatmap": {
                "model":      "ConvNeXt-Tiny",
                "image_b64":  None,
                "prediction": {
                    "label":         heat_result["prediction"],
                    "arabic":        heat_result["arabic_label"],
                    "confidence":    heat_result["confidence"],
                    "badge_color":   heat_result["badge_color"],
                    "risk_level":    heat_result["risk_level"],
                    "probabilities": heat_result["probabilities"],
                }
            },
        })

    # ── Real GradCAM output ──────────────────────────────────────────────────
    dual = bbox_out  # same dict from generate_dual_output

    # Fall back to ONNX result if either model image failed
    bbox_pred = dual.get("bbox_prediction", {})
    heat_pred = dual.get("heat_prediction", {})

    return JSONResponse(content={
        "scan_id":       scan_id,
        "filename":      file.filename,
        "demo_mode":     False,
        "total_ms":      round((time.time() - t_start) * 1000, 1),
        "analyzed_at":   datetime.now().isoformat(),
        "warnings":      warnings,
        "clinical_note": (
            "This AI analysis is for decision support only. "
            "Always confirm with a radiologist before clinical decision-making."
        ),
        "bbox": {
            "model":      "EfficientNet-B4",
            "image_b64":  dual.get("bbox_image_b64"),
            "prediction": {
                "label":         bbox_pred.get("label", "Unknown"),
                "arabic":        bbox_pred.get("arabic", ""),
                "confidence":    bbox_pred.get("confidence", 0.0),
                "badge_color":   bbox_pred.get("badge_color", "blue"),
                "risk_level":    bbox_pred.get("risk_level", "none"),
                "probabilities": bbox_pred.get("probabilities", {}),
            }
        },
        "heatmap": {
            "model":      "ConvNeXt-Tiny",
            "image_b64":  dual.get("heat_image_b64"),
            "prediction": {
                "label":         heat_pred.get("label", "Unknown"),
                "arabic":        heat_pred.get("arabic", ""),
                "confidence":    heat_pred.get("confidence", 0.0),
                "badge_color":   heat_pred.get("badge_color", "blue"),
                "risk_level":    heat_pred.get("risk_level", "none"),
                "probabilities": heat_pred.get("probabilities", {}),
            }
        },
    })


# ─── Demo helper ─────────────────────────────────────────────────────────────

def _demo_result(model_name: str) -> dict:
    """Generate a plausible demo prediction result."""
    import random
    classes = list(CLASS_INFO.keys())
    pred_cls = random.choice(classes)
    info = CLASS_INFO[pred_cls]
    confidence = round(random.uniform(82, 97), 2)
    probs_raw = [random.uniform(0.01, 0.06) for _ in classes]
    pred_idx = classes.index(pred_cls)
    probs_raw[pred_idx] = confidence / 100
    total = sum(probs_raw)
    probs = {CLASS_INFO[c]["label"]: round(p / total * 100, 2) for c, p in zip(classes, probs_raw)}
    return {
        "prediction":   info["label"],
        "arabic_label": info["arabic"],
        "confidence":   confidence,
        "badge_color":  info["badge"],
        "risk_level":   info["risk"],
        "probabilities": probs,
    }

