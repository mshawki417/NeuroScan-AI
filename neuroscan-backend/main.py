"""
NeuroScan AI — FastAPI Backend
Run:  uvicorn main:app --reload --port 8000
"""
import logging
import sys
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import MODEL_PATHS, DEFAULT_MODEL, ALLOWED_ORIGINS
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
    """Load default model on startup (if file exists)."""
    logger.info("═" * 55)
    logger.info("  NeuroScan AI — Backend starting up")
    logger.info("═" * 55)

    for key, path in MODEL_PATHS.items():
        if path.exists():
            try:
                ModelManager.load(key, path)
                logger.info(f"  ✓ Loaded {key}")
            except Exception as e:
                logger.warning(f"  ✗ Failed to load {key}: {e}")
        else:
            logger.warning(f"  ⚠ Model not found: {path} — running in DEMO mode")

    logger.info("═" * 55)
    yield
    logger.info("Shutting down NeuroScan AI backend")


app = FastAPI(
    title="NeuroScan AI API",
    description=(
        "Brain MRI Tumor Classification API.\n\n"
        "Supports **ConvNeXt-Tiny** (95.69%) and **EfficientNet-B4** (94.75%).\n\n"
        "Place your `.onnx` models in the `/model/` directory:\n"
        "- `model/convnext_tiny.onnx`\n"
        "- `model/efficientnet_b4.onnx`"
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS — allow Angular dev server + Vercel
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api/v1")


@app.get("/", include_in_schema=False)
def root():
    return {
        "app":     "NeuroScan AI API",
        "version": "1.0.0",
        "docs":    "/docs",
        "health":  "/api/v1/health",
        "predict": "POST /api/v1/predict",
    }
