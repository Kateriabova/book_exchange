from sqlalchemy.ext.asyncio import AsyncSession

from exceptions import NotFoundError
from repositories.pickup_point import PickupPointRepository
from schemas.pickup_point import (
    PickupPointCreate,
    PickupPointRead,
    PickupPointUpdate,
)


class PickupPointService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.repo = PickupPointRepository(session)

    async def create(self, data: PickupPointCreate) -> PickupPointRead:
        point = await self.repo.create({"name": data.name})
        await self.session.commit()
        return PickupPointRead.model_validate(point)

    async def update(self, point_id: int, data: PickupPointUpdate) -> PickupPointRead:
        point = await self.repo.get_by_id(point_id)
        if point is None:
            raise NotFoundError("Пункт выдачи не найден")

        point = await self.repo.update(point, {"name": data.name})
        await self.session.commit()
        return PickupPointRead.model_validate(point)

    async def get_all(self, skip: int = 0, limit: int = 100) -> list[PickupPointRead]:
        points = await self.repo.get_all(skip=skip, limit=limit)
        return [PickupPointRead.model_validate(p) for p in points]