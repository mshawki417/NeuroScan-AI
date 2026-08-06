import os
from pathlib import Path

# Load .env if present
try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).parent.parent / ".env")
except ImportError:
    pass

BASE_DIR = Path(__file__).parent.parent

# ── ONNX model paths (for /predict) ─────────────────────────────────────────
MODEL_PATHS = {
    "convnext_tiny":   BASE_DIR / "model" / "convnext_tiny.onnx",
    "efficientnet_b4": BASE_DIR / "model" / "efficientnet_b4.onnx",
}

# Default model
DEFAULT_MODEL = "convnext_tiny"

# Class labels (same order as training)
CLASS_LABELS = ["glioma", "meningioma", "notumor", "pituitary"]

CLASS_INFO = {
    "glioma":     {"label": "Glioma",     "arabic": "ورم دبقي",     "badge": "red",    "risk": "high"},
    "meningioma": {"label": "Meningioma", "arabic": "ورم سحائي",    "badge": "yellow", "risk": "medium"},
    "notumor":    {"label": "No Tumor",   "arabic": "لا يوجد ورم",  "badge": "green",  "risk": "none"},
    "pituitary":  {"label": "Pituitary",  "arabic": "ورم النخامية", "badge": "blue",   "risk": "medium"},
}

# Image preprocessing
IMG_SIZE = 224
IMG_MEAN  = [0.485, 0.456, 0.406]
IMG_STD   = [0.229, 0.224, 0.225]

# ── CORS (from .env or default to dev origins) ───────────────────────────────
_cors_env = os.getenv("ALLOWED_ORIGINS", "")
if _cors_env.strip():
    ALLOWED_ORIGINS = [o.strip() for o in _cors_env.split(",") if o.strip()]
else:
    # Default: allow local development
    ALLOWED_ORIGINS = [
        "http://localhost:4200",
        "http://localhost:4201",
        "http://127.0.0.1:4200",
        "http://127.0.0.1:4201",
    ]

# API settings
MAX_FILE_SIZE_MB   = 50
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".dcm", ".bmp", ".tiff"}
