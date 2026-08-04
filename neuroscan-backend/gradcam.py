"""
GradCAM engine — works with PyTorch timm models.

EfficientNet-B4  → GradCAM → threshold → Bounding Box on original image
ConvNeXt-Tiny    → GradCAM → colourised heatmap blended on original image
"""
from __future__ import annotations
import io
import base64
import logging
from typing import Optional

import numpy as np
import cv2
from PIL import Image
import torch
import torch.nn.functional as F

logger = logging.getLogger(__name__)


# ──────────────────────────────────────────────────────────────────────────────
# Hook-based GradCAM
# ──────────────────────────────────────────────────────────────────────────────

class GradCAM:
    """
    Gradient-weighted Class Activation Map.
    Works on any PyTorch model by registering forward/backward hooks.
    """

    def __init__(self, model: torch.nn.Module, target_layer: torch.nn.Module):
        self.model        = model
        self.target_layer = target_layer
        self.gradients: Optional[torch.Tensor] = None
        self.activations: Optional[torch.Tensor] = None

        self._fwd_hook = target_layer.register_forward_hook(self._save_activation)
        self._bwd_hook = target_layer.register_full_backward_hook(self._save_gradient)

    def _save_activation(self, module, input, output):
        self.activations = output.detach()

    def _save_gradient(self, module, grad_input, grad_output):
        self.gradients = grad_output[0].detach()

    def generate(
        self,
        tensor: torch.Tensor,   # (1, 3, H, W) preprocessed
        class_idx: Optional[int] = None,
    ) -> np.ndarray:
        """Return CAM as float32 numpy array (H, W) in [0, 1]."""
        self.model.eval()
        tensor = tensor.requires_grad_(True)

        logits = self.model(tensor)                     # forward
        if class_idx is None:
            class_idx = int(logits.argmax(dim=1).item())

        self.model.zero_grad()
        score = logits[0, class_idx]
        score.backward()                                # backward

        grads = self.gradients          # (1, C, h, w)
        acts  = self.activations        # (1, C, h, w)

        # Global-average-pool the gradients
        weights = grads.mean(dim=(2, 3), keepdim=True)  # (1, C, 1, 1)
        cam     = (weights * acts).sum(dim=1).squeeze()  # (h, w)
        cam     = F.relu(cam)

        # Normalise to [0, 1]
        cam = cam.cpu().numpy()
        if cam.max() > 0:
            cam = cam / cam.max()
        return cam.astype(np.float32)

    def remove_hooks(self):
        self._fwd_hook.remove()
        self._bwd_hook.remove()


# ──────────────────────────────────────────────────────────────────────────────
# Target-layer resolver
# ──────────────────────────────────────────────────────────────────────────────

def _get_target_layer(model: torch.nn.Module, arch: str) -> torch.nn.Module:
    """Return the last spatial feature layer for supported architectures."""
    arch = arch.lower()

    try:
        if "efficientnet" in arch:
            # timm EfficientNet: blocks is a Sequential of stages
            return model.blocks[-1][-1]
    except Exception:
        pass

    try:
        if "convnext" in arch:
            return model.stages[-1].blocks[-1]
    except Exception:
        pass

    # Fallback: walk named modules, take the last Conv2d
    last_conv = None
    for name, m in model.named_modules():
        if isinstance(m, torch.nn.Conv2d):
            last_conv = m
    if last_conv is not None:
        logger.warning("Using fallback last Conv2d layer")
        return last_conv

    raise ValueError(f"Cannot resolve target layer for arch: {arch}")


# ──────────────────────────────────────────────────────────────────────────────
# Preprocessing (same as inference)
# ──────────────────────────────────────────────────────────────────────────────

_MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
_STD  = np.array([0.229, 0.224, 0.225], dtype=np.float32)


def _preprocess(img_rgb: np.ndarray, size: int = 224) -> torch.Tensor:
    """Resize + CLAHE + normalise → (1,3,H,W) float32 tensor."""
    # CLAHE
    bgr   = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2BGR)
    lab   = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    lab   = cv2.merge([clahe.apply(l), a, b])
    img_rgb = cv2.cvtColor(cv2.cvtColor(lab, cv2.COLOR_LAB2BGR), cv2.COLOR_BGR2RGB)

    # Resize
    img = cv2.resize(img_rgb, (size, size), interpolation=cv2.INTER_LANCZOS4)
    img = img.astype(np.float32) / 255.0
    img = (img - _MEAN) / _STD
    return torch.tensor(img.transpose(2, 0, 1)[np.newaxis]).float()


