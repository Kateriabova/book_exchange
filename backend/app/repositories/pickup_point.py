from sqlalchemy.ext.asyncio import AsyncSession

from models.pickup_point import PickupPoint
from repositories.base import BaseRepository


class PickupPointRepository(BaseRepository[PickupPoint]):
    def __init__(self, session: AsyncSession):
        super().__init__(PickupPoint, session)