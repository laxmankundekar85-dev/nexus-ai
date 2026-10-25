from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, JSON, DateTime, ForeignKey
from app.core.database import Base

class IntegrationConfiguration(Base):
    __tablename__ = "integration_configurations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    owner_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    provider = Column(String(100), nullable=False)
    configuration_metadata = Column(JSON, default=dict)
    secret_reference = Column(String(255), nullable=True)  # Key reference, never store secret plain
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
