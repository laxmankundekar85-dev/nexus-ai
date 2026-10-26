import time
from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.core.config import settings
from app.api.v1.auth import get_current_user
from app.models.user import User
from app.core.llm_client import call_llm
from app.tools.web_search import web_search_tool

router = APIRouter(prefix="/settings", tags=["settings"])

class SettingsUpdateRequest(BaseModel):
    llm_provider: Optional[str] = None
    llm_model: Optional[str] = None
    llm_api_key: Optional[str] = None
    groq_api_key: Optional[str] = None
    gemini_api_key: Optional[str] = None
    anthropic_api_key: Optional[str] = None
    search_provider: Optional[str] = None
    search_api_key: Optional[str] = None

class TestConnectionRequest(BaseModel):
    provider: str
    api_key: Optional[str] = None
    model: Optional[str] = None

def mask_key(k: Optional[str]) -> str:
    if not k:
        return "Not Configured"
    if len(k) <= 8:
        return "********"
    return f"{k[:4]}...{k[-4:]}"

@router.get("/config")
async def get_settings_config(current_user: User = Depends(get_current_user)):
    return {
        "llm_provider": settings.LLM_PROVIDER,
        "llm_model": settings.LLM_MODEL,
        "search_provider": settings.SEARCH_PROVIDER,
        "has_openai_key": bool(settings.LLM_API_KEY),
        "openai_key_masked": mask_key(settings.LLM_API_KEY),
        "has_groq_key": bool(settings.GROQ_API_KEY),
        "groq_key_masked": mask_key(settings.GROQ_API_KEY),
        "has_gemini_key": bool(settings.GEMINI_API_KEY),
        "gemini_key_masked": mask_key(settings.GEMINI_API_KEY),
        "has_anthropic_key": bool(settings.ANTHROPIC_API_KEY),
        "anthropic_key_masked": mask_key(settings.ANTHROPIC_API_KEY),
        "has_tavily_key": bool(settings.SEARCH_API_KEY),
        "tavily_key_masked": mask_key(settings.SEARCH_API_KEY),
        "live_web_status": "Active (DuckDuckGo Live)",
    }

@router.post("/config")
async def update_settings_config(
    payload: SettingsUpdateRequest,
    current_user: User = Depends(get_current_user)
):
    if payload.llm_provider:
        settings.LLM_PROVIDER = payload.llm_provider.lower()
    if payload.llm_model:
        settings.LLM_MODEL = payload.llm_model
    if payload.llm_api_key is not None:
        settings.LLM_API_KEY = payload.llm_api_key or None
    if payload.groq_api_key is not None:
        settings.GROQ_API_KEY = payload.groq_api_key or None
    if payload.gemini_api_key is not None:
        settings.GEMINI_API_KEY = payload.gemini_api_key or None
    if payload.anthropic_api_key is not None:
        settings.ANTHROPIC_API_KEY = payload.anthropic_api_key or None
    if payload.search_provider:
        settings.SEARCH_PROVIDER = payload.search_provider.lower()
    if payload.search_api_key is not None:
        settings.SEARCH_API_KEY = payload.search_api_key or None

    return {
        "status": "success",
        "message": f"Engine settings updated. Active provider: {settings.LLM_PROVIDER}",
        "config": {
            "llm_provider": settings.LLM_PROVIDER,
            "llm_model": settings.LLM_MODEL,
            "search_provider": settings.SEARCH_PROVIDER
        }
    }

@router.post("/test-connection")
async def test_connection(
    payload: TestConnectionRequest,
    current_user: User = Depends(get_current_user)
):
    start_time = time.time()
    prov = payload.provider.lower()

    if prov in ["ddgs", "live_web", "web"]:
        # Test real web search
        res = await web_search_tool({"query": "Nexus AI system test", "max_results": 2}, current_user.id, "test")
        latency_ms = int((time.time() - start_time) * 1000)
        return {
            "success": bool(res.get("results")),
            "provider": "DuckDuckGo Live Search",
            "latency_ms": latency_ms,
            "message": f"Successfully retrieved {res.get('count', 0)} live web results."
        }

    # Test LLM
    # Temporarily set key for test if provided
    old_prov = settings.LLM_PROVIDER
    old_key = settings.LLM_API_KEY
    try:
        if payload.api_key:
            settings.LLM_PROVIDER = prov
            if prov == "groq":
                settings.GROQ_API_KEY = payload.api_key
            elif prov == "gemini":
                settings.GEMINI_API_KEY = payload.api_key
            elif prov == "anthropic":
                settings.ANTHROPIC_API_KEY = payload.api_key
            else:
                settings.LLM_API_KEY = payload.api_key

        resp = await call_llm("Respond with 'OK' only.", max_tokens=10)
        latency_ms = int((time.time() - start_time) * 1000)
        if resp:
            return {
                "success": True,
                "provider": prov.upper(),
                "latency_ms": latency_ms,
                "message": f"Connected successfully to {prov.upper()} in {latency_ms}ms."
            }
        else:
            return {
                "success": False,
                "provider": prov.upper(),
                "latency_ms": latency_ms,
                "message": "Connection attempt returned no response. Check your API key."
            }
    finally:
        # If not saved, restore previous settings
        settings.LLM_PROVIDER = old_prov
        settings.LLM_API_KEY = old_key
