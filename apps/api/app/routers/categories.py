from fastapi import APIRouter, Depends, Query
from sqlmodel import Session

from app.core.db import get_session
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.category import CategoryCreate, CategoryRead, CategoryUpdate
from app.schemas.common import PaginatedResponse
from app.services.category_service import CategoryService

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("", response_model=PaginatedResponse[CategoryRead])
def list_categories(
    search: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> PaginatedResponse[CategoryRead]:
    return CategoryService(session).list_categories(
        user_id=current_user.id, search=search, page=page, page_size=page_size
    )


@router.post("", response_model=CategoryRead, status_code=201)
def create_category(
    data: CategoryCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> CategoryRead:
    return CategoryService(session).create_category(data, current_user.id)


@router.get("/{category_id}", response_model=CategoryRead)
def get_category(
    category_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> CategoryRead:
    return CategoryService(session).get_category(category_id, current_user.id)


@router.patch("/{category_id}", response_model=CategoryRead)
def update_category(
    category_id: int,
    data: CategoryUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> CategoryRead:
    return CategoryService(session).update_category(category_id, data, current_user.id)


@router.delete("/{category_id}", status_code=204)
def delete_category(
    category_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> None:
    CategoryService(session).delete_category(category_id, current_user.id)