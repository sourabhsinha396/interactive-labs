from pydantic import BaseModel, Field
from typing import Optional


class CodeExecutionRequest(BaseModel):    
    code: str = Field(..., description="Source code to execute")
    language: str = Field(..., description="Programming language (python, javascript, java, etc.)")
    stdin: Optional[str] = Field(None, description="Optional input to pass to the program")
    
    class Config:
        json_schema_extra = {
            "example": {
                "code": "print('Hello, World!')",
                "language": "python",
                "stdin": None
            }
        }


class CodeExecutionResponse(BaseModel):    
    stdout: str = Field(..., description="Standard output from the program")
    stderr: str = Field(..., description="Standard error from the program")
    exit_code: int = Field(..., description="Exit code (0 = success)")
    execution_time: float = Field(..., description="Execution time in seconds")
    error: Optional[str] = Field(None, description="Error message if execution failed")
    
    class Config:
        json_schema_extra = {
            "example": {
                "stdout": "Hello, World!\n",
                "stderr": "",
                "exit_code": 0,
                "execution_time": 0.123,
                "error": None
            }
        }


class SupportedLanguagesResponse(BaseModel):    
    languages: list[str] = Field(..., description="List of supported programming languages")
    
    class Config:
        json_schema_extra = {
            "example": {
                "languages": ["python", "javascript", "java", "cpp", "go"]
            }
        }