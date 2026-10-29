import asyncio
from datetime import datetime, timezone
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, update
from app.core.database import get_db
from app.core.redis_client import redis_manager
from app.models.user import User
from app.models.execution import Execution, ExecutionEvent
from app.models.task import Task
from app.models.artifact import Artifact
from app.models.claim import Claim
from app.schemas.execution import ExecutionCreate, ExecutionResponse, TaskResponse
from app.schemas.artifact import ArtifactResponse
from app.schemas.common import PaginatedResponse
from app.api.v1.auth import get_current_user, get_current_user_from_query
from app.agents.orchestrator import orchestrator

import re

ALLOWED_EXCEPTIONS = {'strengths', 'latchstring', 'catchphrase', 'lengths', 'postgresql', 'mysql'}
KEYBOARD_MASH_REGEX = re.compile(r'^(?:asdfgh|qwerty|zxcvbn|poiuyt|lkjhgf|mnbvcx)', re.IGNORECASE)
LONG_CONSONANT_CLUSTER_REGEX = re.compile(r'[bcdfghjklmnpqrstvwxz]{5,}', re.IGNORECASE)

def validate_objective(objective: str, has_docs: bool = False) -> Optional[str]:
    clean = objective.strip()
    if not clean:
        return "Objective cannot be empty"
    if len(clean) < 6 and not has_docs:
        return "Objective is too brief (minimum 6 characters)"
    if re.search(r'(.)\1{4,}', clean):
        return "Objective contains repeating characters and appears invalid"
    words = [w for w in re.split(r'[\s,.;:!?/\-_+=(){}\[\]"\']+', clean) if w]
    for w in words:
        cw = re.sub(r'[^a-zA-Z]', '', w)
        if KEYBOARD_MASH_REGEX.search(cw):
            return f'Word "{w}" appears to be keyboard mashing'
        if len(cw) >= 5 and not re.search(r'[aeiouy]', cw, re.IGNORECASE):
            return f'Word "{w}" contains no vowels and appears to be gibberish'
        if LONG_CONSONANT_CLUSTER_REGEX.search(cw) and cw.lower() not in ALLOWED_EXCEPTIONS:
            return f'Word "{w}" contains invalid consonant clusters and appears to be gibberish'
    return None

router = APIRouter(prefix="/executions", tags=["executions"])

@router.get("", response_model=PaginatedResponse[ExecutionResponse])
async def list_executions(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    offset = (page - 1) * size

    total_stmt = select(func.count(Execution.id)).where(Execution.owner_id == user.id)
    total_res = await db.execute(total_stmt)
    total = total_res.scalar() or 0

    stmt = select(Execution).where(Execution.owner_id == user.id).order_by(Execution.created_at.desc()).offset(offset).limit(size)
    res = await db.execute(stmt)
    items = res.scalars().all()

    pages = (total + size - 1) // size if total > 0 else 1

    return PaginatedResponse(
        items=items,
        total=total,
        page=page,
        size=size,
        pages=pages
    )

@router.post("", response_model=ExecutionResponse)
async def create_execution(
    req: ExecutionCreate,
    background_tasks: BackgroundTasks,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    validation_err = validate_objective(req.objective, bool(req.document_ids and len(req.document_ids) > 0))
    if validation_err:
        raise HTTPException(status_code=400, detail=validation_err)

    execution = Execution(
        owner_id=user.id,
        workflow_id=req.workflow_id,
        objective=req.objective,
        status="queued"
    )
    db.add(execution)
    await db.commit()
    await db.refresh(execution)

    # Launch execution asynchronously in background task
    background_tasks.add_task(orchestrator.run_execution, execution.id, user.id)

    return execution

@router.get("/{id}", response_model=ExecutionResponse)
async def get_execution(
    id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Execution).where(Execution.id == id, Execution.owner_id == user.id))
    execution = res.scalar_one_or_none()
    if not execution:
        raise HTTPException(status_code=404, detail="Execution not found")

    tasks_res = await db.execute(select(Task).where(Task.execution_id == id).order_by(Task.started_at))
    tasks = tasks_res.scalars().all()

    resp = ExecutionResponse.model_validate(execution)
    resp.tasks = [TaskResponse.model_validate(t) for t in tasks]
    return resp

@router.post("/{id}/cancel", response_model=ExecutionResponse)
async def cancel_execution(
    id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Execution).where(Execution.id == id, Execution.owner_id == user.id))
    execution = res.scalar_one_or_none()
    if not execution:
        raise HTTPException(status_code=404, detail="Execution not found")

    if execution.status in ["completed", "failed", "cancelled"]:
        raise HTTPException(status_code=400, detail=f"Cannot cancel execution in '{execution.status}' status")

    execution.status = "cancelled"
    execution.completed_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(execution)

    await orchestrator.emit_event(id, "status_changed", {"status": "cancelled", "message": "Execution cancelled by user"})
    return execution

@router.post("/{id}/retry", response_model=ExecutionResponse)
async def retry_execution(
    id: str,
    background_tasks: BackgroundTasks,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Execution).where(Execution.id == id, Execution.owner_id == user.id))
    execution = res.scalar_one_or_none()
    if not execution:
        raise HTTPException(status_code=404, detail="Execution not found")

    if execution.status not in ["failed", "cancelled"]:
        raise HTTPException(status_code=400, detail="Only failed or cancelled executions can be retried")

    execution.status = "queued"
    execution.error_summary = None
    execution.started_at = None
    execution.completed_at = None
    await db.commit()
    await db.refresh(execution)

    background_tasks.add_task(orchestrator.run_execution, execution.id, user.id)
    return execution

