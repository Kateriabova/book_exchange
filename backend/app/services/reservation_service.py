from datetime import timedelta

from sqlalchemy.ext.asyncio import AsyncSession

from models.enums import ReservationStatus
from repositories.book import BookRepository
from repositories.reservation import ReservationRepository
from schemas.mappers import (
    reservation_create_to_dict,
    reservation_to_detail,
    reservation_to_read,
    reservation_update_to_dict,
)
from schemas.reservation import (
    ReservationCreate,
    ReservationDetail,
    ReservationRead,
    ReservationStatusUpdate,
    ReservationUpdate,
)


class ReservationService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.repo = ReservationRepository(session)
        self.book_repo = BookRepository(session)

    async def create(self, borrower_id: int, data: ReservationCreate) -> ReservationRead:
        """Создание брони."""
        book = await self.book_repo.get_by_id(data.book_id)
        if book is None:
            raise ValueError("Книга не найдена")

        # Вычисляем due_date если не передан
        if data.due_date is None:
            data.due_date = data.start_date + timedelta(days=book.max_loan_days)

        reservation_data = reservation_create_to_dict(data, borrower_id)
        reservation = await self.repo.create(reservation_data)
        await self.session.commit()
        return reservation_to_read(reservation)

    async def update(self, reservation_id: int, data: ReservationUpdate) -> ReservationRead:
        """Обновление брони (только для статуса RESERVED)."""
        reservation = await self.repo.get_by_id(reservation_id)
        if reservation is None:
            raise ValueError("Бронь не найдена")

        if reservation.status != ReservationStatus.RESERVED:
            raise ValueError("Обновление доступно только для зарезервированных броней")

        reservation_data = reservation_update_to_dict(data)
        reservation = await self.repo.update(reservation, reservation_data)
        await self.session.commit()
        return reservation_to_read(reservation)

    async def update_status(
        self, reservation_id: int, data: ReservationStatusUpdate
    ) -> ReservationRead:
        """Смена статуса брони с проверкой допустимых переходов."""
        reservation = await self.repo.get_by_id(reservation_id)
        if reservation is None:
            raise ValueError("Бронь не найдена")

        current = reservation.status
        new = data.status

        allowed_transitions = {
            ReservationStatus.RESERVED: {ReservationStatus.ACTIVE, ReservationStatus.CANCELLED},
            ReservationStatus.ACTIVE: {ReservationStatus.RETURNED},
            ReservationStatus.RETURNED: set(),
            ReservationStatus.CANCELLED: set(),
        }

        if new not in allowed_transitions[current]:
            raise ValueError(
                f"Недопустимый переход статуса: {current.value} → {new.value}"
            )

        reservation = await self.repo.update(reservation, {"status": new})
        await self.session.commit()
        return reservation_to_read(reservation)

    async def get_detail(self, reservation_id: int) -> ReservationDetail | None:
        """Получение полной информации о брони."""
        reservation = await self.repo.get_with_details(reservation_id)
        if reservation is None:
            return None
        return reservation_to_detail(reservation)

    async def get_by_borrower(
        self, borrower_id: int, *, skip: int = 0, limit: int = 100
    ) -> list[ReservationRead]:
        """Все брони получателя."""
        reservations = await self.repo.get_by_borrower(
            borrower_id, skip=skip, limit=limit
        )
        return [reservation_to_read(r) for r in reservations]

    async def get_by_book_owner(
        self, owner_id: int, *, skip: int = 0, limit: int = 100
    ) -> list[ReservationRead]:
        """Брони книг, принадлежащих владельцу."""
        reservations = await self.repo.get_by_book_owner(
            owner_id, skip=skip, limit=limit
        )
        return [reservation_to_read(r) for r in reservations]

    async def get_active_and_reserved_by_borrower(
        self, borrower_id: int
    ) -> list[ReservationRead]:
        """Только активные и зарезервированные брони пользователя."""
        reservations = await self.repo.get_active_and_reserved_by_borrower(borrower_id)
        return [reservation_to_read(r) for r in reservations]

    async def get_past_by_borrower(
        self, borrower_id: int, *, skip: int = 0, limit: int = 100
    ) -> list[ReservationRead]:
        """История бронирования пользователей"""
        reservations = await self.repo.get_past_by_borrower(
            borrower_id, skip=skip, limit=limit
        )
        return [reservation_to_read(r) for r in reservations]

    async def get_by_book(
        self, book_id: int, *, skip: int = 0, limit: int = 100
    ) -> list[ReservationRead]:
        """Все брони конкретной книги."""
        reservations = await self.repo.get_by_book(book_id, skip=skip, limit=limit)
        return [reservation_to_read(r) for r in reservations]