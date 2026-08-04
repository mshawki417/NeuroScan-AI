"""
Model Manager — loads and caches ONNX models.
Supports both ConvNeXt-Tiny and EfficientNet-B4.
"""
import time
import logging
from pathlib import Path
from typing import Dict, Optional
import numpy as np

logger = logging.getLogger(__name__)

# Try importing onnxruntime
try:
    import onnxruntime as ort
    ORT_AVAILABLE = True
except ImportError:
    ORT_AVAILABLE = False
    logger.warning("onnxruntime not installed — running in DEMO mode")


class ModelManager:
    """Singleton model manager with lazy loading."""

    _sessions: Dict[str, any] = {}
    _load_times: Dict[str, float] = {}

    @classmethod
    def load(cls, model_key: str, model_path: Path) -> Optional[any]:
        """Load model into session cache."""
        if model_key in cls._sessions:
            return cls._sessions[model_key]

        if not ORT_AVAILABLE:
            logger.info(f"DEMO mode: skipping load of {model_key}")
            return None

        if not model_path.exists():
            raise FileNotFoundError(
                f"Model file not found: {model_path}\n"
                f"Place your ONNX model at: {model_path}"
            )

        logger.info(f"Loading model: {model_key} from {model_path}")
        t0 = time.time()

        providers = ["CPUExecutionProvider"]
        try:
            from onnxruntime import get_available_providers
            if "CUDAExecutionProvider" in get_available_providers():
                providers = ["CUDAExecutionProvider", "CPUExecutionProvider"]
        except Exception:
            pass

        session = ort.InferenceSession(str(model_path), providers=providers)
        cls._sessions[model_key] = session
        cls._load_times[model_key] = round(time.time() - t0, 2)
        logger.info(f"Loaded {model_key} in {cls._load_times[model_key]}s")
        return session

    @classmethod
    def get(cls, model_key: str) -> Optional[any]:
        return cls._sessions.get(model_key)

    @classmethod
    def loaded_models(cls) -> list:
        return list(cls._sessions.keys())

    @classmethod
    def load_times(cls) -> Dict[str, float]:
        return cls._load_times
