from fastapi import APIRouter, Depends, Query
from sqlmodel import Session

from app.core.db import get_session
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.common import PaginatedResponse
from app.schemas.movement import MovementCreate, MovementRead
from app.services.movement_service import MovementService

router = APIRouter(prefix="/products/{product_id}/movements", tags=["movements"])


@router.get("", response_model=PaginatedResponse[MovementRead])
def list_movements(
    product_id: int,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> PaginatedResponse[MovementRead]:
    return MovementService(session).list_movements(product_id, current_user.id, page, page_size)


@router.post("", response_model=MovementRead, status_code=201)
def create_movement(
    product_id: int,
    data: MovementCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> MovementRead:
    return MovementService(session).create_movement(product_id, data, current_user.id)