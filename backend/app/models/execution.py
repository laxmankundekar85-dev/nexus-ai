from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, Text, JSON, DateTime, ForeignKey
from app.core.database import Base

class Execution(Base):
    __tablename__ = "executions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    owner_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    workflow_id = Column(String(36), ForeignKey("workflows.id", ondelete="SET NULL"), nullable=True)
    objective = Column(Text, nullable=False)
    # queued, planning, awaiting_approval, running, reviewing, completed, failed, cancelled
    status = Column(String(50), default="queued", index=True, nullable=False)
    plan = Column(JSON, nullable=True)
    error_summary = Column(Text, nullable=True)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class ExecutionEvent(Base):
    __tablename__ = "execution_events"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    execution_id = Column(String(36), ForeignKey("executions.id", ondelete="CASCADE"), nullable=False, index=True)
    task_id = Column(String(36), nullable=True)
    event_type = Column(String(100), nullable=False)
    safe_metadata = Column(JSON, default=dict)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
