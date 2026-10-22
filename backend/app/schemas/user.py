from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class UserCreate(BaseModel):
    """Регистрация: пароль приходит открытым, хэшируется в сервисе."""
    login: str = Field(..., min_length=3, max_length=50, pattern=r"^[A-Za-z0-9_.-]+$")
    password: str = Field(..., min_length=8, max_length=128)
    display_name: str = Field(..., min_length=1, max_length=100)


class UserUpdateName(BaseModel):
    display_name: str = Field(..., min_length=1, max_length=100)


class UserUpdatePassword(BaseModel):
    password: str = Field(..., min_length=8, max_length=128)


class UserRead(BaseModel):
    id: int
    login: str
    display_name: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserBrief(BaseModel):
    id: int
    login: str
    display_name: str

    model_config = ConfigDict(from_attributes=True)