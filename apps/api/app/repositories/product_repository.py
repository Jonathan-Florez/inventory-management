
from datetime import UTC, datetime
from decimal import Decimal

from sqlmodel import Session, func, select

from app.models.product import Product


class ProductRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_id(self, product_id: int, user_id: int) -> Product | None:
        statement = select(Product).where(
            Product.id == product_id, Product.user_id == user_id
        )
        return self.session.exec(statement).first()

    def get_by_sku(self, sku: str) -> Product | None:
        statement = select(Product).where(Product.sku == sku)
        return self.session.exec(statement).first()

    def list_filtered(
        self,
        user_id: int,
        category_id: int | None,
        status: str | None,
        low_stock: bool | None,
        q: str | None,
        page: int,
        page_size: int,
    ) -> tuple[list[Product], int]:
        statement = select(Product).where(Product.user_id == user_id)

        if category_id is not None:
            statement = statement.where(Product.category_id == category_id)
        if status is not None:
            statement = statement.where(Product.status == status)
        if low_stock:
            statement = statement.where(Product.quantity <= Product.min_stock)
        if q:
            search_term = f"%{q}%"
            statement = statement.where(
                (Product.name.ilike(search_term)) | (Product.sku.ilike(search_term))
            )

        total = self.session.exec(
            select(func.count()).select_from(statement.subquery())
        ).one()

        statement = (
            statement.order_by(Product.name)
            .offset((page - 1) * page_size)
            .limit(page_size)
        )
        items = self.session.exec(statement).all()
        return items, total

    def list_low_stock(self, user_id: int, page: int, page_size: int) -> tuple[list[Product], int]:
        return self.list_filtered(
            user_id=user_id, category_id=None, status=None,
            low_stock=True, q=None, page=page, page_size=page_size,
        )

    def list_all(self, user_id: int) -> list[Product]:
        ##* usado por el export a Excel: trae todos los productos del usuario, sin paginar
        statement = select(Product).where(Product.user_id == user_id).order_by(Product.name)
        return self.session.exec(statement).all()

    def create(self, *, user_id: int, **fields) -> Product:
        product = Product(user_id=user_id, **fields)
        self.session.add(product)
        self.session.commit()
        self.session.refresh(product)
        return product

    def update(self, product: Product, **fields) -> Product:
        for key, value in fields.items():
            if value is not None:
                setattr(product, key, value)
        product.updated_at = datetime.now(UTC)
        self.session.add(product)
        self.session.commit()
        self.session.refresh(product)
        return product

    def delete(self, product: Product) -> None:
        self.session.delete(product)
        self.session.commit()


    ##? Bloqueamos la fila de producto en la db mientras la transaccion del movimiento, por si existe una segunda request tenga que esperar
    ##? a que la primera termine, para que no hallan inconsistencias en un uso de usuario concurrente

    def get_by_id_for_update(self, product_id: int, user_id: int) -> Product | None:
        statement = (
            select(Product)
            .where(Product.id == product_id, Product.user_id == user_id)
            .with_for_update()
        )
        return self.session.exec(statement).first()

    def count_and_value(self, user_id: int) -> tuple[int, Decimal]:
        statement = select(
            func.count(Product.id),
            func.coalesce(func.sum(Product.quantity * Product.price), 0),
        ).where(Product.user_id == user_id)
        total_products, total_value = self.session.exec(statement).one()
        return total_products, total_value

    def count_low_stock(self, user_id: int) -> int:
        statement = select(func.count(Product.id)).where(
            Product.user_id == user_id, Product.quantity <= Product.min_stock
        )
        ##* EL ONE es para que no traiga una lista sino que me extraiga de esa lista el valor directamente y me lo de 
        return self.session.exec(statement).one()