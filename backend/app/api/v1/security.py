from fastapi import APIRouter
from typing import List, Dict, Any
from pydantic import BaseModel

router = APIRouter(prefix="/security", tags=["Security & Governance"])

class PolicySchema(BaseModel):
    agent_role: str
    allowed_tools: List[str]
    denied_tools: List[str]
    requires_approval_tools: List[str]
    max_requests_per_minute: int
    max_execution_time_seconds: int

class ApprovalSchema(BaseModel):
    id: str
    mission_id: str
    agent_role: str
    tool_name: str
    target_resource: str
    payload: Dict[str, Any]
    risk_level: str
    reason: str
    requested_at: str
    status: str

class ResolveRequest(BaseModel):
    decision: str

@router.get("/policies", response_model=List[PolicySchema])
async def list_policies():
    return [
        {
            "agent_role": "planner",
            "allowed_tools": ["knowledge_search", "document_catalog", "schedule_lookup"],
            "denied_tools": ["database_write", "api_webhook_post", "credential_access"],
            "requires_approval_tools": ["replan_active_mission", "budget_expansion"],
            "max_requests_per_minute": 60,
            "max_execution_time_seconds": 30,
        },
        {
            "agent_role": "research",
            "allowed_tools": ["web_search", "sec_edgar_read", "vector_similarity_search"],
            "denied_tools": ["shell_exec", "file_write_disk", "raw_sql_query"],
            "requires_approval_tools": ["external_api_post"],
            "max_requests_per_minute": 120,
            "max_execution_time_seconds": 60,
        },
    ]

@router.get("/approvals", response_model=List[ApprovalSchema])
async def list_approvals():
    return [
        {
            "id": "appr-901",
            "mission_id": "sm-9041",
            "agent_role": "analysis",
            "tool_name": "custom_code_eval",
            "target_resource": "AST Python Computation Sandbox",
            "payload": {"formula": "np.polyfit(quarters, earnings, 2)"},
            "risk_level": "medium",
            "reason": "Non-standard polynomial regression requires operator approval.",
            "requested_at": "2026-10-29T10:02:40Z",
            "status": "pending",
        }
    ]

@router.post("/approvals/{approval_id}/resolve")
async def resolve_approval(approval_id: str, req: ResolveRequest):
    return {"status": "resolved", "id": approval_id, "decision": req.decision}
