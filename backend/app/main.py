import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.core.database import init_db
from app.core.redis_client import redis_manager
from app.api.v1.router import api_router
import app.tools  # Trigger tool registrations

logging.basicConfig(level=getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO))
logger = logging.getLogger("nexus-ai")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Initializing database...")
    await init_db()
    logger.info("Connecting to Redis/Event bus...")
    await redis_manager.connect()

    if settings.is_mock_mode:
        logger.warning(
            "==========================================================\n"
            "   NEXUS AI RUNNING IN MOCK MODE (No paid API key required)\n"
            "   Set LLM_API_KEY in .env to enable real LLM providers.\n"
            "=========================================================="
        )
    else:
        logger.info(f"AI Provider active: {settings.LLM_PROVIDER} ({settings.LLM_MODEL})")

    yield

    # Shutdown
    await redis_manager.disconnect()
    logger.info("Nexus AI shutdown complete.")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Nexus AI — AI Agent Operating Platform REST API",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security headers middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    response.headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains; preload"
    return response

# API routes
app.include_router(api_router)

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "mode": "mock" if settings.is_mock_mode else "production",
        "provider": settings.LLM_PROVIDER
    }

@app.get("/")
async def root():
    return {
        "message": "Welcome to Nexus AI — AI Agent Operating Platform API",
        "docs": "/docs",
        "version": settings.APP_VERSION
    }
