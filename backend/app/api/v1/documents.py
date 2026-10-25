import os
import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.core.database import get_db
from app.core.config import settings
from app.models.user import User
from app.models.document import Document
from app.schemas.document import DocumentResponse
from app.schemas.common import PaginatedResponse
from app.api.v1.auth import get_current_user
from app.storage.local_storage import storage
from app.services.document_service import document_service

router = APIRouter(prefix="/documents", tags=["documents"])

@router.get("", response_model=PaginatedResponse[DocumentResponse])
async def list_documents(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    offset = (page - 1) * size

    total_stmt = select(func.count(Document.id)).where(Document.owner_id == user.id)
    total_res = await db.execute(total_stmt)
    total = total_res.scalar() or 0

    stmt = select(Document).where(Document.owner_id == user.id).order_by(Document.created_at.desc()).offset(offset).limit(size)
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

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    document_service.validate_file(file)

    content = await file.read()
    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if len(content) > max_bytes:
        raise HTTPException(
            status_code=400,
            detail=f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_MB}MB"
        )

    ext = os.path.splitext(file.filename)[1].lower()
    doc_id = str(uuid.uuid4())
    storage_key = f"documents/{user.id}/{doc_id}{ext}"

    # Save to storage
    await storage.save(storage_key, content)

    doc = Document(
        id=doc_id,
        owner_id=user.id,
        filename=file.filename,
        storage_key=storage_key,
        mime_type=file.content_type or "application/octet-stream",
        size_bytes=len(content),
        processing_status="processing"
    )
    db.add(doc)
    await db.commit()
    await db.refresh(doc)

    # Process and chunk in background
    background_tasks.add_task(document_service.process_document, doc_id, content, ext)

    return doc

@router.get("/{id}", response_model=DocumentResponse)
async def get_document(
    id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Document).where(Document.id == id, Document.owner_id == user.id))
    doc = res.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc

@router.get("/{id}/text")
async def get_document_text(
    id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Document).where(Document.id == id, Document.owner_id == user.id))
    doc = res.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    return {
        "id": doc.id,
        "filename": doc.filename,
        "processing_status": doc.processing_status,
        "text": doc.extracted_text_reference or "No text extracted or processing in progress."
    }

@router.delete("/{id}")
async def delete_document(
    id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Document).where(Document.id == id, Document.owner_id == user.id))
    doc = res.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    await storage.delete(doc.storage_key)
    await db.delete(doc)
    await db.commit()
    return {"message": "Document deleted successfully"}
