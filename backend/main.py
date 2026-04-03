from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from backend.config import get_settings
from backend.ingestion.scheduler import start_scheduler
from backend.api.routes.feed import router as feed_router
from backend.api.routes.search import router as search_router
from backend.api.routes.profile import router as profile_router
from backend.api.routes.websocket import router as ws_router


settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    start_scheduler()
    yield


app = FastAPI(
    title="NoiseCut API",
    description="Self-hosted tech intelligence feed",
    version="0.1.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(ws_router)
app.include_router(profile_router, prefix="/api")
app.include_router(feed_router, prefix="/api")
app.include_router(search_router, prefix="/api")

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "db": "connected",
        "version": "0.1.0"
    }