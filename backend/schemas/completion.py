from pydantic import BaseModel


class CompletionRequest(BaseModel):
    model: str
    user_prompt: str
    