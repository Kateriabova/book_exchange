from __future__ import annotations
from datetime import date
from typing import TYPE_CHECKING

from sqlalchemy import CheckConstraint, Date, ForeignKey, Index, Integer
from sqlalchemy.dialects.postgresql import ENUM as PGEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base, TimestampMixin
from models.enums import ReservationStatus

if TYPE_CHECKING:
    from models.book import Book
    from models.pickup_point import PickupPoint
    from models.user import User


reservation_status_enum = PGEnum(
    ReservationStatus,
    name="reservation_status",
    values_callable=lambda obj: [member.value for member in obj],
    create_type=False,
)


class Reservation(Base, TimestampMixin):
    __tablename__ = "reservations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    book_id: Mapped[int] = mapped_column(ForeignKey("books.id", ondelete="CASCADE"), nullable=False)
    borrower_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    pickup_point_id: Mapped[int] = mapped_column(ForeignKey("pickup_points.id"), nullable=False)

    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    due_date: Mapped[date] = mapped_column(Date, nullable=False)
    status: Mapped[ReservationStatus] = mapped_column(
        reservation_status_enum,
        nullable=False,
        default=ReservationStatus.RESERVED,
    )

    book: Mapped["Book"] = relationship(back_populates="reservations", lazy="raise_on_sql")
    borrower: Mapped["User"] = relationship(back_populates="reservations", lazy="raise_on_sql")
    pickup_point: Mapped["PickupPoint"] = relationship(lazy="raise_on_sql")

    __table_args__ = (
        CheckConstraint("start_date >= CURRENT_DATE", name="reservations_start_date_check"),
        CheckConstraint("due_date >= start_date", name="reservations_due_date_check"),
        CheckConstraint("due_date - start_date <= 365", name="reservations_period_check"),
        Index("idx_reservations_book", "book_id"),
        Index("idx_reservations_borrower", "borrower_id"),
        Index("idx_reservations_status", "status"),
        Index("idx_reservations_dates", "start_date", "due_date"),
        Index("idx_reservations_pickup", "pickup_point_id"),
        Index("idx_reservations_book_status_dates", "book_id", "status", "start_date", "due_date"),
    )