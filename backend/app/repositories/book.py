from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload, selectinload

from models.book import Book, book_pickup_points
from repositories.base import BaseRepository

from models.pickup_point import PickupPoint

class BookRepository(BaseRepository[Book]):
    def __init__(self, session: AsyncSession):
        super().__init__(Book, session)

    async def search(
        self,
        search: str,
        *,
        skip: int = 0,
        limit: int = 100,
    ) -> list[Book]:
        """Поиск по названию ИЛИ автору."""
        term = search.strip()
        if not term:
            return await self.get_all(skip=skip, limit=limit)

        pattern = f"%{term}%"
        stmt = (
            select(Book)
            .where(or_(Book.title.ilike(pattern), Book.author.ilike(pattern)))
            .order_by(Book.id)
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def get_by_owner(
        self, owner_id: int, *, skip: int = 0, limit: int = 100
    ) -> list[Book]:
        stmt = (
            select(Book)
            .where(Book.owner_id == owner_id)
            .order_by(Book.id)
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def get_with_details(self, book_id: int) -> Book | None:
        """Получение книги с владельцем, точками выдачи и бронями."""
        stmt = (
            select(Book)
            .where(Book.id == book_id)
            .options(
                joinedload(Book.owner),
                selectinload(Book.pickup_points),
                selectinload(Book.reservations),
            )
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def set_pickup_points(self, book: Book, pickup_point_ids: list[int]) -> None:
        """Устанавливает связи книги с пунктами выдачи."""
        # Очищаем старые связи
        book.pickup_points.clear()
        
        # Добавляем новые
        if pickup_point_ids:
            stmt = select(PickupPoint).where(PickupPoint.id.in_(pickup_point_ids))
            result = await self.session.execute(stmt)
            points = result.scalars().all()
            book.pickup_points.extend(points)
        
        await self.session.flush()