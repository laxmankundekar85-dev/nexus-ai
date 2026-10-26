from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.workflows import router as workflows_router
from app.api.v1.executions import router as executions_router
from app.api.v1.documents import router as documents_router
from app.api.v1.approvals import router as approvals_router
from app.api.v1.artifacts import router as artifacts_router
from app.api.v1.settings import router as settings_router

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth_router)
api_router.include_router(workflows_router)
api_router.include_router(executions_router)
api_router.include_router(documents_router)
api_router.include_router(approvals_router)
api_router.include_router(artifacts_router)
api_router.include_router(settings_router)
