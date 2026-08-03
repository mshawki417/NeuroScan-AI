"""
Image preprocessing pipeline — matches training pipeline exactly.
Applies CLAHE + normalization + resize.
"""
import io
import time
import numpy as np
from PIL import Image
import logging

logger = logging.getLogger(__name__)

try:
    import cv2
    CV2_AVAILABLE = True
except ImportError:
    CV2_AVAILABLE = False

from app.config import IMG_SIZE, IMG_MEAN, IMG_STD


def preprocess_image(file_bytes: bytes) -> tuple[np.ndarray, dict]:
    """
    Preprocess MRI image for model inference.
    Returns: (preprocessed_tensor, metadata_dict)
    """
    t0 = time.time()
    meta = {}

    # Load image
    img = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    meta["original_size"] = f"{img.width}×{img.height}"
    meta["original_mode"] = img.mode

    img_np = np.array(img)

    # CLAHE on L channel (matches training)
    if CV2_AVAILABLE:
        img_bgr = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)
        lab     = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        clahe   = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        l_clahe = clahe.apply(l)
        lab_clahe = cv2.merge([l_clahe, a, b])
        img_bgr = cv2.cvtColor(lab_clahe, cv2.COLOR_LAB2BGR)
        img_np  = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
        meta["clahe"] = True
    else:
        meta["clahe"] = False

    # Resize
    img_pil = Image.fromarray(img_np).resize((IMG_SIZE, IMG_SIZE), Image.LANCZOS)
    img_np  = np.array(img_pil, dtype=np.float32) / 255.0

    # Normalize (ImageNet stats)
    mean = np.array(IMG_MEAN, dtype=np.float32)
    std  = np.array(IMG_STD,  dtype=np.float32)
    img_np = (img_np - mean) / std

    # HWC → NCHW
    tensor = np.transpose(img_np, (2, 0, 1))[np.newaxis, ...].astype(np.float32)

    meta["preprocessed_size"] = f"{IMG_SIZE}×{IMG_SIZE}"
    meta["preprocess_time_ms"] = round((time.time() - t0) * 1000, 1)

    return tensor, meta
