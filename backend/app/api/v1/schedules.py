from typing import List, Optional
from datetime import datetime, timezone, timedelta
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.user import User
from app.models.scheduled_mission import ScheduledMission
from app.api.v1.auth import get_current_user

router = APIRouter(prefix="/schedules", tags=["schedules"])

class ScheduleCreateRequest(BaseModel):
    name: str
    objective: str
    schedule_type: str = "daily"
    cron_expression: Optional[str] = None
    notify_on_delta: bool = True

class ScheduleUpdateRequest(BaseModel):
    name: Optional[str] = None
    is_active: Optional[bool] = None
    schedule_type: Optional[str] = None
    notify_on_delta: Optional[bool] = None

@router.get("")
async def list_schedules(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(ScheduledMission).where(ScheduledMission.owner_id == user.id).order_by(ScheduledMission.created_at.desc())
    res = await db.execute(stmt)
    schedules = res.scalars().all()
    return [
        {
            "id": s.id,
            "name": s.name,
            "objective": s.objective,
            "schedule_type": s.schedule_type,
            "cron_expression": s.cron_expression,
            "is_active": s.is_active,
            "notify_on_delta": s.notify_on_delta,
            "last_run_at": s.last_run_at.isoformat() if s.last_run_at else None,
            "next_run_at": s.next_run_at.isoformat() if s.next_run_at else None,
            "created_at": s.created_at.isoformat() if s.created_at else None
        }
        for s in schedules
    ]

@router.post("")
async def create_schedule(
    req: ScheduleCreateRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    now = datetime.now(timezone.utc)
    next_run = now + timedelta(days=1 if req.schedule_type == "daily" else 7)

    mission = ScheduledMission(
        owner_id=user.id,
        name=req.name,
        objective=req.objective,
        schedule_type=req.schedule_type,
        cron_expression=req.cron_expression,
        is_active=True,
        notify_on_delta=req.notify_on_delta,
        next_run_at=next_run
    )
    db.add(mission)
    await db.commit()
    await db.refresh(mission)
    return {
        "id": mission.id,
        "name": mission.name,
        "objective": mission.objective,
        "schedule_type": mission.schedule_type,
        "is_active": mission.is_active,
        "next_run_at": mission.next_run_at.isoformat()
    }

@router.patch("/{id}")
async def update_schedule(
    id: str,
    req: ScheduleUpdateRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(ScheduledMission).where(ScheduledMission.id == id, ScheduledMission.owner_id == user.id)
    res = await db.execute(stmt)
    mission = res.scalar_one_or_none()
    if not mission:
        raise HTTPException(status_code=404, detail="Schedule not found")

    if req.name is not None:
        mission.name = req.name
    if req.is_active is not None:
        mission.is_active = req.is_active
    if req.schedule_type is not None:
        mission.schedule_type = req.schedule_type
    if req.notify_on_delta is not None:
        mission.notify_on_delta = req.notify_on_delta

    await db.commit()
    await db.refresh(mission)
    return {"id": mission.id, "name": mission.name, "is_active": mission.is_active}

@router.delete("/{id}")
async def delete_schedule(
    id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(ScheduledMission).where(ScheduledMission.id == id, ScheduledMission.owner_id == user.id)
    res = await db.execute(stmt)
    mission = res.scalar_one_or_none()
    if not mission:
        raise HTTPException(status_code=404, detail="Schedule not found")

    await db.delete(mission)
    await db.commit()
    return {"status": "deleted", "id": id}
