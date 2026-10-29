from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, Integer, Float, Text, DateTime, ForeignKey
from app.core.database import Base

class Claim(Base):
    __tablename__ = "claims"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    execution_id = Column(String(36), ForeignKey("executions.id", ondelete="CASCADE"), nullable=False, index=True)
    artifact_id = Column(String(36), ForeignKey("artifacts.id", ondelete="SET NULL"), nullable=True)
    claim_text = Column(Text, nullable=False)
    # verified, partially_verified, unsupported, contradicted
    status = Column(String(50), default="unsupported", nullable=False, index=True)
    confidence_score = Column(Float, default=0.0, nullable=False)
    # document, web, calculation, inference
    source_type = Column(String(50), default="document", nullable=False)
    source_name = Column(String(255), nullable=True)
    page_number = Column(Integer, nullable=True)
    extracted_passage = Column(Text, nullable=True)
    source_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
