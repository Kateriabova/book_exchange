from sqlalchemy.ext.asyncio import AsyncSession

from exceptions import NotFoundError
from repositories.user import UserRepository
from schemas.mappers import user_create_to_dict
from schemas.user import UserCreate, UserRead, UserUpdateName, UserUpdatePassword


class UserService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.repo = UserRepository(session)

    async def register(self, data: UserCreate) -> UserRead:
        existing = await self.repo.get_by_login(data.login)
        if existing:
            raise NotFoundError(f"Пользователь с логином '{data.login}' уже существует")

        password_hash = f"hash:{data.password}"
        user_data = user_create_to_dict(data, password_hash)
        user = await self.repo.create(user_data)
        await self.session.commit()
        return UserRead.model_validate(user)

    async def authenticate(self, login: str, password: str) -> UserRead | None:
        password_hash = f"hash:{password}"
        user = await self.repo.get_by_login_and_password(login, password_hash)
        if user is None:
            return None
        return UserRead.model_validate(user)

    async def get_by_id(self, user_id: int) -> UserRead:
        user = await self.repo.get_by_id(user_id)
        if user is None:
            raise NotFoundError("Пользователь не найден")
        return UserRead.model_validate(user)

    async def update_name(self, user_id: int, data: UserUpdateName) -> UserRead:
        user = await self.repo.get_by_id(user_id)
        if user is None:
            raise NotFoundError("Пользователь не найден")

        user = await self.repo.update(user, {"display_name": data.display_name})
        await self.session.commit()
        return UserRead.model_validate(user)

    async def update_password(self, user_id: int, data: UserUpdatePassword) -> UserRead:
        user = await self.repo.get_by_id(user_id)
        if user is None:
            raise NotFoundError("Пользователь не найден")

        password_hash = f"hash:{data.password}"
        user = await self.repo.update_password(user, password_hash)
        await self.session.commit()
        return UserRead.model_validate(user)