from fastapi import APIRouter, Depends, Query, status

from database import get_db
from dependencies import get_current_user_id
from schemas.reservation import (
    ReservationCreate,
    ReservationDetail,
    ReservationRead,
    ReservationStatusUpdate,
    ReservationUpdate,
)
from services.reservation_service import ReservationService
from sqlalchemy.ext.asyncio import AsyncSession

RESPONSES_404 = {404: {"description": "Ресурс не найден или у вас нет прав доступа"}}
RESPONSES_400 = {400: {"description": "Ошибка валидации"}}
RESPONSES_401 = {401: {"description": "Требуется авторизация"}}

router = APIRouter(prefix="/reservations", tags=["Бронирования"])


@router.post(
    "/",
    response_model=ReservationRead,
    status_code=status.HTTP_201_CREATED,
    summary="Создание брони",
    response_description="Созданная бронь",
    responses={**RESPONSES_401, **RESPONSES_400},
)
async def create_reservation(
    data: ReservationCreate,
    user_id: int = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_db),
):
    service = ReservationService(session)
    return await service.create(user_id, data)


@router.get(
    "/",
    response_model=list[ReservationRead],
    summary="Мои активные и зарезервированные брони",
    response_description="Список текущих броней с вычисляемым полем days_until",
    responses=RESPONSES_401,
)
async def my_active_reservations(
    user_id: int = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_db),
):
    service = ReservationService(session)
    return await service.get_active_and_reserved_by_borrower(user_id)


@router.get(
    "/history",
    response_model=list[ReservationRead],
    summary="История бронирований",
    response_description="Список броней со статусом returned",
    responses=RESPONSES_401,
)
async def my_past_reservations(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    user_id: int = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_db),
):
    service = ReservationService(session)
    return await service.get_past_by_borrower(user_id, skip=skip, limit=limit)


@router.get(
    "/all",
    response_model=list[ReservationRead],
    summary="Все мои брони",
    response_description="Полный список броней пользователя",
    responses=RESPONSES_401,
)
async def my_all_reservations(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    user_id: int = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_db),
):
    service = ReservationService(session)
    return await service.get_by_borrower(user_id, skip=skip, limit=limit)


@router.get(
    "/rent",
    response_model=list[ReservationRead],
    summary="Брони моих книг",
    response_description="Список броней на книги текущего пользователя",
    responses=RESPONSES_401,
)
async def rent_reservations(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    user_id: int = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_db),
):
    service = ReservationService(session)
    return await service.get_by_book_owner(user_id, skip=skip, limit=limit)


@router.get(
    "/{reservation_id}",
    response_model=ReservationDetail,
    summary="Подробная информация о брони",
    response_description="Полные данные брони с вложенными объектами",
    responses={**RESPONSES_401, **RESPONSES_404},
)
async def get_reservation(
    reservation_id: int,
    session: AsyncSession = Depends(get_db),
):
    service = ReservationService(session)
    return await service.get_detail(reservation_id)


@router.put(
    "/{reservation_id}",
    response_model=ReservationRead,
    summary="Обновление брони",
    response_description="Обновлённые данные брони",
    responses={**RESPONSES_401, **RESPONSES_404},
)
async def update_reservation(
    reservation_id: int,
    data: ReservationUpdate,
    user_id: int = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_db),
):
    service = ReservationService(session)
    return await service.update(reservation_id, user_id, data)


@router.patch(
    "/{reservation_id}/status",
    response_model=ReservationRead,
    summary="Изменение статуса брони",
    response_description="Обновлённые данные брони",
    responses={**RESPONSES_401, **RESPONSES_404},
)
async def update_reservation_status(
    reservation_id: int,
    data: ReservationStatusUpdate,
    user_id: int = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_db),
):
    service = ReservationService(session)
    return await service.update_status(reservation_id, user_id, data)


@router.get(
    "/book/{book_id}",
    response_model=list[ReservationRead],
    summary="Все брони конкретной книги",
    response_description="Список броней книги",
    responses=RESPONSES_404,
)
async def book_reservations(
    book_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    session: AsyncSession = Depends(get_db),
):
    service = ReservationService(session)
    return await service.get_by_book(book_id, skip=skip, limit=limit)