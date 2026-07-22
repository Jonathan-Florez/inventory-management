import enum
from datetime import UTC, datetime
from decimal import Decimal
from sqlalchemy import Column, ForeignKey, Integer

from sqlmodel import Field, SQLModel


class ProductStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"
    discontinued = "discontinued"


class Product(SQLModel, table=True):
    __tablename__ = "products"

    id: int | None = Field(default=None, primary_key=True)
    ##* Conexion con la tabla de categorias, con ondelete="CASCADE" para que si se borra una categoria, se borren todos los productos asociados a esa categoria, y con index=True para que sea mas rapido buscar por categoria
    category_id: int = Field(
        sa_column=Column(Integer, ForeignKey("categories.id", ondelete="CASCADE"), nullable=False, index=True)
    )
    user_id: int = Field(foreign_key="users.id", nullable=False, index=True)

    name: str = Field(nullable=False, index=True)
    sku: str = Field(unique=True, index=True, nullable=False)
    description: str | None = Field(default=None)

    quantity: int = Field(default=0, ge=0)
    price: Decimal = Field(default=0, max_digits=10, decimal_places=2, ge=0)
    min_stock: int = Field(default=0, ge=0)

    location: str | None = Field(default=None)
    status: ProductStatus = Field(default=ProductStatus.active)
    image_url: str | None = Field(default=None)

    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))