from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel

class DocumentResponse(BaseModel):
    id: str
    filename: str
    mime_type: str
    size_bytes: int
    processing_status: str
    created_at: datetime

    class Config:
        from_attributes = True

class DocumentChunkResponse(BaseModel):
    id: str
    document_id: str
    chunk_index: int
    text: str
    page_number: Optional[int] = None

    class Config:
        from_attributes = True
