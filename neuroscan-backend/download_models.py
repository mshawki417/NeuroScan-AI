import os
import requests
import logging
from pathlib import Path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Models directory
MODEL_DIR = Path("model")
MODEL_DIR.mkdir(exist_ok=True)

# URLs from environment variables (set in Render)
MODELS = {
    "efficientnet_b4_model": os.getenv("EFFICIENTNET_B4_URL"),
    "convnext_tiny_model": os.getenv("CONVNEXT_TINY_URL")
}

def download_file(url, dest_path):
    if not url:
        logger.warning(f"No URL provided for {dest_path.name}")
        return False
    
    if dest_path.exists():
        logger.info(f"File {dest_path.name} already exists. Skipping download.")
        return True

    logger.info(f"Downloading {dest_path.name} from {url}...")
    try:
        with requests.get(url, stream=True) as r:
            r.raise_for_status()
            with open(dest_path, 'wb') as f:
                for chunk in r.iter_content(chunk_size=8192):
                    f.write(chunk)
        logger.info(f"Successfully downloaded {dest_path.name}")
        return True
    except Exception as e:
        logger.error(f"Failed to download {dest_path.name}: {e}")
        return False

if __name__ == "__main__":
    logger.info("Starting model download process...")
    for model_name, url in MODELS.items():
        if url:
            # Save without extension to match torch_model_manager.py logic for Render (_RENDER_STEMS)
            dest = MODEL_DIR / model_name
            download_file(url, dest)
        else:
            logger.info(f"Skipping {model_name} (No URL provided)")
    logger.info("Model download process completed.")
