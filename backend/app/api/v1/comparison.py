from typing import List, Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.user import User
from app.models.document import Document
from app.api.v1.auth import get_current_user
from app.services.document_comparator import document_comparator

router = APIRouter(prefix="/documents/compare", tags=["comparison"])

class DocumentCompareRequest(BaseModel):
    document_ids: List[str]
    custom_documents: Optional[List[dict]] = None

@router.post("")
async def compare_documents(
    req: DocumentCompareRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    docs_to_compare = []

    if req.custom_documents:
        for cd in req.custom_documents:
            docs_to_compare.append({
                "id": cd.get("id", "custom_doc"),
                "filename": cd.get("filename", "Untitled Document"),
                "text": cd.get("text", "")
            })

    if req.document_ids:
        stmt = select(Document).where(Document.id.in_(req.document_ids), Document.owner_id == user.id)
        res = await db.execute(stmt)
        db_docs = res.scalars().all()
        for d in db_docs:
            docs_to_compare.append({
                "id": d.id,
                "filename": d.filename,
                "text": d.extracted_text_reference or ""
            })

    if not docs_to_compare:
        raise HTTPException(status_code=400, detail="No valid documents found for comparison.")

    result = document_comparator.compare_documents(docs_to_compare)
    return result