# ──────────────────────────────────────────────────────────────────────────────
# Visualisation helpers
# ──────────────────────────────────────────────────────────────────────────────

def _cam_to_heatmap(
    cam: np.ndarray,
    orig_hw: tuple[int, int],
    colormap: int = cv2.COLORMAP_JET,
) -> np.ndarray:
    """Upsample CAM and convert to BGR heatmap (0-255)."""
    h, w = orig_hw
    cam_up = cv2.resize(cam, (w, h), interpolation=cv2.INTER_CUBIC)
    cam_up = np.clip(cam_up, 0, 1)
    heatmap = cv2.applyColorMap(np.uint8(255 * cam_up), colormap)
    return heatmap                      # BGR uint8


def make_heatmap_overlay(
    orig_rgb: np.ndarray,
    cam: np.ndarray,
    alpha: float = 0.45,
    colormap: int = cv2.COLORMAP_JET,
) -> np.ndarray:
    """Blend colourised CAM over original image → RGB uint8."""
    heatmap_bgr = _cam_to_heatmap(cam, orig_rgb.shape[:2], colormap)
    heatmap_rgb = cv2.cvtColor(heatmap_bgr, cv2.COLOR_BGR2RGB)
    blended = (alpha * heatmap_rgb + (1 - alpha) * orig_rgb).astype(np.uint8)
    return blended


def make_bbox_overlay(
    orig_rgb: np.ndarray,
    cam: np.ndarray,
    threshold: float = 0.40,
    color: tuple[int, int, int] = (0, 230, 118),   # green
    thickness: int = 3,
) -> np.ndarray:
    """
    Threshold CAM, find largest connected component, draw bounding box.
    Returns RGB uint8.
    """
    h, w = orig_rgb.shape[:2]
    cam_up = cv2.resize(cam, (w, h), interpolation=cv2.INTER_CUBIC)
    cam_up = np.clip(cam_up, 0, 1)

    # Threshold
    binary = (cam_up >= threshold).astype(np.uint8) * 255

    # Morphological cleanup
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15))
    binary = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel)

    # Find contours → pick largest
    contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    result = orig_rgb.copy()

    if contours:
        largest = max(contours, key=cv2.contourArea)
        x, y, bw, bh = cv2.boundingRect(largest)

        # Padding
        pad = 10
        x  = max(0, x - pad)
        y  = max(0, y - pad)
        bw = min(w - x, bw + 2 * pad)
        bh = min(h - y, bh + 2 * pad)

        # Draw bounding box
        cv2.rectangle(result, (x, y), (x + bw, y + bh), color, thickness)

        # Corner accents
        seg = min(bw, bh) // 4
        for (cx, cy), dx, dy in [
            ((x, y), 1, 1), ((x+bw, y), -1, 1),
            ((x, y+bh), 1, -1), ((x+bw, y+bh), -1, -1)
        ]:
            cv2.line(result, (cx, cy), (cx + dx*seg, cy), color, thickness + 1)
            cv2.line(result, (cx, cy), (cx, cy + dy*seg), color, thickness + 1)

        # Label
        label = "Tumor Region"
        font_scale, font_thick = 0.7, 2
        (tw, th), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, font_scale, font_thick)
        tx = max(0, x)
        ty = max(th + 6, y - 8)
        cv2.rectangle(result, (tx - 2, ty - th - 4), (tx + tw + 4, ty + 4), color, -1)
        cv2.putText(result, label, (tx, ty),
                    cv2.FONT_HERSHEY_SIMPLEX, font_scale, (0, 0, 0), font_thick)

    return result


# ──────────────────────────────────────────────────────────────────────────────
# Base64 helper
# ──────────────────────────────────────────────────────────────────────────────

def img_to_b64(img_rgb: np.ndarray, quality: int = 90) -> str:
    """Convert RGB numpy array → base64-encoded JPEG string."""
    img_bgr = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2BGR)
    _, buf  = cv2.imencode(".jpg", img_bgr, [cv2.IMWRITE_JPEG_QUALITY, quality])
    return base64.b64encode(buf).decode("utf-8")


# ──────────────────────────────────────────────────────────────────────────────
# Public API
# ──────────────────────────────────────────────────────────────────────────────

