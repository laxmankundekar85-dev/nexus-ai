import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, Float, JSON, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base

class EvidenceLineage(Base):
    __tablename__ = "evidence_lineage"

    id = Column(String, primary_key=True, default=lambda: f"ev-{uuid.uuid4().hex[:8]}")
    claim_id = Column(String(100), nullable=False)
    claim_text = Column(Text, nullable=False)
    status = Column(String(50), default="verified")
    confidence = Column(Float, default=0.95)
    sources = Column(JSON, default=list)
    affected_reports = Column(JSON, default=list)
    revalidation_status = Column(String(50), default="valid")
    last_verified_at = Column(DateTime, default=datetime.utcnow)
