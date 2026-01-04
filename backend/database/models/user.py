from database.models.base import BaseModel
from sqlmodel import Field


class User(BaseModel, table=True):
    username: str = Field(unique=True, index=True)
    email: str = Field(unique=True, index=True)
    full_name: str
    password: str
    is_staff: bool = Field(default=False)
    is_superuser: bool = Field(default=False)
    is_active: bool = Field(default=True)