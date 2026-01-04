from fastapi import APIRouter, HTTPException, Request
from schemas.code_execution import (
    CodeExecutionRequest,
    CodeExecutionResponse,
    SupportedLanguagesResponse
)
from utils.code_execution.code_executer import CodeExecutor, CodeExecutionError
from utils.rate_limiter import limiter
from utils.constants import constants

router = APIRouter(prefix="/code", tags=["Code Execution"])

try:
    executor = CodeExecutor()
except CodeExecutionError as e:
    print(f"Warning: Code executor initialization failed: {e}")
    executor = None


@router.post("/execute", response_model=CodeExecutionResponse)
@limiter.limit(constants.SLOW_RATE_LIMIT)
async def execute_code(request: Request, data: CodeExecutionRequest):
    if executor is None:
        raise HTTPException(
            status_code=503,
            detail="Code execution service is not available. Make sure Docker is running."
        )
    
    try:
        result = executor.execute(
            code=data.code,
            language=data.language.lower(),
            stdin=data.stdin
        )
        return CodeExecutionResponse(**result)
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Code execution failed: {str(e)}"
        )


@router.get("/languages", response_model=SupportedLanguagesResponse)
async def get_supported_languages():
    """
    Get list of all supported programming languages.
    """
    if executor is None:
        raise HTTPException(
            status_code=503,
            detail="Code execution service is not available."
        )
    
    return SupportedLanguagesResponse(
        languages=executor.get_supported_languages()
    )