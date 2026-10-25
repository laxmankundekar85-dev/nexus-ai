from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, Integer, Text, JSON, DateTime, ForeignKey
from app.core.database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    execution_id = Column(String(36), ForeignKey("executions.id", ondelete="CASCADE"), nullable=False, index=True)
    parent_task_id = Column(String(36), nullable=True)
    agent_role = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    # pending, running, completed, failed, skipped
    status = Column(String(50), default="pending", nullable=False)
    input_data = Column(JSON, default=dict)
    output_data = Column(JSON, nullable=True)
    dependency_data = Column(JSON, default=dict)
    attempt_count = Column(Integer, default=0)
    error_summary = Column(Text, nullable=True)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
