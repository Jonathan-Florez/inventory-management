from datetime import UTC, datetime, timedelta

from sqlmodel import Session, func, select

from app.models.movement import Movement


class MovementRepository:
    def __init__(self, session: Session):
        self.session = session


    ##* * obliga a que todos los parametros pedidos se pasen usando sus nombres explicitos al llamar la funcion
    def create(self, *, product_id: int, user_id: int, type: str, quantity: int, note: str | None) -> Movement:
        movement = Movement(
            product_id=product_id, user_id=user_id, type=type, quantity=quantity, note=note
        )
        ##* aca aun no confirmamos el movimiento, aca solo por decir lo preparamos wpara insertarlo, el service es el que da la luz verde al final
        self.session.add(movement)
        return movement


    def list_by_product(
        self, product_id: int, user_id: int, page: int, page_size: int
    ) -> tuple[list[Movement], int]:

        ##* definimos base que nos va a filtar los movimientos que si coincidan con el producto y pertenezca al usuario 
        base = select(Movement).where(
            Movement.product_id == product_id, Movement.user_id == user_id
        )

        ##* ejecutamos un subquery rapida que cuenta el total de movements que hay en la db bajo los filtros 
        total = self.session.exec(
            select(func.count()).select_from(base.subquery())
        ).one()

        ##* aplicamos un order_by, que ordena los movimientos de forma descendente osea los mas recientes primero
        ##* el offset es para saber cuantos registros saltarse segun la pagina en la que este el usuario, y el limit el limite de registros que va a traer
        statement = (
            base.order_by(Movement.created_at.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
        )
        items = self.session.exec(statement).all()
        return items, total

    def list_recent(self, user_id: int, limit: int) -> list[Movement]:
        statement = (
            select(Movement)
            .where(Movement.user_id == user_id)
            .order_by(Movement.created_at.desc())
            .limit(limit)
        )
        return self.session.exec(statement).all()

    def get_daily_totals(self, user_id: int, days: int) -> list:
        ##* traemos movimientos desde el inicio del dia hace `days - 1` dias
        ##* (para incluir el dia de hoy como el ultimo dia del rango)
        since = datetime.now(UTC) - timedelta(days=days - 1)
        since_start = since.replace(hour=0, minute=0, second=0, microsecond=0)

        statement = (
            select(
                func.date(Movement.created_at).label("day"),
                Movement.type,
                func.sum(Movement.quantity).label("total"),
            )
            .where(Movement.user_id == user_id, Movement.created_at >= since_start)
            .group_by(func.date(Movement.created_at), Movement.type)
        )
        return self.session.exec(statement).all()