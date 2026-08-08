"""
PyTorch model manager — loads timm models from .pt checkpoints.
Used for Grad-CAM visualisation (gradients not available in ONNX).

Supports two filename styles automatically:
  - Render:    model/efficientnet_b4_model   (no extension)
  - Local dev: model/efficientnet_b4.pt      (with .pt extension)
"""
from __future__ import annotations
import logging
from pathlib import Path
from typing import Dict, Optional

import torch

logger = logging.getLogger(__name__)

# Architecture registry (timm model names)
ARCH_MAP = {
    "efficientnet_b4": "efficientnet_b4",
    "convnext_tiny":   "convnext_tiny",
}

# Model file stems on Render (no extension)
_RENDER_STEMS = {
    "efficientnet_b4": "efficientnet_b4_model",
    "convnext_tiny":   "convnext_tiny_model",
}

# Model file stems for local dev (with .pt)
_LOCAL_STEMS = {
    "efficientnet_b4": "efficientnet_b4",
    "convnext_tiny":   "convnext_tiny",
}


def _resolve_ckpt(key: str) -> Optional[Path]:
    """
    Return the checkpoint Path that actually exists on disk.
    Priority:
      1. Render-style stem (no extension)  → model/efficientnet_b4_model
      2. Local .pt style                   → model/efficientnet_b4.pt
      3. Any .pt file whose name contains the key (covers GitHub Release filenames)
         e.g. model/efficientnet_b4_ep016_score0.9845.pt
    Returns None if nothing found.
    """
    base = Path("model")

    # 1. Render-style (no extension)
    render_path = base / _RENDER_STEMS[key]
    if render_path.exists():
        return render_path

    # 2. Local .pt style
    local_path = base / f"{_LOCAL_STEMS[key]}.pt"
    if local_path.exists():
        return local_path

    # 3. Any .pt file whose stem contains the key (GitHub Release naming)
    if base.exists():
        for f in base.glob("*.pt"):
            if key.replace("_", "") in f.stem.replace("_", "").lower() or \
               all(part in f.stem.lower() for part in key.split("_")):
                logger.info(f"[resolve] Found release-style checkpoint: {f}")
                return f

    return None


# Pre-build CKPT_PATHS at import time (used by routes.py)
CKPT_PATHS: Dict[str, Path] = {
    key: Path("model") / _RENDER_STEMS[key]   # default; actual resolution happens in load_torch_model
    for key in ARCH_MAP
}

_models: Dict[str, torch.nn.Module] = {}
NUM_CLASSES = 4


def load_torch_model(key: str) -> Optional[torch.nn.Module]:
    """Load timm model from checkpoint. Returns None if file not found."""
    if key in _models:
        return _models[key]

    try:
        import timm
    except ImportError:
        logger.error("timm not installed — pip install timm")
        return None

    arch = ARCH_MAP.get(key)
    if arch is None:
        logger.error(f"Unknown model key: {key}")
        return None

    ckpt_path = _resolve_ckpt(key)
    if ckpt_path is None:
        logger.warning(
            f"PyTorch checkpoint not found for '{key}'.\n"
            f"  Tried: model/{_RENDER_STEMS[key]}  (Render style)\n"
            f"  Tried: model/{_LOCAL_STEMS[key]}.pt (local style)\n"
            f"  GradCAM will fall back to demo mode."
        )
        return None

    logger.info(f"Loading PyTorch model [{key}] from {ckpt_path}")

    model = timm.create_model(arch, pretrained=False, num_classes=NUM_CLASSES)

    ckpt = torch.load(str(ckpt_path), map_location="cpu", weights_only=False)

    # Support different checkpoint formats
    state_dict = (
        ckpt.get("model_state_dict") or
        ckpt.get("state_dict") or
        ckpt.get("model") or
        ckpt  # bare state dict
    )

    # Strip 'module.' prefix (DataParallel)
    state_dict = {k.replace("module.", ""): v for k, v in state_dict.items()}

    missing, unexpected = model.load_state_dict(state_dict, strict=False)
    if missing:
        logger.warning(f"Missing keys ({len(missing)}): {missing[:5]}")
    if unexpected:
        logger.warning(f"Unexpected keys ({len(unexpected)}): {unexpected[:5]}")

    model.eval()
    _models[key] = model
    logger.info(f"✓ Loaded [{key}] from {ckpt_path}")
    return model


def get_torch_model(key: str) -> Optional[torch.nn.Module]:
    return _models.get(key)


def loaded_torch_models() -> list:
    return list(_models.keys())


def preload_all():
    """Called at startup to load all available checkpoints."""
    for key in ARCH_MAP:
        try:
            load_torch_model(key)
        except Exception as e:
            logger.warning(f"Could not load {key}: {e}")
