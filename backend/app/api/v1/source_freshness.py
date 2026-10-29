from fastapi import APIRouter
from typing import List
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/source-freshness", tags=["Source Freshness"])

class SourceFreshnessSchema(BaseModel):
    id: str
    name: str
    source_type: str
    version: int
    last_ingested_at: str
    refresh_interval_hours: int
    staleness_status: str
    dependent_claims_count: int
    dependent_reports_count: int
    endpoint_or_file: str
    hash: str

_MOCK_SOURCES = [
    {
        "id": "src-1",
        "name": "SEC EDGAR 10-Q & 8-K Feed",
        "source_type": "regulatory_api",
        "version": 14,
        "last_ingested_at": "2026-10-29T09:30:00Z",
        "refresh_interval_hours": 6,
        "staleness_status": "fresh",
        "dependent_claims_count": 42,
        "dependent_reports_count": 5,
        "endpoint_or_file": "https://data.sec.gov/api/xbrl/companyfacts",
        "hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    },
    {
        "id": "src-2",
        "name": "Bloomberg FX & Bond Yield Stream",
        "source_type": "market_feed",
        "version": 88,
        "last_ingested_at": "2026-10-29T10:10:00Z",
        "refresh_interval_hours": 1,
        "staleness_status": "fresh",
        "dependent_claims_count": 67,
        "dependent_reports_count": 8,
        "endpoint_or_file": "wss://stream.bloomberg.com/v2/rates",
        "hash": "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
    },
    {
        "id": "src-3",
        "name": "Internal Q2 Audit & Capex Master",
        "source_type": "internal_corpus",
        "version": 1,
        "last_ingested_at": "2026-10-15T14:22:00Z",
        "refresh_interval_hours": 168,
        "staleness_status": "needs_review",
        "dependent_claims_count": 19,
        "dependent_reports_count": 3,
        "endpoint_or_file": "s3://nexus-corp-vault/2026/Q2_Internal_Audit.xlsx",
        "hash": "ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d",
    },
    {
        "id": "src-4",
        "name": "Statista Competitive AI Landscape",
        "source_type": "web_index",
        "version": 3,
        "last_ingested_at": "2026-09-28T08:00:00Z",
        "refresh_interval_hours": 336,
        "staleness_status": "stale",
        "dependent_claims_count": 8,
        "dependent_reports_count": 2,
        "endpoint_or_file": "https://statista.com/reports/ai-enterprise-2026",
        "hash": "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
    },
]

@router.get("/sources", response_model=List[SourceFreshnessSchema])
async def list_sources():
    return _MOCK_SOURCES

@router.post("/sources/{source_id}/reingest")
async def trigger_reingestion(source_id: str):
    for s in _MOCK_SOURCES:
        if s["id"] == source_id:
            s["staleness_status"] = "fresh"
            s["version"] += 1
            s["last_ingested_at"] = datetime.utcnow().isoformat() + "Z"
            return s
    return _MOCK_SOURCES[0]
