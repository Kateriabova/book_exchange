from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from models.book import Book
from models.enums import ReservationStatus
from models.reservation import Reservation
from repositories.base import BaseRepository


class ReservationRepository(BaseRepository[Reservation]):
    def __init__(self, session: AsyncSession):
        super().__init__(Reservation, session)

    async def get_by_borrower(
        self, borrower_id: int, *, skip: int = 0, limit: int = 100
    ) -> list[Reservation]:
        stmt = (
            select(Reservation)
            .where(Reservation.borrower_id == borrower_id)
            .order_by(Reservation.id.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def get_by_book_owner(
        self, owner_id: int, *, skip: int = 0, limit: int = 100
    ) -> list[Reservation]:
        """Брони книг по владельцу."""
        stmt = (
            select(Reservation)
            .join(Reservation.book)
            .where(Book.owner_id == owner_id)
            .order_by(Reservation.id.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def get_active_and_reserved_by_borrower(
        self, borrower_id: int
    ) -> list[Reservation]:
        """Только активные и зарезервированные брони пользователя."""
        stmt = (
            select(Reservation)
            .where(
                Reservation.borrower_id == borrower_id,
                Reservation.status.in_([
                    ReservationStatus.RESERVED,
                    ReservationStatus.ACTIVE,
                ]),
            )
            .order_by(Reservation.start_date)
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def get_past_by_borrower(
        self, borrower_id: int, *, skip: int = 0, limit: int = 100
    ) -> list[Reservation]:
        """История броней пользователя"""
        stmt = (
            select(Reservation)
            .where(
                Reservation.borrower_id == borrower_id,
                Reservation.status == ReservationStatus.RETURNED)
            .order_by(Reservation.due_date.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def get_by_book(
        self, book_id: int, *, skip: int = 0, limit: int = 100
    ) -> list[Reservation]:
        stmt = (
            select(Reservation)
            .where(Reservation.book_id == book_id)
            .order_by(Reservation.start_date)
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def get_with_details(self, reservation_id: int) -> Reservation | None:
        """Книга, получатель, точка выдачи."""
        stmt = (
            select(Reservation)
            .where(Reservation.id == reservation_id)
            .options(
                joinedload(Reservation.book).joinedload(Book.owner),
                joinedload(Reservation.borrower),
                joinedload(Reservation.pickup_point),
            )
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()