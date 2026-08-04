"""
PyTorch model manager — loads timm models from .pt checkpoints.
Used for Grad-CAM visualisation (gradients not available in ONNX).
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

# ── Checkpoint paths ─────────────────────────────────────────────────────────
# Render environment: files have no .pt extension
# Local dev:          files have .pt extension
# → tries both automatically
def _resolve_ckpt(stem: str) -> Path:
    """Return the checkpoint path that actually exists, preferring no-extension (Render)."""
    base = Path("model")
    no_ext = base / stem          # e.g. model/convnext_tiny_model   ← Render
    with_pt = base / f"{stem}.pt" # e.g. model/convnext_tiny.pt      ← local

    if no_ext.exists():
        return no_ext
    if with_pt.exists():
        return with_pt
    return no_ext  # fallback (will trigger "not found" warning later)


CKPT_PATHS: Dict[str, Path] = {
    "efficientnet_b4": _resolve_ckpt("efficientnet_b4_model"),
    "convnext_tiny":   _resolve_ckpt("convnext_tiny_model"),
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

    ckpt_path = _resolve_ckpt(
        "efficientnet_b4_model" if key == "efficientnet_b4" else "convnext_tiny_model"
    )
    arch = ARCH_MAP.get(key)

    if arch is None:
        logger.error(f"Unknown model key: {key}")
        return None

    if not ckpt_path.exists():
        logger.warning(
            f"PyTorch checkpoint not found: {ckpt_path}\n"
            f"Grad-CAM will use demo mode for '{key}'.\n"
            f"Expected at: {ckpt_path.resolve()}"
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
    logger.info(f"✓ Loaded {key} from {ckpt_path}")
    return model


def get_torch_model(key: str) -> Optional[torch.nn.Module]:
    return _models.get(key)


def loaded_torch_models() -> list:
    return list(_models.keys())


def preload_all():
    """Called at startup to load all available checkpoints."""
    for key in CKPT_PATHS:
        try:
            load_torch_model(key)
        except Exception as e:
            logger.warning(f"Could not load {key}: {e}")
