from fastapi import HTTPException, status
from sqlmodel import Session

from app.repositories.category_repository import CategoryRepository
from app.repositories.product_repository import ProductRepository
from app.schemas.common import PaginatedResponse
from app.schemas.product import ProductCreate, ProductRead, ProductUpdate


class ProductService:
    def __init__(self, session: Session):
        self.repository = ProductRepository(session)
        self.category_repository = CategoryRepository(session)

    def _to_read(self, product) -> ProductRead:
        return ProductRead(
            id=product.id,
            category_id=product.category_id,
            name=product.name,
            description=product.description,
            sku=product.sku,
            quantity=product.quantity,
            price=product.price,
            min_stock=product.min_stock,
            location=product.location,
            status=product.status,
            image_url=product.image_url,
            created_at=product.created_at,
            updated_at=product.updated_at,
            is_low_stock=product.quantity <= product.min_stock,
        )

    def _ensure_category_ownership(self, category_id: int, user_id: int) -> None:
        category = self.category_repository.get_by_id(category_id, user_id)
        if category is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found.",
            )

    def _ensure_sku_available(self, sku: str, exclude_product_id: int | None = None) -> None:
        existing = self.repository.get_by_sku(sku)
        if existing is not None and existing.id != exclude_product_id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"SKU '{sku}' is already in use.",
            )

    def list_products(
        self, user_id: int, category_id: int | None, status_filter: str | None,
        low_stock: bool | None, q: str | None, page: int, page_size: int,
    ) -> PaginatedResponse[ProductRead]:
        items, total = self.repository.list_filtered(
            user_id=user_id, category_id=category_id, status=status_filter,
            low_stock=low_stock, q=q, page=page, page_size=page_size,
        )
        return PaginatedResponse(
            items=[self._to_read(p) for p in items], total=total, page=page, page_size=page_size,
        )

    def list_low_stock(self, user_id: int, page: int, page_size: int) -> PaginatedResponse[ProductRead]:
        items, total = self.repository.list_low_stock(user_id, page, page_size)
        return PaginatedResponse(
            items=[self._to_read(p) for p in items], total=total, page=page, page_size=page_size,
        )

    def get_product(self, product_id: int, user_id: int) -> ProductRead:
        product = self.repository.get_by_id(product_id, user_id)
        if product is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found.")
        return self._to_read(product)

    def create_product(self, data: ProductCreate, user_id: int) -> ProductRead:
        self._ensure_category_ownership(data.category_id, user_id)
        self._ensure_sku_available(data.sku)

        product = self.repository.create(
            user_id=user_id,
            category_id=data.category_id,
            name=data.name,
            description=data.description,
            sku=data.sku,
            quantity=data.quantity,
            price=data.price,
            min_stock=data.min_stock,
            location=data.location,
            status=data.status,
            image_url=str(data.image_url) if data.image_url else None,
        )
        return self._to_read(product)

    def update_product(self, product_id: int, data: ProductUpdate, user_id: int) -> ProductRead:
        product = self.repository.get_by_id(product_id, user_id)
        if product is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found.")

        if data.category_id is not None:
            self._ensure_category_ownership(data.category_id, user_id)
        if data.sku is not None:
            self._ensure_sku_available(data.sku, exclude_product_id=product_id)

        updated = self.repository.update(
            product,
            category_id=data.category_id,
            name=data.name,
            description=data.description,
            sku=data.sku,
            price=data.price,
            min_stock=data.min_stock,
            location=data.location,
            status=data.status,
            image_url=str(data.image_url) if data.image_url else None,
        )
        return self._to_read(updated)

    def delete_product(self, product_id: int, user_id: int) -> None:
        product = self.repository.get_by_id(product_id, user_id)
        if product is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found.")
        self.repository.delete(product)