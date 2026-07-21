import enum
from datetime import UTC, datetime

from sqlalchemy import Column
from sqlalchemy import Enum as SAEnum
from sqlmodel import Field, SQLModel


class MovementType(str, enum.Enum):
    in_ = "in"
    out = "out"


class Movement(SQLModel, table=True):
    __tablename__ = "movements"

    id: int | None = Field(default=None, primary_key=True)
    product_id: int = Field(foreign_key="products.id", nullable=False, index=True)
    user_id: int = Field(foreign_key="users.id", nullable=False, index=True)

    type: MovementType = Field(
        sa_column=Column(
            SAEnum(MovementType, values_callable=lambda enum_cls: [e.value for e in enum_cls]),
            nullable=False,
        )
    )
    quantity: int = Field(gt=0)
    note: str | None = Field(default=None)

    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))