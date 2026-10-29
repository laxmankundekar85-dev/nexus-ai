from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from app.models.user import User
from app.api.v1.auth import get_current_user
from app.services.analysis_sandbox import analysis_sandbox
from app.services.security_guard import sanitize_input

router = APIRouter(prefix="/analysis", tags=["analysis"])

class AnalysisExecuteRequest(BaseModel):
    query: str
    data: Optional[List[Dict[str, Any]]] = None

@router.post("/execute")
async def execute_analysis(
    req: AnalysisExecuteRequest,
    user: User = Depends(get_current_user)
):
    sanitized_q, is_safe, reason = sanitize_input(req.query)
    if not is_safe:
        raise HTTPException(status_code=400, detail=f"Query rejected: {reason}")

    res = analysis_sandbox.execute_analysis(sanitized_q, req.data)
    return res
