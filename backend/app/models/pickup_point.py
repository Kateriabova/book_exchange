from __future__ import annotations
from typing import TYPE_CHECKING

from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base, TimestampMixin
from models.book import book_pickup_points

if TYPE_CHECKING:
    from models.book import Book


class PickupPoint(Base, TimestampMixin):
    __tablename__ = "pickup_points"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)

    books: Mapped[list["Book"]] = relationship(
        secondary=book_pickup_points,
        back_populates="books",
        lazy="raise_on_sql",
    )