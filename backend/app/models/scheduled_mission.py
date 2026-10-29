from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, Boolean, Text, JSON, DateTime, ForeignKey
from app.core.database import Base

class ScheduledMission(Base):
    __tablename__ = "scheduled_missions"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    owner_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    objective = Column(Text, nullable=False)
    schedule_type = Column(String(50), default="daily", nullable=False)
    cron_expression = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    retry_policy = Column(JSON, default=dict)
    notify_on_delta = Column(Boolean, default=True, nullable=False)
    last_run_at = Column(DateTime, nullable=True)
    next_run_at = Column(DateTime, nullable=True)
    last_result_hash = Column(String(64), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
