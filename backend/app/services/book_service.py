from sqlalchemy.ext.asyncio import AsyncSession

from exceptions import NotFoundError
from repositories.book import BookRepository
from schemas.book import BookCreate, BookDetail, BookRead, BookUpdate
from schemas.mappers import book_create_to_dict, book_to_detail, book_to_read, book_update_to_dict


class BookService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.repo = BookRepository(session)

    async def create(self, owner_id: int, data: BookCreate) -> BookRead:
        book_data = book_create_to_dict(data, owner_id)
        book = await self.repo.create(book_data)

        if data.pickup_point_ids:
            await self.repo.set_pickup_points(book, data.pickup_point_ids)

        await self.session.commit()
        return book_to_read(book)

    async def update(self, book_id: int, user_id: int, data: BookUpdate) -> BookRead:
        book = await self.repo.get_by_id(book_id)
        if book is None:
            raise NotFoundError("Книга не найдена или не принадлежит вам")

        if book.owner_id != user_id:
            raise NotFoundError("Книга не найдена или не принадлежит вам")

        book_data = book_update_to_dict(data)
        book = await self.repo.update(book, book_data)

        if data.pickup_point_ids is not None:
            await self.repo.set_pickup_points(book, data.pickup_point_ids)

        await self.session.commit()
        return book_to_read(book)

    async def get_detail(self, book_id: int) -> BookDetail:
        book = await self.repo.get_with_details(book_id)
        if book is None:
            raise NotFoundError("Книга не найдена")
        return book_to_detail(book)

    async def search(
        self, search: str, *, skip: int = 0, limit: int = 20
    ) -> list[BookRead]:
        books = await self.repo.search(search, skip=skip, limit=limit)
        return [book_to_read(book) for book in books]

    async def get_by_owner(
        self, owner_id: int, *, skip: int = 0, limit: int = 100
    ) -> list[BookRead]:
        books = await self.repo.get_by_owner(owner_id, skip=skip, limit=limit)
        return [book_to_read(book) for book in books]