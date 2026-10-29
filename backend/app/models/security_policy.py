import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, Integer, JSON
from app.core.database import Base

class AgentToolPolicy(Base):
    __tablename__ = "agent_tool_policies"

    agent_role = Column(String(100), primary_key=True)
    allowed_tools = Column(JSON, default=list)
    denied_tools = Column(JSON, default=list)
    requires_approval_tools = Column(JSON, default=list)
    max_requests_per_minute = Column(Integer, default=60)
    max_execution_time_seconds = Column(Integer, default=30)

class PendingToolApproval(Base):
    __tablename__ = "pending_tool_approvals"

    id = Column(String, primary_key=True, default=lambda: f"appr-{uuid.uuid4().hex[:8]}")
    mission_id = Column(String(100), nullable=False)
    agent_role = Column(String(100), nullable=False)
    tool_name = Column(String(100), nullable=False)
    target_resource = Column(String(255), nullable=False)
    payload = Column(JSON, default=dict)
    risk_level = Column(String(50), default="medium")
    reason = Column(Text, default="")
    requested_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String(50), default="pending")
