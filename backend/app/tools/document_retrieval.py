from typing import Dict, Any, List
from sqlalchemy import select
import app.core.database as db
from app.models.document import Document, DocumentChunk

async def document_retrieval_tool(params: Dict[str, Any], user_id: str, execution_id: str) -> Dict[str, Any]:
    query = params.get("query", "").lower()
    document_ids = params.get("document_ids", [])
    max_passages = params.get("max_passages", 5)

    async with db.AsyncSessionLocal() as session:
        # Get authorized documents for this user
        doc_stmt = select(Document.id, Document.filename).where(
            Document.owner_id == user_id,
            Document.processing_status == "ready"
        )
        if document_ids:
            doc_stmt = doc_stmt.where(Document.id.in_(document_ids))

        doc_result = await session.execute(doc_stmt)
        user_docs = {row.id: row.filename for row in doc_result.all()}

        if not user_docs:
            return {
                "passages": [],
                "message": "No processed documents available for retrieval",
                "count": 0
            }

        # Search chunks for keyword matches
        chunks_stmt = select(DocumentChunk).where(
            DocumentChunk.document_id.in_(list(user_docs.keys()))
        )
        chunks_res = await session.execute(chunks_stmt)
        all_chunks = chunks_res.scalars().all()

        matching_passages = []
        for chunk in all_chunks:
            # Simple keyword or relevance scoring
            text_lower = chunk.text.lower()
            score = 0
            if query:
                for word in query.split():
                    if len(word) > 2 and word in text_lower:
                        score += 1

            if score > 0 or not query:
                matching_passages.append({
                    "document_id": chunk.document_id,
                    "filename": user_docs.get(chunk.document_id, "Unknown"),
                    "page_number": chunk.page_number,
                    "chunk_index": chunk.chunk_index,
                    "text": chunk.text[:500],
                    "relevance_score": score
                })

        # Sort by relevance
        matching_passages.sort(key=lambda x: x["relevance_score"], reverse=True)
        top_passages = matching_passages[:max_passages]

        return {
            "query": query,
            "passages": top_passages,
            "count": len(top_passages)
        }
