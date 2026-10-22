from __future__ import annotations
from typing import TYPE_CHECKING

from sqlalchemy import Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base, TimestampMixin

if TYPE_CHECKING:
    from models.book import Book
    from models.reservation import Reservation


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    login: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    display_name: Mapped[str] = mapped_column(String(100), nullable=False)

    books: Mapped[list["Book"]] = relationship(
        back_populates="owner",
        passive_deletes=True,
        lazy="raise_on_sql",
    )
    reservations: Mapped[list["Reservation"]] = relationship(
        back_populates="borrower",
        passive_deletes=True,
        lazy="raise_on_sql",
    )

    __table_args__ = (
        Index("idx_users_login", "login"),
    )