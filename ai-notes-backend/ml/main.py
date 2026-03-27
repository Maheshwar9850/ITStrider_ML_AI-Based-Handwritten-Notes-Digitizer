"""
ml/main.py — Standalone Python ML backend

Run with:
    uvicorn main:app --reload --port 8000

The Node.js backend communicates with this service via:
    ML_SERVICE_URL=http://localhost:8000  (set in .env)
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import predict

app = FastAPI(
    title="AI Notes ML Service",
    description="Standalone ML backend for handwritten note intelligence.",
    version="1.0.0",
)

# Allow requests from the Node.js backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Tighten in production to the Node.js server origin
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(predict.router, prefix="/predict", tags=["predict"])


@app.get("/", tags=["health"])
async def health():
    """Quick health check for the ML service."""
    return {"status": "ok", "service": "ml-backend"}
