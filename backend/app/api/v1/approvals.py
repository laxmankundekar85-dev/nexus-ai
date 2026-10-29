from datetime import datetime, timezone
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from app.core.database import get_db
from app.models.user import User
from app.models.execution import Execution
from app.models.approval import ApprovalRequest
from app.schemas.approval import ApprovalRequestResponse, ApprovalResolveRequest
from app.api.v1.auth import get_current_user
from app.agents.orchestrator import orchestrator

router = APIRouter(prefix="/approvals", tags=["approvals"])

@router.get("", response_model=List[ApprovalRequestResponse])
async def list_approvals(
    execution_id: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = (
        select(ApprovalRequest)
        .join(Execution, ApprovalRequest.execution_id == Execution.id)
        .where(Execution.owner_id == user.id)
    )

    if execution_id:
        stmt = stmt.where(ApprovalRequest.execution_id == execution_id)
    if status:
        stmt = stmt.where(ApprovalRequest.status == status)

    stmt = stmt.order_by(ApprovalRequest.requested_at.desc())
    res = await db.execute(stmt)
    return res.scalars().all()

@router.post("/{id}/resolve", response_model=ApprovalRequestResponse)
async def resolve_approval(
    id: str,
    req: ApprovalResolveRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = (
        select(ApprovalRequest)
        .join(Execution, ApprovalRequest.execution_id == Execution.id)
        .where(ApprovalRequest.id == id, Execution.owner_id == user.id)
    )
    res = await db.execute(stmt)
    approval = res.scalar_one_or_none()
    if not approval:
        raise HTTPException(status_code=404, detail="Approval request not found")

    if approval.status != "pending":
        raise HTTPException(status_code=400, detail=f"Approval request is already '{approval.status}'")

    decision_lower = req.decision.lower()
    approval.status = decision_lower
    approval.decision = decision_lower
    approval.reviewer_id = user.id
    approval.reviewer_name = user.email
    approval.comments = req.comments or req.reason
    if req.modified_action:
        approval.modified_action = req.modified_action
    approval.resolved_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(approval)

    # Emit event to notify execution
    await orchestrator.emit_event(
        approval.execution_id,
        "approval_resolved",
        {
            "approval_id": approval.id,
            "status": approval.status,
            "decision": decision_lower,
            "reviewer": user.email,
            "comments": approval.comments,
            "modified_action": approval.modified_action
        }
    )

    return approval
