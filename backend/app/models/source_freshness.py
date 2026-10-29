import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Integer, JSON
from app.core.database import Base

class SourceFreshness(Base):
    __tablename__ = "source_freshness"

    id = Column(String, primary_key=True, default=lambda: f"src-{uuid.uuid4().hex[:8]}")
    name = Column(String(255), nullable=False)
    source_type = Column(String(100), default="regulatory_api")
    version = Column(Integer, default=1)
    last_ingested_at = Column(DateTime, default=datetime.utcnow)
    refresh_interval_hours = Column(Integer, default=24)
    staleness_status = Column(String(50), default="fresh")
    dependent_claims_count = Column(Integer, default=0)
    dependent_reports_count = Column(Integer, default=0)
    endpoint_or_file = Column(String(500), nullable=False)
    hash = Column(String(128), default="")
