import enum
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from models.enums import BookGenre
from schemas.pickup_point import PickupPointBrief
from schemas.user import UserBrief


class BookStatus(str, enum.Enum):
    AVAILABLE = "available"
    RESERVED = "reserved"
    BORROWED = "borrowed"


class BookCreate(BaseModel):
    """Создание книги."""
    title: str = Field(..., min_length=1, max_length=200)
    author: str = Field(..., min_length=1, max_length=150)
    publisher: str | None = Field(None, max_length=150)
    year: int | None = Field(None, gt=0, le=2100)
    pages: int | None = Field(None, gt=0)
    language: str = Field("ru", min_length=2, max_length=50)
    genre: BookGenre | None = None
    max_loan_days: int = Field(21, ge=1, le=365)
    pickup_point_ids: list[int] = Field(default_factory=list)


class BookUpdate(BaseModel):
    """Обновление книги — все поля обязательные."""
    title: str = Field(..., min_length=1, max_length=200)
    author: str = Field(..., min_length=1, max_length=150)
    publisher: str | None = Field(..., max_length=150)
    year: int | None = Field(..., gt=0, le=2100)
    pages: int | None = Field(..., gt=0)
    language: str = Field(..., min_length=2, max_length=50)
    genre: BookGenre | None = Field(...)
    max_loan_days: int = Field(..., ge=1, le=365)
    pickup_point_ids: list[int] = Field(...)


class BookRead(BaseModel):
    id: int
    owner_id: int
    title: str
    author: str
    publisher: str | None
    year: int | None
    pages: int | None
    language: str
    genre: BookGenre | None
    max_loan_days: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class BookDetail(BookRead):
    owner: UserBrief
    pickup_points: list[PickupPointBrief]
    status: BookStatus
    reservations_count: int


class BookBrief(BaseModel):
    """Для вложения"""
    id: int
    title: str
    owner_login: str

    model_config = ConfigDict(from_attributes=True)