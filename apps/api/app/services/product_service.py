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


    ##? Todas las siguientes funciones con _ al inicio son funciones privadas que solo se usan dentro de esta clase, y no se exponen a otros modulos, por eso tienen _ al inicio del nombre

    ##* Esta funcion recibe un objeto Product y lo transforma en un objeto ProductRead, y devuelve un objeto ProductRead con todos los campos del objeto Product, y ademas agrega un campo is_low_stock que indica si el producto tiene stock bajo o no
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

            ##? aca aplicamos la logica de negocio para determinar si el producto tiene stock bajo o no, comparando la cantidad actual con el stock minimo
            is_low_stock=product.quantity <= product.min_stock,
        )


    ##* esta funcion recibe el id de una categoria y el id de el usuario y verifica si la categoria pertenece al usuario, si no pertenece lanza un error 404
    def _ensure_category_ownership(self, category_id: int, user_id: int) -> None:
        category = self.category_repository.get_by_id(category_id, user_id)
        if category is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found.",
            )

    ##* esta funcion recibe el sku de un producto y verifica si ya existe otro producto con ese sku, si existe y es diferente al producto que se esta actualizando, lanza un error 409
    def _ensure_sku_available(self, sku: str, exclude_product_id: int | None = None) -> None:
        existing = self.repository.get_by_sku(sku)
        ##* para extenderme mas en la explicacion de esta validacion, cuando envias un path con por ej solo la descripcion de el producto, el front envia el path con el campo del sku
        ##* si no tuviera esta validacion, la consulta de SQL miraria que el sku es igual y lanzaria el error y diria que hay conflicto 
        ##* entonces ya con la validacion miramos primeramente que exista y que si existe sea diferente a el exclude, si lo es ahi si tira el error
        if existing is not None and existing.id != exclude_product_id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"SKU '{sku}' is already in use.",
            )

    ##* list_products recibe los parametros de filtrado y paginacion y devuelve un objeto PaginatedResponse con los productos que cumplen con los filtros, y el total de productos que cumplen con los filtros igual que en category_service.py, pero en este caso se filtra por categoria, estado, stock bajo y busqueda por nombre o sku
    def list_products(
        self, user_id: int, 
        category_id: int | None, 
        status_filter: str | None,
        low_stock: bool | None, 
        q: str | None, page: 
        int, page_size: int,
    ) -> PaginatedResponse[ProductRead]:
        ##* aca delegamos los filtros al repositorio
        items, total = self.repository.list_filtered(
            user_id=user_id, category_id=category_id, status=status_filter,
            low_stock=low_stock, q=q, page=page, page_size=page_size,
        )
        ##? items en este punto es una lista de productos crudos que nos devolvio el repo
        ##? Por cada producto p que el for va recorriendo, el servicio llama a su propia función privada _to_read
        ##? esta función toma el producto crudo p, limpia los datos, calcula si tiene stock bajo (is_low_stock) y lo convierte en un objeto seguro
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