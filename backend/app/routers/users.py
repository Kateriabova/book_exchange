from fastapi import APIRouter, Depends, status

from database import get_db
from dependencies import get_current_user_id
from schemas.user import UserCreate, UserRead, UserUpdateName, UserUpdatePassword
from services.user_service import UserService
from sqlalchemy.ext.asyncio import AsyncSession

RESPONSES_404 = {404: {"description": "Ресурс не найден или у вас нет прав доступа"}}
RESPONSES_400 = {400: {"description": "Ошибка валидации"}}
RESPONSES_401 = {401: {"description": "Требуется авторизация"}}

router = APIRouter(prefix="/users", tags=["Пользователи"])


@router.post(
    "/",
    response_model=UserRead,
    status_code=status.HTTP_201_CREATED,
    summary="Регистрация нового пользователя",
    response_description="Созданный пользователь",
    responses=RESPONSES_400,
)
async def register(
    data: UserCreate,
    session: AsyncSession = Depends(get_db),
):
    service = UserService(session)
    return await service.register(data)


@router.get(
    "/profile",
    response_model=UserRead,
    summary="Получение информации о текущем пользователе",
    response_description="Данные текущего пользователя",
    responses={**RESPONSES_401, **RESPONSES_404},
)
async def get_current_user(
    user_id: int = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_db),
):
    service = UserService(session)
    return await service.get_by_id(user_id)


@router.patch(
    "/profile/name",
    response_model=UserRead,
    summary="Обновление отображаемого имени",
    response_description="Обновлённые данные пользователя",
    responses={**RESPONSES_401, **RESPONSES_404},
)
async def update_name(
    data: UserUpdateName,
    user_id: int = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_db),
):
    service = UserService(session)
    return await service.update_name(user_id, data)


@router.patch(
    "/profile/password",
    response_model=UserRead,
    summary="Смена пароля",
    response_description="Обновлённые данные пользователя",
    responses={**RESPONSES_401, **RESPONSES_404},
)
async def update_password(
    data: UserUpdatePassword,
    user_id: int = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_db),
):
    service = UserService(session)
    return await service.update_password(user_id, data)