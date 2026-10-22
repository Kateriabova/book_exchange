from fastapi import APIRouter, Depends, Query, status

from database import get_db
from dependencies import get_current_user_id
from schemas.book import BookCreate, BookDetail, BookRead, BookUpdate
from services.book_service import BookService
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/books", tags=["Книги"])

RESPONSES_404 = {404: {"description": "Ресурс не найден или у вас нет прав доступа"}}
RESPONSES_400 = {400: {"description": "Ошибка валидации"}}
RESPONSES_401 = {401: {"description": "Требуется авторизация"}}

@router.post(
    "/",
    response_model=BookRead,
    status_code=status.HTTP_201_CREATED,
    summary="Добавление новой книги",
    response_description="Созданная книга",
    responses={**RESPONSES_401, **RESPONSES_400},
)
async def create_book(
    data: BookCreate,
    user_id: int = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_db),
):
    service = BookService(session)
    return await service.create(user_id, data)


@router.get(
    "/",
    response_model=list[BookRead],
    summary="Поиск книг в каталоге",
    response_description="Список книг, соответствующих запросу",
)
async def search_books(
    search: str = Query("", description="Поиск по названию или автору"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    session: AsyncSession = Depends(get_db),
):
    service = BookService(session)
    return await service.search(search, skip=skip, limit=limit)


@router.get(
    "/library",
    response_model=list[BookRead],
    summary="Мои книги",
    response_description="Список книг текущего пользователя",
    responses=RESPONSES_401,
)
async def my_books(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    user_id: int = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_db),
):
    service = BookService(session)
    return await service.get_by_owner(user_id, skip=skip, limit=limit)


@router.get(
    "/{book_id}",
    response_model=BookDetail,
    summary="Подробная информация о книге",
    response_description="Полные данные книги с вычисляемыми полями",
    responses=RESPONSES_404,
)
async def get_book(
    book_id: int,
    session: AsyncSession = Depends(get_db),
):
    service = BookService(session)
    return await service.get_detail(book_id)


@router.put(
    "/{book_id}",
    response_model=BookRead,
    summary="Полное обновление книги",
    response_description="Обновлённые данные книги",
    responses={**RESPONSES_401, **RESPONSES_404},
)
async def update_book(
    book_id: int,
    data: BookUpdate,
    user_id: int = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_db),
):
    service = BookService(session)
    return await service.update(book_id, user_id, data)