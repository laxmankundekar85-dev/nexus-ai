from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, JSON, DateTime, ForeignKey
from app.core.database import Base

class GraphNode(Base):
    __tablename__ = "graph_nodes"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    owner_id = Column(String(36), nullable=False, index=True)
    node_type = Column(String(50), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    properties = Column(JSON, default=dict)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class GraphEdge(Base):
    __tablename__ = "graph_edges"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    owner_id = Column(String(36), nullable=False, index=True)
    source_id = Column(String(36), ForeignKey("graph_nodes.id", ondelete="CASCADE"), nullable=False, index=True)
    target_id = Column(String(36), ForeignKey("graph_nodes.id", ondelete="CASCADE"), nullable=False, index=True)
    relation_type = Column(String(50), nullable=False, index=True)
    properties = Column(JSON, default=dict)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
