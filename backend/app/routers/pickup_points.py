from fastapi import APIRouter, Depends, Query, status

from database import get_db
from schemas.pickup_point import PickupPointCreate, PickupPointRead, PickupPointUpdate
from services.pickup_point_service import PickupPointService
from sqlalchemy.ext.asyncio import AsyncSession

RESPONSES_404 = {404: {"description": "Ресурс не найден или у вас нет прав доступа"}}
RESPONSES_400 = {400: {"description": "Ошибка валидации"}}
RESPONSES_401 = {401: {"description": "Требуется авторизация"}}

router = APIRouter(prefix="/pickup-points", tags=["Пункты выдачи"])


@router.post(
    "/",
    response_model=PickupPointRead,
    status_code=status.HTTP_201_CREATED,
    summary="Создание пункта выдачи",
    response_description="Созданный пункт выдачи",
    responses=RESPONSES_400,
)
async def create_pickup_point(
    data: PickupPointCreate,
    session: AsyncSession = Depends(get_db),
):
    service = PickupPointService(session)
    return await service.create(data)


@router.get(
    "/",
    response_model=list[PickupPointRead],
    summary="Список всех пунктов выдачи",
    response_description="Список пунктов выдачи с пагинацией",
)
async def list_pickup_points(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    session: AsyncSession = Depends(get_db),
):
    service = PickupPointService(session)
    return await service.get_all(skip=skip, limit=limit)


@router.put(
    "/{point_id}",
    response_model=PickupPointRead,
    summary="Обновление пункта выдачи",
    response_description="Обновлённые данные пункта",
    responses=RESPONSES_404,
)
async def update_pickup_point(
    point_id: int,
    data: PickupPointUpdate,
    session: AsyncSession = Depends(get_db),
):
    service = PickupPointService(session)
    return await service.update(point_id, data)