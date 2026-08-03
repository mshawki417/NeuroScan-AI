# NeuroScan AI — Backend API

FastAPI backend for Brain MRI Tumor Classification.

## Quick Start

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Add your models (see model/README.md)
#    model/convnext_tiny.onnx
#    model/efficientnet_b4.onnx

# 3. Run
uvicorn main:app --reload --port 8000
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/v1/health` | Backend health + loaded models |
| `GET`  | `/api/v1/models` | List available models |
| `POST` | `/api/v1/models/{key}/load` | Load a specific model |
| `POST` | `/api/v1/predict` | **Run inference on MRI image** |
| `GET`  | `/api/v1/classes` | Tumor class definitions |
| `GET`  | `/api/v1/stats` | Model performance statistics |

## Predict Request

```bash
curl -X POST http://localhost:8000/api/v1/predict \
  -F "file=@brain_mri.jpg" \
  -F "model=convnext_tiny"
```

## Predict Response

```json
{
  "scan_id": "MR-2024-0520-A1B2C3",
  "prediction": "Meningioma",
  "prediction_key": "meningioma",
  "confidence": 95.6,
  "risk_level": "medium",
  "badge_color": "yellow",
  "arabic_label": "ورم سحائي",
  "probabilities": {
    "Glioma": 2.1,
    "Meningioma": 95.6,
    "No Tumor": 0.6,
    "Pituitary": 1.7
  },
  "warnings": [],
  "metadata": {
    "model_used": "convnext_tiny",
    "original_size": "512×512",
    "preprocessed_size": "224×224",
    "clahe": true,
    "total_inference_ms": 84.3,
    "analyzed_at": "2024-05-20T10:30:00"
  }
}
```

## Deploy to Railway / Render

```bash
# Railway
railway login && railway up

# Render — connect GitHub repo, set:
# Build: pip install -r requirements.txt
# Start: uvicorn main:app --host 0.0.0.0 --port $PORT
```

## Folder Structure

```
neuroscan-backend/
├── main.py              ← FastAPI app entry point
├── requirements.txt
├── Procfile             ← for Railway/Render/Heroku
├── runtime.txt          ← Python version
├── model/
│   ├── README.md        ← Export instructions
│   ├── convnext_tiny.onnx     ← your model (add manually)
│   └── efficientnet_b4.onnx   ← your model (add manually)
└── app/
    ├── config.py        ← paths, labels, settings
    ├── model_manager.py ← ONNX session cache
    ├── preprocessing.py ← CLAHE + normalize + resize
    ├── inference.py     ← end-to-end prediction
    └── routes.py        ← API route handlers
```
