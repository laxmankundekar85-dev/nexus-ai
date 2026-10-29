from fastapi import APIRouter
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/evidence", tags=["Evidence Lineage"])

class SourceDocRef(BaseModel):
    document_id: str
    document_name: str
    version: int
    passage: str
    page: int
    match_score: float

class AffectedReportRef(BaseModel):
    report_id: str
    report_title: str
    impact_severity: str

class EvidenceLineageSchema(BaseModel):
    id: str
    claim_id: str
    claim_text: str
    status: str
    confidence: float
    sources: List[SourceDocRef]
    affected_reports: List[AffectedReportRef]
    revalidation_status: str
    last_verified_at: str

_MOCK_EVIDENCE = [
    {
        "id": "ev-101",
        "claim_id": "cl-781",
        "claim_text": "Q3 Enterprise cloud net revenue expanded 28.4% YoY to $4.2B with margin expansion.",
        "status": "verified",
        "confidence": 0.98,
        "sources": [
            {
                "document_id": "doc-001",
                "document_name": "Q3_Financial_Release_Final.pdf",
                "version": 2,
                "passage": "Cloud infrastructure segment revenue rose 28.4% to $4,210 million compared to $3,278 million in the prior year quarter.",
                "page": 4,
                "match_score": 0.99,
            }
        ],
        "affected_reports": [
            {"report_id": "rep-01", "report_title": "Executive Financial Synthesis Q3", "impact_severity": "high"},
            {"report_id": "rep-02", "report_title": "Global Cloud Infrastructure Benchmark", "impact_severity": "medium"},
        ],
        "revalidation_status": "valid",
        "last_verified_at": "2026-10-29T10:15:00Z",
    },
    {
        "id": "ev-102",
        "claim_id": "cl-782",
        "claim_text": "Operating expenses contracted 4.2% across North American operations due to automation.",
        "status": "partially_verified",
        "confidence": 0.81,
        "sources": [
            {
                "document_id": "doc-002",
                "document_name": "Operational_Review_Deck.pdf",
                "version": 1,
                "passage": "NA headcount and administrative overhead decreased roughly 4%, primarily attributed to automated ingestion systems.",
                "page": 12,
                "match_score": 0.82,
            }
        ],
        "affected_reports": [
            {"report_id": "rep-01", "report_title": "Executive Financial Synthesis Q3", "impact_severity": "medium"},
        ],
        "revalidation_status": "needs_revalidation",
        "last_verified_at": "2026-10-28T16:30:00Z",
    },
    {
        "id": "ev-103",
        "claim_id": "cl-783",
        "claim_text": "Gross margins in APAC declined by 6.1% due to FX volatility and local currency weakness.",
        "status": "contradicted",
        "confidence": 0.92,
        "sources": [
            {
                "document_id": "doc-001",
                "document_name": "Q3_Financial_Release_Final.pdf",
                "version": 2,
                "passage": "APAC segmental gross margin gained 1.4% constant currency; FX drag accounted for -2.1% net.",
                "page": 8,
                "match_score": 0.94,
            }
        ],
        "affected_reports": [
            {"report_id": "rep-03", "report_title": "APAC Market Risk Analysis", "impact_severity": "critical"},
        ],
        "revalidation_status": "invalidated",
        "last_verified_at": "2026-10-29T09:45:00Z",
    },
]

@router.get("/lineage", response_model=List[EvidenceLineageSchema])
async def list_lineage():
    return _MOCK_EVIDENCE

@router.post("/revalidate/{evidence_id}")
async def revalidate_claim(evidence_id: str):
    for item in _MOCK_EVIDENCE:
        if item["id"] == evidence_id:
            item["revalidation_status"] = "valid"
            item["last_verified_at"] = datetime.utcnow().isoformat() + "Z"
            return item
    return _MOCK_EVIDENCE[0]
