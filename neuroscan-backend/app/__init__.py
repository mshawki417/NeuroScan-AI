"""
NeuroScan AI — App package init.
Auto-downloads PyTorch checkpoints from GitHub Releases on first startup.
"""
import logging
import os
from pathlib import Path

logger = logging.getLogger(__name__)

# ── GitHub Releases direct-download URLs ─────────────────────────────────────
_GITHUB_MODELS = {
    "efficientnet_b4": {
        "url":      "https://github.com/mshawki417/NeuroScan-AI/releases/download/v.1/efficientnet_b4_ep016_score0.9845.pt",
        "filename": "efficientnet_b4_model",   # Render-style (no extension)
    },
    "convnext_tiny": {
        "url":      "https://github.com/mshawki417/NeuroScan-AI/releases/download/v.o/convnext_tiny_ep014_score0.9940.pt",
        "filename": "convnext_tiny_model",     # Render-style (no extension)
    },
}

_MODEL_DIR = Path("model")


def _download_models():
    """Download missing .pt checkpoints from GitHub Releases."""
    _MODEL_DIR.mkdir(exist_ok=True)

    for key, info in _GITHUB_MODELS.items():
        dest = _MODEL_DIR / info["filename"]

        # Also accept .pt extension (local dev style)
        dest_pt = _MODEL_DIR / f"{key}.pt"

        if dest.exists() or dest_pt.exists():
            logger.info(f"[model-dl] {key} already on disk — skipping download")
            continue

        url = info["url"]
        logger.info(f"[model-dl] Downloading {key} from GitHub Releases…")
        logger.info(f"[model-dl]   → {url}")

        try:
            import urllib.request

            tmp = dest.with_suffix(".tmp")

            def _progress(block_num, block_size, total_size):
                if total_size > 0 and block_num % 500 == 0:
                    pct = min(block_num * block_size / total_size * 100, 100)
                    logger.info(f"[model-dl]   {key}: {pct:.1f}%")

            urllib.request.urlretrieve(url, tmp, _progress)
            tmp.rename(dest)
            size_mb = dest.stat().st_size / 1024 / 1024
            logger.info(f"[model-dl] ✓ {key} saved to {dest} ({size_mb:.1f} MB)")

        except Exception as e:
            logger.error(f"[model-dl] ✗ Failed to download {key}: {e}")
            # Clean up partial file
            tmp = dest.with_suffix(".tmp")
            if tmp.exists():
                tmp.unlink()


# Run at import time (FastAPI startup)
_download_models()
