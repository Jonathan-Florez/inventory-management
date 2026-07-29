from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlmodel import Session

from app.core.db import get_session
from app.core.deps import get_current_user
from app.models.product import ProductStatus
from app.models.user import User
from app.schemas.common import PaginatedResponse
from app.schemas.product import ProductCreate, ProductRead, ProductUpdate
from app.services.export_service import ExportService
from app.services.product_service import ProductService

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=PaginatedResponse[ProductRead])
def list_products(
    category_id: int | None = Query(default=None),
    status: ProductStatus | None = Query(default=None),
    low_stock: bool | None = Query(default=None),
    q: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> PaginatedResponse[ProductRead]:
    return ProductService(session).list_products(
        user_id=current_user.id, category_id=category_id, status_filter=status,
        low_stock=low_stock, q=q, page=page, page_size=page_size,
    )


@router.get("/alerts", response_model=PaginatedResponse[ProductRead])
def list_alerts(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> PaginatedResponse[ProductRead]:
    return ProductService(session).list_low_stock(current_user.id, page, page_size)


@router.get("/export/xlsx")
def export_products_xlsx(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> StreamingResponse:
    buffer = ExportService(session).build_products_workbook(current_user.id)
    return StreamingResponse(
        buffer,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=inventario.xlsx"},
    )


@router.post("", response_model=ProductRead, status_code=201)
def create_product(
    data: ProductCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> ProductRead:
    return ProductService(session).create_product(data, current_user.id)


@router.get("/{product_id}", response_model=ProductRead)
def get_product(
    product_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> ProductRead:
    return ProductService(session).get_product(product_id, current_user.id)


@router.patch("/{product_id}", response_model=ProductRead)
def update_product(
    product_id: int,
    data: ProductUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> ProductRead:
    return ProductService(session).update_product(product_id, data, current_user.id)


@router.delete("/{product_id}", status_code=204)
def delete_product(
    product_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> None:
    ProductService(session).delete_product(product_id, current_user.id)