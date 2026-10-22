from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field, model_validator

from models.enums import ReservationStatus
from schemas.book import BookBrief
from schemas.pickup_point import PickupPointBrief
from schemas.user import UserBrief

MAX_PERIOD_DAYS = 365


class ReservationCreate(BaseModel):
    book_id: int
    pickup_point_id: int
    start_date: date
    due_date: date | None = Field(
        None,
        description="Если не передан — считается как start_date + book.max_loan_days",
    )

    @model_validator(mode="after")
    def _validate_period(self) -> "ReservationCreate":
        if self.start_date < date.today():
            raise ValueError("start_date не может быть в прошлом")
        if self.due_date is not None:
            if self.due_date < self.start_date:
                raise ValueError("due_date раньше start_date")
            if (self.due_date - self.start_date).days > MAX_PERIOD_DAYS:
                raise ValueError(f"Срок аренды не может превышать {MAX_PERIOD_DAYS} дней")
        return self


class ReservationUpdate(BaseModel):
    """Обновление брони — все поля обязательные (доступно только для статуса 'reserved')."""
    pickup_point_id: int
    start_date: date
    due_date: date

    @model_validator(mode="after")
    def _validate_period(self) -> "ReservationUpdate":
        if self.start_date < date.today():
            raise ValueError("start_date не может быть в прошлом")
        if self.due_date < self.start_date:
            raise ValueError("due_date раньше start_date")
        if (self.due_date - self.start_date).days > MAX_PERIOD_DAYS:
            raise ValueError(f"Срок аренды не может превышать {MAX_PERIOD_DAYS} дней")
        return self


class ReservationStatusUpdate(BaseModel):
    """Смена статуса брони."""
    status: ReservationStatus


class ReservationRead(BaseModel):
    """Для списков броней"""
    id: int
    book_id: int
    borrower_id: int
    pickup_point_id: int
    start_date: date
    due_date: date
    status: ReservationStatus
    days_until: int | None = Field(
        None,
        description="Дней до начала (RESERVED) или до конца (ACTIVE). None для RETURNED/CANCELLED.",
    )
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ReservationDetail(ReservationRead):
    """Полный ответ с вложенными объектами."""
    book: BookBrief
    borrower: UserBrief
    pickup_point: PickupPointBrief