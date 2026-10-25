from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Response
from fastapi.responses import Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.core.database import get_db
from app.models.user import User
from app.models.artifact import Artifact
from app.schemas.artifact import ArtifactResponse
from app.schemas.common import PaginatedResponse
from app.api.v1.auth import get_current_user, get_current_user_from_query
from app.storage.local_storage import storage

router = APIRouter(prefix="/artifacts", tags=["artifacts"])

@router.get("", response_model=PaginatedResponse[ArtifactResponse])
async def list_artifacts(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    offset = (page - 1) * size

    total_stmt = select(func.count(Artifact.id)).where(Artifact.owner_id == user.id)
    total_res = await db.execute(total_stmt)
    total = total_res.scalar() or 0

    stmt = select(Artifact).where(Artifact.owner_id == user.id).order_by(Artifact.created_at.desc()).offset(offset).limit(size)
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

@router.get("/{id}", response_model=ArtifactResponse)
async def get_artifact(
    id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Artifact).where(Artifact.id == id, Artifact.owner_id == user.id))
    artifact = res.scalar_one_or_none()
    if not artifact:
        raise HTTPException(status_code=404, detail="Artifact not found")
    return artifact

@router.get("/{id}/download")
async def download_artifact(
    id: str,
    user: User = Depends(get_current_user_from_query),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Artifact).where(Artifact.id == id, Artifact.owner_id == user.id))
    artifact = res.scalar_one_or_none()
    if not artifact:
        raise HTTPException(status_code=404, detail="Artifact not found")

    try:
        content = await storage.load(artifact.storage_key)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Artifact file content not found in storage")

    filename = f"nexus_report_{id[:8]}.md"
    media_type = "text/markdown; charset=utf-8"

    return Response(
        content=content,
        media_type=media_type,
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        }
    )
