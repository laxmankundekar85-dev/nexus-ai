import io
import os
import uuid
from typing import List, Dict, Any, Tuple
from datetime import datetime, timezone
from sqlalchemy import select, update
from fastapi import UploadFile, HTTPException
from app.core.config import settings
import app.core.database as db
from app.models.document import Document, DocumentChunk
from app.storage.local_storage import storage

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt", ".csv", ".xlsx"}

class DocumentService:
    @staticmethod
    def validate_file(file: UploadFile):
        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file format '{ext}'. Allowed: {', '.join(sorted(list(ALLOWED_EXTENSIONS)))}"
            )

    @staticmethod
    def chunk_text(text: str, chunk_size: int = 800, overlap: int = 100) -> List[str]:
        chunks = []
        start = 0
        text_len = len(text)
        while start < text_len:
            end = min(start + chunk_size, text_len)
            chunks.append(text[start:end])
            start += chunk_size - overlap
            if start + overlap >= text_len and start < text_len:
                break
        return chunks if chunks else [text]

    @classmethod
    async def extract_text(cls, content: bytes, ext: str) -> Tuple[str, List[Dict[str, Any]]]:
        """Extract text and metadata per page/sheet from raw file content."""
        full_text = ""
        pages_metadata = []

        try:
            if ext == ".txt" or ext == ".csv":
                full_text = content.decode("utf-8", errors="replace")
                pages_metadata.append({"page": 1, "text": full_text})

            elif ext == ".pdf":
                import PyPDF2
                reader = PyPDF2.PdfReader(io.BytesIO(content))
                for i, page in enumerate(reader.pages, 1):
                    p_text = page.extract_text() or ""
                    full_text += f"\n--- Page {i} ---\n" + p_text
                    pages_metadata.append({"page": i, "text": p_text})

            elif ext == ".docx":
                import docx
                doc = docx.Document(io.BytesIO(content))
                paragraphs = [p.text for p in doc.paragraphs if p.text]
                full_text = "\n".join(paragraphs)
                pages_metadata.append({"page": 1, "text": full_text})

            elif ext == ".xlsx":
                import openpyxl
                wb = openpyxl.load_workbook(io.BytesIO(content), data_only=True)
                lines = []
                for sheet in wb.sheetnames:
                    lines.append(f"Sheet: {sheet}")
                    ws = wb[sheet]
                    for row in ws.iter_rows(values_only=True):
                        row_vals = [str(cell) for cell in row if cell is not None]
                        if row_vals:
                            lines.append(" | ".join(row_vals))
                full_text = "\n".join(lines)
                pages_metadata.append({"page": 1, "text": full_text})

        except Exception as e:
            full_text = f"Error extracting content from {ext} file: {str(e)}"
            pages_metadata.append({"page": 1, "text": full_text})

        return full_text, pages_metadata

    @classmethod
    async def process_document(cls, document_id: str, content: bytes, ext: str):
        """Asynchronously extract, chunk, and index document."""
        full_text, pages_meta = await cls.extract_text(content, ext)

        async with db.AsyncSessionLocal() as session:
            try:
                # Save chunks
                chunk_index = 0
                for p_info in pages_meta:
                    page_num = p_info.get("page", 1)
                    page_chunks = cls.chunk_text(p_info.get("text", ""))
                    for p_chunk in page_chunks:
                        if p_chunk.strip():
                            chunk = DocumentChunk(
                                id=str(uuid.uuid4()),
                                document_id=document_id,
                                chunk_index=chunk_index,
                                text=p_chunk,
                                page_number=page_num
                            )
                            session.add(chunk)
                            chunk_index += 1

                # Update document status to ready
                await session.execute(
                    update(Document)
                    .where(Document.id == document_id)
                    .values(
                        processing_status="ready",
                        extracted_text_reference=full_text[:20000]  # Store preview
                    )
                )
                await session.commit()

            except Exception as e:
                await session.execute(
                    update(Document)
                    .where(Document.id == document_id)
                    .values(processing_status="failed")
                )
                await session.commit()

document_service = DocumentService()