@router.post("/{id}/pause", response_model=ExecutionResponse)
async def pause_execution(
    id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Execution).where(Execution.id == id, Execution.owner_id == user.id))
    execution = res.scalar_one_or_none()
    if not execution:
        raise HTTPException(status_code=404, detail="Execution not found")

    if execution.status not in ["running", "planning", "reviewing"]:
        raise HTTPException(status_code=400, detail=f"Cannot pause execution in '{execution.status}' status")

    execution.status = "paused"
    await db.commit()
    await db.refresh(execution)

    await orchestrator.emit_event(id, "status_changed", {"status": "paused", "message": "Execution paused by operator"})
    return execution

@router.post("/{id}/resume", response_model=ExecutionResponse)
async def resume_execution(
    id: str,
    background_tasks: BackgroundTasks,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Execution).where(Execution.id == id, Execution.owner_id == user.id))
    execution = res.scalar_one_or_none()
    if not execution:
        raise HTTPException(status_code=404, detail="Execution not found")

    if execution.status != "paused":
        raise HTTPException(status_code=400, detail="Only paused executions can be resumed")

    execution.status = "running"
    await db.commit()
    await db.refresh(execution)

    await orchestrator.emit_event(id, "status_changed", {"status": "running", "message": "Execution resumed by operator"})
    background_tasks.add_task(orchestrator.run_execution, execution.id, user.id)
    return execution

@router.post("/{id}/tasks/{task_id}/retry", response_model=TaskResponse)
async def retry_task(
    id: str,
    task_id: str,
    background_tasks: BackgroundTasks,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    exec_res = await db.execute(select(Execution).where(Execution.id == id, Execution.owner_id == user.id))
    execution = exec_res.scalar_one_or_none()
    if not execution:
        raise HTTPException(status_code=404, detail="Execution not found")

    task_res = await db.execute(select(Task).where(Task.id == task_id, Task.execution_id == id))
    task = task_res.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.status = "pending"
    task.error_summary = None
    task.attempt_count = (task.attempt_count or 0) + 1
    await db.commit()
    await db.refresh(task)

    await orchestrator.emit_event(id, "task_retried", {"task_id": task_id, "agent_role": task.agent_role}, task_id=task_id)
    background_tasks.add_task(orchestrator.run_execution, execution.id, user.id)
    return task

@router.get("/{id}/claims")
async def get_execution_claims(
    id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    exec_res = await db.execute(select(Execution).where(Execution.id == id, Execution.owner_id == user.id))
    if not exec_res.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Execution not found")

    claims_res = await db.execute(select(Claim).where(Claim.execution_id == id).order_by(Claim.created_at))
    claims = claims_res.scalars().all()
    return [
        {
            "id": c.id,
            "execution_id": c.execution_id,
            "claim_text": c.claim_text,
            "status": c.status,
            "confidence_score": c.confidence_score,
            "source_type": c.source_type,
            "source_name": c.source_name,
            "page_number": c.page_number,
            "extracted_passage": c.extracted_passage,
            "source_url": c.source_url,
            "created_at": c.created_at.isoformat() if c.created_at else None
        }
        for c in claims
    ]

@router.get("/{id}/tasks", response_model=List[TaskResponse])
async def get_execution_tasks(
    id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Verify execution ownership
    res = await db.execute(select(Execution).where(Execution.id == id, Execution.owner_id == user.id))
    if not res.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Execution not found")

    tasks_res = await db.execute(select(Task).where(Task.execution_id == id).order_by(Task.started_at))
    return tasks_res.scalars().all()

@router.get("/{id}/artifacts", response_model=List[ArtifactResponse])
async def get_execution_artifacts(
    id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Execution).where(Execution.id == id, Execution.owner_id == user.id))
    if not res.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Execution not found")

    art_res = await db.execute(select(Artifact).where(Artifact.execution_id == id))
    return art_res.scalars().all()

@router.get("/{id}/events")
async def stream_execution_events(
    id: str,
    user: User = Depends(get_current_user_from_query),
    db: AsyncSession = Depends(get_db)
):
    """Server-Sent Events endpoint streaming execution progress in real-time."""
    res = await db.execute(select(Execution).where(Execution.id == id, Execution.owner_id == user.id))
    if not res.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Execution not found")

    async def event_generator():
        # First send historical events
        hist_res = await db.execute(
            select(ExecutionEvent)
            .where(ExecutionEvent.execution_id == id)
            .order_by(ExecutionEvent.created_at)
        )
        for ev in hist_res.scalars().all():
            data_json = f'{{"id":"{ev.id}","execution_id":"{ev.execution_id}","event_type":"{ev.event_type}","safe_metadata":{ev.safe_metadata},"created_at":"{ev.created_at.isoformat()}"}}'
            yield f"data: {data_json}\n\n"

        # Then stream live events
        async for msg in redis_manager.subscribe_events(f"execution:{id}"):
            yield f"data: {msg}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )
