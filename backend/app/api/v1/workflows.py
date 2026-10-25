from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.core.database import get_db
from app.models.user import User
from app.models.workflow import Workflow
from app.schemas.workflow import WorkflowCreate, WorkflowUpdate, WorkflowResponse, ValidationResult
from app.schemas.common import PaginatedResponse
from app.api.v1.auth import get_current_user
from app.workflows.validator import validate_workflow_graph

router = APIRouter(prefix="/workflows", tags=["workflows"])

@router.get("", response_model=PaginatedResponse[WorkflowResponse])
async def list_workflows(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    offset = (page - 1) * size

    total_stmt = select(func.count(Workflow.id)).where(Workflow.owner_id == user.id)
    total_res = await db.execute(total_stmt)
    total = total_res.scalar() or 0

    stmt = select(Workflow).where(Workflow.owner_id == user.id).order_by(Workflow.created_at.desc()).offset(offset).limit(size)
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

@router.post("", response_model=WorkflowResponse)
async def create_workflow(
    req: WorkflowCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    wf = Workflow(
        owner_id=user.id,
        name=req.name,
        description=req.description,
        workflow_definition=req.workflow_definition.model_dump()
    )
    db.add(wf)
    await db.commit()
    await db.refresh(wf)
    return wf

@router.get("/{id}", response_model=WorkflowResponse)
async def get_workflow(
    id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Workflow).where(Workflow.id == id, Workflow.owner_id == user.id))
    wf = res.scalar_one_or_none()
    if not wf:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return wf

@router.put("/{id}", response_model=WorkflowResponse)
@router.patch("/{id}", response_model=WorkflowResponse)
async def update_workflow(
    id: str,
    req: WorkflowUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Workflow).where(Workflow.id == id, Workflow.owner_id == user.id))
    wf = res.scalar_one_or_none()
    if not wf:
        raise HTTPException(status_code=404, detail="Workflow not found")

    if req.name is not None:
        wf.name = req.name
    if req.description is not None:
        wf.description = req.description
    if req.workflow_definition is not None:
        wf.workflow_definition = req.workflow_definition.model_dump()
        wf.version += 1

    await db.commit()
    await db.refresh(wf)
    return wf

@router.delete("/{id}")
async def delete_workflow(
    id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Workflow).where(Workflow.id == id, Workflow.owner_id == user.id))
    wf = res.scalar_one_or_none()
    if not wf:
        raise HTTPException(status_code=404, detail="Workflow not found")

    await db.delete(wf)
    await db.commit()
    return {"message": "Workflow deleted successfully"}

@router.post("/{id}/validate", response_model=ValidationResult)
async def validate_workflow(
    id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Workflow).where(Workflow.id == id, Workflow.owner_id == user.id))
    wf = res.scalar_one_or_none()
    if not wf:
        raise HTTPException(status_code=404, detail="Workflow not found")

    return validate_workflow_graph(wf.workflow_definition or {})
