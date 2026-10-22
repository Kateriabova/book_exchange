from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class PickupPointCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)


class PickupPointUpdate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)


class PickupPointRead(BaseModel):
    id: int
    name: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PickupPointBrief(BaseModel):
    """Для вложения"""
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)