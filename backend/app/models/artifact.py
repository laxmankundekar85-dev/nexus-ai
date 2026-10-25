from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, JSON, DateTime, ForeignKey
from app.core.database import Base

class Artifact(Base):
    __tablename__ = "artifacts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    owner_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    execution_id = Column(String(36), ForeignKey("executions.id", ondelete="CASCADE"), nullable=False, index=True)
    artifact_type = Column(String(100), nullable=False)
    storage_key = Column(String(500), nullable=False)
    meta_info = Column(JSON, default=dict)  # named meta_info to avoid reserved metadata
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