def generate_dual_output(
    file_bytes: bytes,
    model_bbox: torch.nn.Module,    # EfficientNet-B4 → bounding box
    model_heat: torch.nn.Module,    # ConvNeXt-Tiny   → heatmap
    arch_bbox: str = "efficientnet_b4",
    arch_heat: str = "convnext_tiny",
    class_idx: Optional[int] = None,
) -> dict:
    """
    Run both models on the same image.

    Returns dict with:
      - bbox_image_b64  : EfficientNet output with bounding box (base64 JPEG)
      - heat_image_b64  : ConvNeXt heatmap overlay (base64 JPEG)
      - bbox_prediction : {label, confidence, probabilities}
      - heat_prediction : {label, confidence, probabilities}
    """
    from app.config import CLASS_LABELS, CLASS_INFO
    from app.inference import softmax

    # Decode original image
    pil_img  = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    orig_rgb = np.array(pil_img)

    # Resize original for overlay (keep manageable)
    display_size = 512
    oh, ow = orig_rgb.shape[:2]
    scale = display_size / max(oh, ow)
    dh, dw = int(oh * scale), int(ow * scale)
    orig_disp = cv2.resize(orig_rgb, (dw, dh), interpolation=cv2.INTER_LANCZOS4)

    tensor = _preprocess(orig_rgb)   # (1,3,224,224)

    results = {}

    # ── 1. EfficientNet-B4 → Bounding Box ────────────────────────────────────
    try:
        layer_bbox = _get_target_layer(model_bbox, arch_bbox)
        gcam_bbox  = GradCAM(model_bbox, layer_bbox)

        with torch.enable_grad():
            cam_bbox  = gcam_bbox.generate(tensor.clone(), class_idx)
            logits_b  = model_bbox(tensor.detach())

        gcam_bbox.remove_hooks()

        probs_b   = softmax(logits_b[0].detach().cpu().numpy())
        pred_b    = int(np.argmax(probs_b))
        bbox_img  = make_bbox_overlay(orig_disp, cam_bbox)

        results["bbox_image_b64"] = img_to_b64(bbox_img)
        results["bbox_prediction"] = {
            "label":         CLASS_INFO[CLASS_LABELS[pred_b]]["label"],
            "arabic":        CLASS_INFO[CLASS_LABELS[pred_b]]["arabic"],
            "confidence":    round(float(probs_b[pred_b]) * 100, 2),
            "badge_color":   CLASS_INFO[CLASS_LABELS[pred_b]]["badge"],
            "risk_level":    CLASS_INFO[CLASS_LABELS[pred_b]]["risk"],
            "probabilities": {
                CLASS_INFO[l]["label"]: round(float(p) * 100, 2)
                for l, p in zip(CLASS_LABELS, probs_b)
            }
        }
        logger.info("BBox output generated")
    except Exception as e:
        logger.exception("BBox generation failed")
        results["bbox_image_b64"] = None
        results["bbox_error"]     = str(e)

    # ── 2. ConvNeXt-Tiny → Heatmap ───────────────────────────────────────────
    try:
        layer_heat = _get_target_layer(model_heat, arch_heat)
        gcam_heat  = GradCAM(model_heat, layer_heat)

        with torch.enable_grad():
            cam_heat  = gcam_heat.generate(tensor.clone(), class_idx)
            logits_h  = model_heat(tensor.detach())

        gcam_heat.remove_hooks()

        probs_h   = softmax(logits_h[0].detach().cpu().numpy())
        pred_h    = int(np.argmax(probs_h))
        heat_img  = make_heatmap_overlay(orig_disp, cam_heat,
                                          alpha=0.50, colormap=cv2.COLORMAP_JET)

        results["heat_image_b64"] = img_to_b64(heat_img)
        results["heat_prediction"] = {
            "label":         CLASS_INFO[CLASS_LABELS[pred_h]]["label"],
            "arabic":        CLASS_INFO[CLASS_LABELS[pred_h]]["arabic"],
            "confidence":    round(float(probs_h[pred_h]) * 100, 2),
            "badge_color":   CLASS_INFO[CLASS_LABELS[pred_h]]["badge"],
            "risk_level":    CLASS_INFO[CLASS_LABELS[pred_h]]["risk"],
            "probabilities": {
                CLASS_INFO[l]["label"]: round(float(p) * 100, 2)
                for l, p in zip(CLASS_LABELS, probs_h)
            }
        }
        logger.info("Heatmap output generated")
    except Exception as e:
        logger.exception("Heatmap generation failed")
        results["heat_image_b64"] = None
        results["heat_error"]     = str(e)

    return results
