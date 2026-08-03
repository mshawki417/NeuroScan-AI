# 📁 Model Directory

Place your **ONNX model files** here before starting the backend.

## Required Files

| Filename | Model | Accuracy | Source |
|----------|-------|----------|--------|
| `convnext_tiny.onnx` | ConvNeXt-Tiny | **95.69%** | Export from checkpoint ep014 |
| `efficientnet_b4.onnx` | EfficientNet-B4 | **94.75%** | Export from checkpoint ep015 |

## How to Export Your Models (from your Notebook)

```python
import torch
import timm

# ── ConvNeXt-Tiny ─────────────────────────────────────────────────────────
model = timm.create_model('convnext_tiny', pretrained=False, num_classes=4)
ckpt  = torch.load('outputs/checkpoints/convnext_tiny_ep014.pt', map_location='cpu')
model.load_state_dict(ckpt['model_state_dict'])
model.eval()

dummy = torch.randn(1, 3, 224, 224)
torch.onnx.export(
    model, dummy, "model/convnext_tiny.onnx",
    input_names=["input"], output_names=["output"],
    dynamic_axes={"input": {0: "batch"}, "output": {0: "batch"}},
    opset_version=17,
)
print("✓ convnext_tiny.onnx exported")

# ── EfficientNet-B4 ───────────────────────────────────────────────────────
model2 = timm.create_model('efficientnet_b4', pretrained=False, num_classes=4)
ckpt2  = torch.load('outputs/checkpoints/efficientnet_b4_ep015.pt', map_location='cpu')
model2.load_state_dict(ckpt2['model_state_dict'])
model2.eval()

torch.onnx.export(
    model2, dummy, "model/efficientnet_b4.onnx",
    input_names=["input"], output_names=["output"],
    dynamic_axes={"input": {0: "batch"}, "output": {0: "batch"}},
    opset_version=17,
)
print("✓ efficientnet_b4.onnx exported")
```

## After Export

Your `/model/` folder should look like:
```
model/
├── README.md              ← this file
├── convnext_tiny.onnx     ← ~67 MB
└── efficientnet_b4.onnx   ← ~69 MB
```

Then run the backend:
```bash
uvicorn main:app --reload --port 8000
```

⚠️ **Note:** The `.onnx` files are excluded from git (see `.gitignore`).
Upload them via GitHub's web interface or Git LFS.
