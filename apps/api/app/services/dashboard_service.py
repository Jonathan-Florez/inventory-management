from datetime import UTC, datetime, timedelta

from sqlmodel import Session

from app.repositories.category_repository import CategoryRepository
from app.repositories.movement_repository import MovementRepository
from app.repositories.product_repository import ProductRepository
from app.schemas.dashboard import DashboardSummary, MovementTimelinePoint
from app.schemas.movement import MovementRead

TIMELINE_DAYS = 7


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
        movements_timeline = self._build_timeline(user_id, days=TIMELINE_DAYS)

        return DashboardSummary(
            total_products=total_products,
            total_categories=total_categories,
            low_stock_count=low_stock_count,
            total_inventory_value=total_value,
            recent_movements=[MovementRead.model_validate(m) for m in recent_movements],
            movements_timeline=movements_timeline,
        )

    def _build_timeline(self, user_id: int, days: int) -> list[MovementTimelinePoint]:
        raw_totals = self.movement_repository.get_daily_totals(user_id, days=days)

        ##* totals queda como { fecha: {"in": cantidad, "out": cantidad} }
        totals: dict = {}
        for day, movement_type, total in raw_totals:
            ##* algunos drivers devuelven `day` como date y otros como datetime; normalizamos 
            day_key = day.date() if hasattr(day, "date") else day
            type_key = movement_type.value if hasattr(movement_type, "value") else movement_type
            ##* setdefault es un metodo nativo de los dic de python, busca si la key day_key existe en el dict, si no existe
            ##* la crea con el valor por defecto en este caso in out 0 y 0 sino no hace nadda y devuelve lo que hay

            totals.setdefault(day_key, {"in": 0, "out": 0})[type_key] = int(total)

        today = datetime.now(UTC).date()
        points: list[MovementTimelinePoint] = []
        ##* range (start, stop, step) es una funcion de py, aqui le decimos que empiece en days -1, y que vaya hasta el -1 
        ##* sin incluirlo, osea para en 0, y que reste de uno en uno
        for offset in range(days - 1, -1, -1):
            day = today - timedelta(days=offset)
            entry = totals.get(day, {"in": 0, "out": 0}) ##* aca sucede lo mismo, utilziamos get para traer el dia, si no hubo movimiento devuelve valor por defecto 0 y 0
            points.append( ##! instanciamos un nuevo objeto pasando la fecha calculada, la cantidad de in y de out que obtuvimos en el paso anterior y luego lo agrega (.append) a la lista de resultados y la deuvelve
                MovementTimelinePoint(
                    date=day,
                    in_quantity=entry["in"],
                    out_quantity=entry["out"],
                )
            )
        return points

    