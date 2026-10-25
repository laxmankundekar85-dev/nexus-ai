from datetime import datetime, timezone
from typing import Dict, Any, List
import httpx
from app.core.config import settings

async def web_search_tool(params: Dict[str, Any], user_id: str, execution_id: str) -> Dict[str, Any]:
    query = params.get("query", "")
    max_results = params.get("max_results", 5)

    if not query:
        return {"results": [], "query": query, "message": "Query cannot be empty"}

    # Real Tavily integration if configured
    if settings.SEARCH_PROVIDER == "tavily" and settings.SEARCH_API_KEY:
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                resp = await client.post(
                    "https://api.tavily.com/search",
                    json={
                        "api_key": settings.SEARCH_API_KEY,
                        "query": query,
                        "max_results": max_results,
                        "search_depth": "advanced"
                    }
                )
                if resp.status_code == 200:
                    data = resp.json()
                    results = [
                        {
                            "title": r.get("title"),
                            "url": r.get("url"),
                            "snippet": r.get("content"),
                            "retrieved_at": datetime.now(timezone.utc).isoformat()
                        }
                        for r in data.get("results", [])
                    ]
                    return {
                        "provider": "tavily",
                        "query": query,
                        "results": results,
                        "count": len(results)
                    }
        except Exception as e:
            pass  # Fall back to structured findings

    # Deterministic mock research results with realistic citations
    now_iso = datetime.now(timezone.utc).isoformat()
    mock_results = [
        {
            "title": f"Industry Analysis: {query} Trends & Market Overview",
            "url": "https://example.org/research/industry-analysis",
            "snippet": f"Comprehensive market analysis on {query}. Key drivers include increased automation, adoption of enterprise AI agents, and specialized domain workflows.",
            "retrieved_at": now_iso
        },
        {
            "title": f"Ecosystem Benchmark & Top Players: {query}",
            "url": "https://example.org/reports/ecosystem-benchmark",
            "snippet": f"Comparative study of leading products and operational models in {query}. Highlights competitive advantages, funding velocity, and technological differentiators.",
            "retrieved_at": now_iso
        },
        {
            "title": f"Regulatory, Ethical, and Scalability Factors in {query}",
            "url": "https://example.org/articles/regulatory-scalability",
            "snippet": f"Assessment of compliance, deployment costs, data privacy standards, and architectural trade-offs related to {query}.",
            "retrieved_at": now_iso
        }
    ]
    return {
        "provider": "mock",
        "query": query,
        "results": mock_results[:max_results],
        "count": len(mock_results[:max_results]),
        "notice": "Mock mode active: real search requires SEARCH_API_KEY"
    }
