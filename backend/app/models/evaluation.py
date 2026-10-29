import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, Integer, Boolean, JSON
from app.core.database import Base

class EvaluationRun(Base):
    __tablename__ = "evaluation_runs"

    id = Column(String, primary_key=True, default=lambda: f"eval-{uuid.uuid4().hex[:8]}")
    benchmark_name = Column(String(255), nullable=False)
    test_cases_count = Column(Integer, default=0)
    executed_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String(50), default="completed")
    models_evaluated = Column(JSON, default=list)
    regression_detected = Column(Boolean, default=False)
    notes = Column(Text, default="")
