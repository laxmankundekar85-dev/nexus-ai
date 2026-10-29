from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/supervisor", tags=["Mission Supervisor"])

class BudgetSchema(BaseModel):
    max_tokens: int = 350000
    consumed_tokens: int = 184500
    max_cost_usd: float = 8.50
    consumed_cost_usd: float = 4.12
    max_time_seconds: int = 600
    elapsed_time_seconds: int = 218
    max_iterations: int = 12
    current_iteration: int = 5

class TaskNodeSchema(BaseModel):
    id: str
    name: str
    agent_role: str
    status: str
    dependencies: List[str] = []
    description: str
    output_summary: Optional[str] = None
    started_at: Optional[str] = None
    completed_at: Optional[str] = None
    confidence: Optional[float] = None

class DecisionEventSchema(BaseModel):
    id: str
    timestamp: str
    decision_type: str
    title: str
    detail: str

class SupervisorMissionResponse(BaseModel):
    id: str
    title: str
    objective: str
    status: str
    current_revision: int
    budget: BudgetSchema
    tasks: List[TaskNodeSchema]
    decision_log: List[DecisionEventSchema]
    created_at: str
    updated_at: str

class CreateMissionRequest(BaseModel):
    title: str
    objective: str
    budget: Optional[dict] = None

class StatusUpdateRequest(BaseModel):
    status: str

# In-memory store for active session
_MOCK_MISSIONS = [
    {
        "id": "sm-9041",
        "title": "Q3 Enterprise Revenue & Cross-Regional Market Analysis",
        "objective": "Synthesize quarterly filing across EU and APAC subsidiaries with automated anomaly reconciliation.",
        "status": "running",
        "current_revision": 2,
        "budget": {
            "max_tokens": 350000,
            "consumed_tokens": 184500,
            "max_cost_usd": 8.50,
            "consumed_cost_usd": 4.12,
            "max_time_seconds": 600,
            "elapsed_time_seconds": 218,
            "max_iterations": 12,
            "current_iteration": 5,
        },
        "tasks": [
            {
                "id": "task-1",
                "name": "Ingest Financial Statements",
                "agent_role": "document",
                "status": "completed",
                "dependencies": [],
                "description": "Extract 10-Q tables and normalize currency exchange rates.",
                "output_summary": "Processed 3 quarterly filings; extracted 18 tables.",
                "started_at": "2026-10-29T10:00:00Z",
                "completed_at": "2026-10-29T10:01:15Z",
                "confidence": 0.99,
            },
            {
                "id": "task-2",
                "name": "Extract Revenue Line Items",
                "agent_role": "research",
                "status": "completed",
                "dependencies": ["task-1"],
                "description": "Map regional segmental gross margins and FX variations.",
                "output_summary": "Discovered 14.8% YoY APAC growth; flagged EU margin contraction.",
                "started_at": "2026-10-29T10:01:20Z",
                "completed_at": "2026-10-29T10:02:40Z",
                "confidence": 0.96,
            },
            {
                "id": "task-3",
                "name": "Cross-Document Reconciliation",
                "agent_role": "analysis",
                "status": "running",
                "dependencies": ["task-2"],
                "description": "Apply AST sandbox formula to verify consolidated GAAP figures.",
                "started_at": "2026-10-29T10:02:45Z",
            },
            {
                "id": "task-4",
                "name": "Adversarial Contradiction Review",
                "agent_role": "reviewer",
                "status": "pending",
                "dependencies": ["task-3"],
                "description": "Cross-check forward guidance claims against risk disclosure sections.",
            },
            {
                "id": "task-5",
                "name": "Synthesize Executive Dossier",
                "agent_role": "report",
                "status": "pending",
                "dependencies": ["task-4"],
                "description": "Compile verified claims, citation badges, and SVG charts into final report.",
            },
        ],
        "decision_log": [
            {
                "id": "dec-1",
                "timestamp": "2026-10-29T10:00:00Z",
                "decision_type": "plan_created",
                "title": "DAG Topology Generated",
                "detail": "Supervisor decomposed objective into 5 sequential and parallel execution nodes.",
            },
            {
                "id": "dec-2",
                "timestamp": "2026-10-29T10:01:15Z",
                "decision_type": "checkpoint_saved",
                "title": "Checkpoint 1 Created",
                "detail": "Document ingestion verified with SHA-256 state snapshot.",
            },
            {
                "id": "dec-3",
                "timestamp": "2026-10-29T10:02:40Z",
                "decision_type": "replan_triggered",
                "title": "Dynamic Plan Revision 2",
                "detail": "Adjusted analysis node timeout after detecting 3 new subsidiary tables.",
            },
        ],
        "created_at": "2026-10-29T10:00:00Z",
        "updated_at": "2026-10-29T10:03:00Z",
    }
]

@router.get("/missions", response_model=List[SupervisorMissionResponse])
async def list_missions():
    return _MOCK_MISSIONS

@router.post("/missions", response_model=SupervisorMissionResponse)
async def create_mission(req: CreateMissionRequest):
    new_m = {
        "id": f"sm-{datetime.utcnow().strftime('%H%M%S')}",
        "title": req.title,
        "objective": req.objective,
        "status": "running",
        "current_revision": 1,
        "budget": {
            "max_tokens": 300000,
            "consumed_tokens": 12000,
            "max_cost_usd": 10.0,
            "consumed_cost_usd": 0.24,
            "max_time_seconds": 600,
            "elapsed_time_seconds": 5,
            "max_iterations": 10,
            "current_iteration": 1,
        },
        "tasks": [
            {
                "id": "task-1",
                "name": "Deconstruct Scope & Retrieve Context",
                "agent_role": "planner",
                "status": "running",
                "dependencies": [],
                "description": "Deconstruct objective into executable subtasks.",
                "started_at": datetime.utcnow().isoformat() + "Z",
            },
            {
                "id": "task-2",
                "name": "Extract Ground Truth Data",
                "agent_role": "research",
                "status": "pending",
                "dependencies": ["task-1"],
                "description": "Extract relevant facts from verified sources.",
            },
        ],
        "decision_log": [
            {
                "id": "dec-init",
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "decision_type": "plan_created",
                "title": "Mission Initialized",
                "detail": f"Supervisor constructed execution plan for: {req.title}",
            }
        ],
        "created_at": datetime.utcnow().isoformat() + "Z",
        "updated_at": datetime.utcnow().isoformat() + "Z",
    }
    _MOCK_MISSIONS.insert(0, new_m)
    return new_m

@router.patch("/missions/{mission_id}/status")
async def update_mission_status(mission_id: str, req: StatusUpdateRequest):
    for m in _MOCK_MISSIONS:
        if m["id"] == mission_id:
            m["status"] = req.status
            m["decision_log"].insert(0, {
                "id": f"dec-{datetime.utcnow().timestamp()}",
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "decision_type": "human_escalation",
                "title": f"Status Shift: {req.status}",
                "detail": f"Operator updated status to {req.status}",
            })
            return {"status": "ok", "mission_id": mission_id, "new_status": req.status}
    raise HTTPException(status_code=404, detail="Mission not found")

@router.post("/missions/{mission_id}/tasks/{task_id}/retry")
async def retry_task_node(mission_id: str, task_id: str):
    return {"status": "dispatched", "mission_id": mission_id, "task_id": task_id}
