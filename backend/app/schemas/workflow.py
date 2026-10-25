from datetime import datetime
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

class WorkflowNode(BaseModel):
    id: str
    type: str
    position: Dict[str, float]
    configuration: Dict[str, Any] = {}
    data: Optional[Dict[str, Any]] = None

class WorkflowEdge(BaseModel):
    id: str
    source: str
    target: str
    metadata: Optional[Dict[str, Any]] = None

class WorkflowGraph(BaseModel):
    nodes: List[WorkflowNode] = []
    edges: List[WorkflowEdge] = []

class WorkflowCreate(BaseModel):
    name: str
    description: Optional[str] = None
    workflow_definition: WorkflowGraph

class WorkflowUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    workflow_definition: Optional[WorkflowGraph] = None

class WorkflowResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    workflow_definition: Dict[str, Any]
    version: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ValidationResult(BaseModel):
    valid: bool
    errors: List[str] = []
    warnings: List[str] = []
