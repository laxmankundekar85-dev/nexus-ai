from fastapi import APIRouter
from typing import List, Optional
from pydantic import BaseModel

router = APIRouter(prefix="/recovery", tags=["Execution Recovery"])

class IncidentSchema(BaseModel):
    id: str
    mission_id: str
    task_id: str
    task_name: str
    failure_class: str
    error_message: str
    attempt_number: int
    max_attempts: int
    strategy_applied: str
    status: str
    timestamp: str

class CircuitBreakerSchema(BaseModel):
    provider_id: str
    provider_name: str
    status: str
    failure_count: int
    threshold: int
    last_failure_at: Optional[str] = None

@router.get("/incidents", response_model=List[IncidentSchema])
async def list_incidents():
    return [
        {
            "id": "rec-401",
            "mission_id": "sm-9041",
            "task_id": "task-3",
            "task_name": "AST Sandbox Numerical Calculation",
            "failure_class": "timeout",
            "error_message": "Execution exceeded 4000ms threshold during multi-sheet matrix multiplication.",
            "attempt_number": 1,
            "max_attempts": 3,
            "strategy_applied": "re_prompt_clarification",
            "status": "recovered",
            "timestamp": "2026-10-29T10:02:48Z",
        },
        {
            "id": "rec-402",
            "mission_id": "sm-9038",
            "task_id": "task-2",
            "task_name": "OpenAI Embeddings Generation",
            "failure_class": "rate_limit",
            "error_message": "HTTP 429 Too Many Requests: TPM limit exceeded for text-embedding-3-small.",
            "attempt_number": 2,
            "max_attempts": 4,
            "strategy_applied": "exponential_backoff",
            "status": "recovered",
            "timestamp": "2026-10-29T09:15:22Z",
        },
    ]

@router.get("/circuit-breakers", response_model=List[CircuitBreakerSchema])
async def list_circuit_breakers():
    return [
        {
            "provider_id": "prov-openai",
            "provider_name": "OpenAI GPT-4o Gateway",
            "status": "closed",
            "failure_count": 0,
            "threshold": 5,
        },
        {
            "provider_id": "prov-anthropic",
            "provider_name": "Anthropic Claude 3.5 Sonnet",
            "status": "closed",
            "failure_count": 1,
            "threshold": 5,
            "last_failure_at": "2026-10-29T09:12:00Z",
        },
    ]

@router.post("/circuit-breakers/{provider_id}/reset")
async def reset_circuit(provider_id: str):
    return {"status": "reset", "provider_id": provider_id, "state": "closed"}
