from datetime import datetime
from typing import Dict, Any, Optional
from pydantic import BaseModel

class ApprovalRequestResponse(BaseModel):
    id: str
    execution_id: str
    task_id: Optional[str] = None
    action_type: str
    proposed_action: Dict[str, Any]
    status: str
    reviewer_id: Optional[str] = None
    reviewer_name: Optional[str] = None
    decision: Optional[str] = None
    comments: Optional[str] = None
    modified_action: Optional[Dict[str, Any]] = None
    requested_at: datetime
    resolved_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ApprovalResolveRequest(BaseModel):
    decision: str  # approved | rejected | edited | evidence_requested
    reason: Optional[str] = None
    comments: Optional[str] = None
    modified_action: Optional[Dict[str, Any]] = None
