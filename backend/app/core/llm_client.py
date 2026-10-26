import json
from typing import Optional, Dict, Any, List
import httpx
from app.core.config import settings

async def call_llm(
    prompt: str,
    system_prompt: str = "You are Nexus AI, an autonomous intelligence agent. Provide objective, verified, data-grounded strategic analysis.",
    max_tokens: int = 2500,
    temperature: float = 0.2
) -> Optional[str]:
    """Unified LLM caller supporting Groq, OpenAI, Gemini, Anthropic, and Ollama."""
    provider = settings.LLM_PROVIDER.lower()
    
    # Check for direct or provider-specific keys
    api_key = settings.LLM_API_KEY
    if provider == "groq" and settings.GROQ_API_KEY:
        api_key = settings.GROQ_API_KEY
    elif provider == "gemini" and settings.GEMINI_API_KEY:
        api_key = settings.GEMINI_API_KEY
    elif provider == "anthropic" and settings.ANTHROPIC_API_KEY:
        api_key = settings.ANTHROPIC_API_KEY

    # 1. Groq (Fast & Free tier available)
    if provider == "groq" and api_key:
        try:
            model = settings.LLM_MODEL if "llama" in settings.LLM_MODEL.lower() else "llama-3.3-70b-versatile"
            async with httpx.AsyncClient(timeout=45.0) as client:
                res = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
                    json={
                        "model": model,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": prompt}
                        ],
                        "max_tokens": max_tokens,
                        "temperature": temperature
                    }
                )
                if res.status_code == 200:
                    data = res.json()
                    return data["choices"][0]["message"]["content"]
        except Exception:
            pass

    # 2. OpenAI
    if provider == "openai" and api_key:
        try:
            model = settings.LLM_MODEL if settings.LLM_MODEL else "gpt-4o"
            async with httpx.AsyncClient(timeout=45.0) as client:
                res = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
                    json={
                        "model": model,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": prompt}
                        ],
                        "max_tokens": max_tokens,
                        "temperature": temperature
                    }
                )
                if res.status_code == 200:
                    data = res.json()
                    return data["choices"][0]["message"]["content"]
        except Exception:
            pass

    # 3. Google Gemini
    if provider == "gemini" and api_key:
        try:
            model = settings.LLM_MODEL if "gemini" in settings.LLM_MODEL.lower() else "gemini-1.5-flash"
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
            payload = {
                "contents": [
                    {"role": "user", "parts": [{"text": f"{system_prompt}\n\n{prompt}"}]}
                ],
                "generationConfig": {"maxOutputTokens": max_tokens, "temperature": temperature}
            }
            async with httpx.AsyncClient(timeout=45.0) as client:
                res = await client.post(url, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        if parts:
                            return parts[0].get("text", "")
        except Exception:
            pass

    # 4. Anthropic
    if provider == "anthropic" and api_key:
        try:
            model = settings.LLM_MODEL if "claude" in settings.LLM_MODEL.lower() else "claude-3-5-sonnet-20241022"
            async with httpx.AsyncClient(timeout=45.0) as client:
                res = await client.post(
                    "https://api.anthropic.com/v1/messages",
                    headers={
                        "x-api-key": api_key,
                        "anthropic-version": "2023-06-01",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": model,
                        "system": system_prompt,
                        "messages": [{"role": "user", "content": prompt}],
                        "max_tokens": max_tokens,
                        "temperature": temperature
                    }
                )
                if res.status_code == 200:
                    data = res.json()
                    return data.get("content", [{}])[0].get("text", "")
        except Exception:
            pass

    # 5. Local Ollama
    if provider == "ollama":
        try:
            base_url = settings.LLM_BASE_URL or "http://localhost:11434"
            model = settings.LLM_MODEL or "llama3"
            async with httpx.AsyncClient(timeout=60.0) as client:
                res = await client.post(
                    f"{base_url}/api/generate",
                    json={"model": model, "prompt": f"{system_prompt}\n\n{prompt}", "stream": False}
                )
                if res.status_code == 200:
                    return res.json().get("response", "")
        except Exception:
            pass

    return None
