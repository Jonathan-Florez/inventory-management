from sqlmodel import Session

from app.repositories.category_repository import CategoryRepository
from app.repositories.movement_repository import MovementRepository
from app.repositories.product_repository import ProductRepository
from app.schemas.dashboard import DashboardSummary
from app.schemas.movement import MovementRead


class DashboardService:
    def __init__(self, session: Session):
        self.product_repository = ProductRepository(session)
        self.category_repository = CategoryRepository(session)
        self.movement_repository = MovementRepository(session)
        
    def get_summary(self, user_id: int) -> DashboardSummary:
        total_products, total_value = self.product_repository.count_and_value(user_id)
        total_categories = self.category_repository.count(user_id)
        low_stock_count = self.product_repository.count_low_stock(user_id)
        recent_movements = self.movement_repository.list_recent(user_id, limit=5)

        return DashboardSummary(
            total_products=total_products,
            total_categories=total_categories,
            low_stock_count=low_stock_count,
            total_inventory_value=total_value,
            recent_movements=[MovementRead.model_validate(m) for m in recent_movements],
        )