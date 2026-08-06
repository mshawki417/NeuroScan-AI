"""
NeuroScan AI — FastAPI Backend
Run:  uvicorn main:app --reload --port 8000
"""
import logging, sys
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import MODEL_PATHS, ALLOWED_ORIGINS
from app.model_manager import ModelManager
from app.routes import router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    stream=sys.stdout,
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("═" * 55)
    logger.info("  NeuroScan AI — Backend starting")
    logger.info("═" * 55)

    # Load ONNX models (for /predict)
    for key, path in MODEL_PATHS.items():
        if path.exists():
            try:
                ModelManager.load(key, path)
                logger.info(f"  ✓ ONNX loaded  : {key}")
            except Exception as e:
                logger.warning(f"  ✗ ONNX failed  : {key} — {e}")
        else:
            logger.warning(f"  ⚠ ONNX missing : {path}")

    # Load PyTorch checkpoints (for /predict/dual — GradCAM)
    try:
        from app.torch_model_manager import preload_all
        preload_all()
        logger.info("  ✓ PyTorch models preloaded")
    except Exception as e:
        logger.warning(f"  ⚠ PyTorch preload skipped: {e}")

    logger.info("═" * 55)
    yield
    logger.info("Shutting down NeuroScan AI")


app = FastAPI(
    title="NeuroScan AI API",
    description=(
        "Brain MRI Tumor Classification API\n\n"
        "**Endpoints:**\n"
        "- `POST /api/v1/predict` — Single model inference (ONNX, fast)\n"
        "- `POST /api/v1/predict/dual` — **Both models** → BBox + Heatmap images\n\n"
        "**Model files** (place in `/model/`):\n"
        "| File | Purpose |\n"
        "|------|---------|\n"
        "| `efficientnet_b4.onnx` | Fast single inference |\n"
        "| `convnext_tiny.onnx` | Fast single inference |\n"
        "| `efficientnet_b4.pt` | Bounding box (GradCAM) |\n"
        "| `convnext_tiny.pt` | Heatmap (GradCAM) |"
    ),
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api/v1")

@app.get("/", include_in_schema=False)
def root():
    return {
        "app": "NeuroScan AI API v2",
        "endpoints": {
            "single_predict": "POST /api/v1/predict",
            "dual_predict":   "POST /api/v1/predict/dual  ← BBox + Heatmap",
            "docs":           "/docs",
            "health":         "/api/v1/health",
        }
    }
