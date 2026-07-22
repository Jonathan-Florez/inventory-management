from datetime import datetime
from decimal import Decimal
from app.models.product import ProductStatus

from pydantic import BaseModel, Field, HttpUrl


class ProductCreate(BaseModel):
    category_id: int
    name: str = Field(min_length=1, max_length=150)
    description: str | None = Field(default=None, max_length=1000)
    sku: str = Field(min_length=1, max_length=50)
    quantity: int = Field(ge=0)
    price: Decimal = Field(gt=0, max_digits=10, decimal_places=2)
    min_stock: int = Field(ge=0)
    location: str | None = Field(default=None, max_length=100)
    status: ProductStatus = ProductStatus.active
    image_url: HttpUrl | None = None


class ProductUpdate(BaseModel):
    category_id: int | None = None
    name: str | None = Field(default=None, min_length=1, max_length=150)
    description: str | None = Field(default=None, max_length=1000)
    sku: str | None = Field(default=None, min_length=1, max_length=50)
    price: Decimal | None = Field(default=None, gt=0, max_digits=10, decimal_places=2)
    min_stock: int | None = Field(default=None, ge=0)
    location: str | None = Field(default=None, max_length=100)
    status: ProductStatus | None = None
    image_url: HttpUrl | None = None


class ProductRead(BaseModel):
    id: int
    category_id: int
    name: str
    description: str | None
    sku: str
    quantity: int
    price: Decimal
    min_stock: int
    location: str | None
    status: ProductStatus
    image_url: str | None
    created_at: datetime
    updated_at: datetime
    is_low_stock: bool

    ##* esta configuracion permite que pydantic pueda leer y transformar objetos de la db directamente a formato JSON
    model_config = {"from_attributes": True}