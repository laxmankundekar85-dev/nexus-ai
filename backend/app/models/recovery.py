import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, Integer, JSON
from app.core.database import Base

class RecoveryIncident(Base):
    __tablename__ = "recovery_incidents"

    id = Column(String, primary_key=True, default=lambda: f"rec-{uuid.uuid4().hex[:8]}")
    mission_id = Column(String(100), nullable=False)
    task_id = Column(String(100), nullable=False)
    task_name = Column(String(255), nullable=False)
    failure_class = Column(String(100), nullable=False)
    error_message = Column(Text, nullable=False)
    attempt_number = Column(Integer, default=1)
    max_attempts = Column(Integer, default=3)
    strategy_applied = Column(String(100), default="exponential_backoff")
    status = Column(String(50), default="recovered")
    timestamp = Column(DateTime, default=datetime.utcnow)

class CircuitBreaker(Base):
    __tablename__ = "circuit_breakers"

    provider_id = Column(String(100), primary_key=True)
    provider_name = Column(String(255), nullable=False)
    status = Column(String(50), default="closed")
    failure_count = Column(Integer, default=0)
    threshold = Column(Integer, default=5)
    last_failure_at = Column(DateTime, nullable=True)
