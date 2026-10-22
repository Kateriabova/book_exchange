from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.user import User
from repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):
    def __init__(self, session: AsyncSession):
        super().__init__(User, session)

    async def get_by_login(self, login: str) -> User | None:
        stmt = select(User).where(User.login == login)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_login_and_password(self, login: str, password_hash: str) -> User | None:
        stmt = select(User).where(
            User.login == login,
            User.password_hash == password_hash,
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def update_password(self, user: User, new_password_hash: str) -> User:
        return await self.update(user, {"password_hash": new_password_hash})