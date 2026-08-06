# 🧠 NeuroScan AI — دليل التشغيل

## هيكل المشروع

```
NeuroScan-AI-main/
├── neuroscan-backend/    ← FastAPI + Python (AI backend)
│   ├── app/
│   │   ├── config.py     ← إعدادات CORS والنماذج
│   │   ├── routes.py     ← API endpoints (predict, predict/dual, health, stats)
│   │   ├── inference.py  ← ONNX inference engine
│   │   ├── gradcam.py    ← GradCAM visualization (BBox + Heatmap)
│   │   └── ...
│   ├── model/            ← ضع ملفات النماذج هنا (.onnx / .pt)
│   ├── main.py           ← FastAPI app entry point
│   ├── requirements.txt
│   └── .env              ← إعدادات البيئة (CORS, port)
│
└── neuroscan-frontend/   ← Angular 17 (واجهة المستخدم)
    ├── src/app/
    │   ├── services/
    │   │   └── api.service.ts   ← HTTP client (يتصل بـ backend)
    │   ├── pages/
    │   │   ├── dashboard/       ← الصفحة الرئيسية
    │   │   ├── upload/          ← رفع صور MRI
    │   │   ├── analysis/        ← نتائج الـ AI (BBox + Heatmap)
    │   │   ├── performance/     ← مقاييس أداء النماذج
    │   │   └── project/         ← معلومات المشروع
    │   └── ...
    ├── proxy.conf.json   ← توجيه طلبات API للـ backend (dev)
    └── package.json
```

---

## 🚀 تشغيل المشروع

### 1. تشغيل الـ Backend (FastAPI)

```bash
cd neuroscan-backend

# إنشاء بيئة Python (مرة واحدة)
python -m venv venv
venv\Scripts\activate      # Windows
# source venv/bin/activate  # Mac/Linux

# تثبيت المكتبات
pip install -r requirements.txt

# تشغيل الخادم
uvicorn main:app --reload --port 8000
```

> الـ API docs متاحة على: http://localhost:8000/docs

### 2. تشغيل الـ Frontend (Angular)

```bash
cd neuroscan-frontend

# تثبيت المكتبات (مرة واحدة)
npm install

# تشغيل dev server مع proxy للـ backend
npm run dev
```

> التطبيق يفتح تلقائياً على: http://localhost:4200

---

## 🔌 ربط الـ Frontend بالـ Backend

### وضع التطوير (Development)
الـ `proxy.conf.json` يوجه طلبات `/api/*` تلقائياً إلى `http://localhost:8000` — لا تحتاج لأي إعداد إضافي.

### وضع الإنتاج (Production)
في `api.service.ts` يتم اكتشاف الـ URL تلقائياً:
- إذا كنت على `localhost` → `http://localhost:8000/api/v1`
- إذا ضبطت `window.__NEUROSCAN_API_URL` → يستخدمه
- الـ fallback → `https://neuroscan-ai-dc1e.onrender.com/api/v1`

---

## 🤖 API Endpoints

| Method | Endpoint | الوصف |
|--------|----------|-------|
| GET | `/api/v1/health` | حالة الخادم والنماذج المحملة |
| GET | `/api/v1/models` | قائمة النماذج المتاحة |
| GET | `/api/v1/classes` | تعريف أنواع الأورام |
| GET | `/api/v1/stats` | مقاييس أداء النماذج |
| POST | `/api/v1/predict` | تشغيل نموذج واحد (ONNX) |
| POST | `/api/v1/predict/dual` | تشغيل كلا النموذجين + GradCAM |

---

## 🧩 نماذج AI المطلوبة

ضع ملفات النماذج في مجلد `neuroscan-backend/model/`:

| الملف | الاستخدام |
|-------|-----------|
| `convnext_tiny.onnx` | تصنيف سريع (ONNX) |
| `efficientnet_b4.onnx` | تصنيف سريع (ONNX) |
| `convnext_tiny.pt` أو `convnext_tiny_model` | GradCAM Heatmap |
| `efficientnet_b4.pt` أو `efficientnet_b4_model` | GradCAM BBox |

> **ملاحظة**: إذا لم تكن النماذج موجودة، يعمل التطبيق بـ Demo Mode تلقائياً.

---

## 🐛 استكشاف الأخطاء

**المشكلة**: خطأ CORS  
**الحل**: تأكد أن `ALLOWED_ORIGINS` في `.env` يحتوي على `http://localhost:4200`

**المشكلة**: الـ frontend لا يتصل بالـ backend  
**الحل**: استخدم `npm run dev` (مع proxy) بدلاً من `npm start`

**المشكلة**: نتائج Demo Mode فقط  
**الحل**: ضع ملفات النماذج في `model/` وأعد تشغيل الـ backend
