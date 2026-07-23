from decimal import Decimal

from pydantic import BaseModel

from app.schemas.movement import MovementRead


class DashboardSummary(BaseModel):
    total_products: int
    total_categories: int
    low_stock_count: int
    total_inventory_value: Decimal
    ##* definimos que recent_movements sera una lista y debe cumplir las validaciones definidas en MovementRead
    recent_movements: list[MovementRead]