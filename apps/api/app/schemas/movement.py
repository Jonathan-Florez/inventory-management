from datetime import datetime

from pydantic import BaseModel, Field

from app.models.movement import MovementType


class MovementCreate(BaseModel):
    type: MovementType
    quantity: int = Field(gt=0)
    note: str | None = Field(default=None, max_length=500)


class MovementRead(BaseModel):
    id: int
    product_id: int
    type: MovementType
    quantity: int
    note: str | None
    created_at: datetime

    ##* explicado en el notion
    model_config = {"from_attributes": True}