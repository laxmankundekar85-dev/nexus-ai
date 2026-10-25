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
    requested_at: datetime
    resolved_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ApprovalResolveRequest(BaseModel):
    decision: str  # approved | rejected
    reason: Optional[str] = None
