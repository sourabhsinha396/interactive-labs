from fastapi import APIRouter
from apis.routes.auth import router as auth_router
from apis.routes.code_execution import router as code_execution_router

router = APIRouter(prefix="/api/v1")

router.include_router(auth_router, prefix="/auth")
router.include_router(code_execution_router, prefix="/code-execution")