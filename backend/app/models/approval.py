from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, JSON, DateTime, ForeignKey
from app.core.database import Base

class ApprovalRequest(Base):
    __tablename__ = "approval_requests"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    execution_id = Column(String(36), ForeignKey("executions.id", ondelete="CASCADE"), nullable=False, index=True)
    task_id = Column(String(36), nullable=True)
    action_type = Column(String(100), nullable=False)
    proposed_action = Column(JSON, nullable=False, default=dict)
    # pending, approved, rejected, edited, evidence_requested, expired
    status = Column(String(50), default="pending", nullable=False)
    reviewer_id = Column(String(36), nullable=True)
    reviewer_name = Column(String(255), nullable=True)
    decision = Column(String(50), nullable=True)
    comments = Column(String(1000), nullable=True)
    modified_action = Column(JSON, nullable=True)
    requested_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    resolved_at = Column(DateTime, nullable=True)
