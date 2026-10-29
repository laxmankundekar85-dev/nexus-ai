import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, Integer, Float, JSON, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base

class SupervisorMission(Base):
    __tablename__ = "supervisor_missions"

    id = Column(String, primary_key=True, default=lambda: f"sm-{uuid.uuid4().hex[:8]}")
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    title = Column(String(255), nullable=False)
    objective = Column(Text, nullable=False)
    status = Column(String(50), default="running")
    current_revision = Column(Integer, default=1)
    budget = Column(JSON, default=dict)
    tasks = Column(JSON, default=list)
    decision_log = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
