from datetime import datetime
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

class ExecutionCreate(BaseModel):
    objective: str
    workflow_id: Optional[str] = None
    document_ids: Optional[List[str]] = []

class TaskResponse(BaseModel):
    id: str
    execution_id: str
    parent_task_id: Optional[str] = None
    agent_role: str
    description: str
    status: str
    input_data: Optional[Dict[str, Any]] = None
    output_data: Optional[Dict[str, Any]] = None
    attempt_count: int
    error_summary: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ExecutionResponse(BaseModel):
    id: str
    objective: str
    workflow_id: Optional[str] = None
    status: str
    plan: Optional[Any] = None
    error_summary: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime
    tasks: Optional[List[TaskResponse]] = []

    class Config:
        from_attributes = True

class ExecutionEventResponse(BaseModel):
    id: str
    execution_id: str
    task_id: Optional[str] = None
    event_type: str
    safe_metadata: Dict[str, Any] = {}
    created_at: datetime

    class Config:
        from_attributes = True
