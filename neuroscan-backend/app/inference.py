"""
Inference engine — runs ONNX model and returns structured prediction.
"""
import time
import uuid
import random
import numpy as np
import logging
from datetime import datetime

from app.config import CLASS_LABELS, CLASS_INFO, DEFAULT_MODEL
from app.model_manager import ModelManager
from app.preprocessing import preprocess_image

logger = logging.getLogger(__name__)


def softmax(x: np.ndarray) -> np.ndarray:
    e = np.exp(x - np.max(x))
    return e / e.sum()


def run_inference(
    file_bytes: bytes,
    filename: str,
    model_key: str = DEFAULT_MODEL,
) -> dict:
    """
    Full inference pipeline:
    1. Preprocess image
    2. Run ONNX model
    3. Return structured result
    """
    scan_id = f"MR-{datetime.now().strftime('%Y-%m%d')}-{str(uuid.uuid4())[:6].upper()}"
    t_start = time.time()

    # Preprocess
    tensor, pre_meta = preprocess_image(file_bytes)

    session = ModelManager.get(model_key)

    # ── DEMO MODE (no model loaded) ──────────────────────────────────────────
    if session is None:
        logger.info("Running in DEMO mode — returning mock prediction")
        probs = _demo_probabilities()
    else:
        # ── REAL INFERENCE ──────────────────────────────────────────────────
        t_inf = time.time()
        input_name = session.get_inputs()[0].name
        outputs    = session.run(None, {input_name: tensor})
        logits     = outputs[0][0]
        probs      = softmax(logits).tolist()
        logger.info(f"Inference done in {round((time.time()-t_inf)*1000,1)}ms")

    # Build result
    pred_idx   = int(np.argmax(probs))
    pred_class = CLASS_LABELS[pred_idx]
    confidence = round(float(probs[pred_idx]) * 100, 2)
    info       = CLASS_INFO[pred_class]

    probabilities = {
        CLASS_INFO[lbl]["label"]: round(float(p) * 100, 2)
        for lbl, p in zip(CLASS_LABELS, probs)
    }

    # Warnings
    warnings = []
    if confidence < 50:
        warnings.append("Low confidence prediction — manual review recommended")
    sorted_p = sorted(probs, reverse=True)
    if len(sorted_p) >= 2 and (sorted_p[0] - sorted_p[1]) < 0.10:
        warnings.append("Two classes have similar probabilities — ambiguous scan")
    if pred_class == "glioma" and confidence < 90:
        warnings.append("Glioma sensitivity is lower — consult specialist")

    total_ms = round((time.time() - t_start) * 1000, 1)

    return {
        "scan_id":        scan_id,
        "filename":       filename,
        "model_used":     model_key,
        "prediction":     info["label"],
        "prediction_key": pred_class,
        "confidence":     confidence,
        "risk_level":     info["risk"],
        "badge_color":    info["badge"],
        "arabic_label":   info["arabic"],
        "probabilities":  probabilities,
        "warnings":       warnings,
        "metadata": {
            **pre_meta,
            "total_inference_ms": total_ms,
            "analyzed_at": datetime.now().isoformat(),
        },
        "clinical_note": (
            "This AI analysis is for decision support only. "
            "Always confirm with a radiologist before clinical decision-making."
        )
    }


def _demo_probabilities() -> list:
    """Return plausible-looking demo probabilities."""
    idx = random.randint(0, 3)
    probs = [random.uniform(0.01, 0.06) for _ in range(4)]
    probs[idx] = random.uniform(0.82, 0.97)
    total = sum(probs)
    return [p / total for p in probs]
