from pathlib import Path

BASE_DIR = Path(__file__).parent.parent

# ── ONNX model paths (for /predict) ─────────────────────────────────────────
# Not used in production (no .onnx files) — kept for compatibility
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

# API settings
ALLOWED_ORIGINS    = ["*"]
MAX_FILE_SIZE_MB   = 50
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".dcm", ".bmp", ".tiff"}
