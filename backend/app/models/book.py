from __future__ import annotations
from typing import TYPE_CHECKING

from sqlalchemy import CheckConstraint, Column, ForeignKey, Index, Integer, String, Table
from sqlalchemy.dialects.postgresql import ENUM as PGEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base, TimestampMixin
from models.enums import BookGenre

if TYPE_CHECKING:
    from models.pickup_point import PickupPoint
    from models.reservation import Reservation
    from models.user import User


book_pickup_points = Table(
    "book_pickup_points",
    Base.metadata,
    Column("book_id", Integer, ForeignKey("books.id", ondelete="CASCADE"), primary_key=True),
    Column("pickup_point_id", Integer, ForeignKey("pickup_points.id", ondelete="CASCADE"), primary_key=True),
    Index("idx_book_pickup_points_book", "book_id"),
    Index("idx_book_pickup_points_pickup", "pickup_point_id"),
)


book_genre_enum = PGEnum(
    BookGenre,
    name="book_genre",
    values_callable=lambda obj: [member.value for member in obj],
    create_type=False,
)


class Book(Base, TimestampMixin):
    __tablename__ = "books"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    title: Mapped[str] = mapped_column(String(200), nullable=False)
    author: Mapped[str] = mapped_column(String(150), nullable=False)
    publisher: Mapped[str | None] = mapped_column(String(150))
    year: Mapped[int | None] = mapped_column(Integer)
    pages: Mapped[int | None] = mapped_column(Integer)
    language: Mapped[str] = mapped_column(String(50), nullable=False, default="ru")
    genre: Mapped[BookGenre | None] = mapped_column(book_genre_enum)
    max_loan_days: Mapped[int] = mapped_column(Integer, nullable=False, default=21)

    owner: Mapped["User"] = relationship(
        back_populates="books",
        lazy="raise_on_sql",
    )
    reservations: Mapped[list["Reservation"]] = relationship(
        back_populates="book",
        passive_deletes=True,
        lazy="raise_on_sql",
    )
    pickup_points: Mapped[list["PickupPoint"]] = relationship(
        secondary=book_pickup_points,
        back_populates="books",
        lazy="raise_on_sql",
    )

    __table_args__ = (
        CheckConstraint("year > 0 AND year <= 2100", name="books_year_check"),
        CheckConstraint("pages > 0", name="books_pages_check"),
        CheckConstraint("max_loan_days > 0 AND max_loan_days <= 365", name="books_max_loan_days_check"),
        Index("idx_books_owner", "owner_id"),
        Index("idx_books_title", "title"),
        Index("idx_books_author", "author"),
        Index("idx_books_genre", "genre"),
        Index("idx_books_year", "year"),
    )