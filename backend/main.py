import os
import psycopg2
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import meetings, transcribe, summarize

load_dotenv()

app = FastAPI(title="Echo Meet API", version="1.0.0")

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(meetings.router)
app.include_router(transcribe.router)
app.include_router(summarize.router)


# ── Health check ──────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    db_status = "disconnected"
    try:
        conn = psycopg2.connect(os.getenv("DATABASE_URL"))
        conn.close()
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {e}"
    return {"status": "ok", "database": db_status}
