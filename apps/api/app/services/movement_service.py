from fastapi import HTTPException, status
from sqlmodel import Session

from app.models.movement import MovementType
from app.repositories.movement_repository import MovementRepository
from app.repositories.product_repository import ProductRepository
from app.schemas.common import PaginatedResponse
from app.schemas.movement import MovementCreate, MovementRead


class MovementService:
    def __init__(self, session: Session):
        self.session = session
        self.movement_repository = MovementRepository(session)
        self.product_repository = ProductRepository(session)


    ##* esta funcion llama al repositorio de productos con la funcion que congela temporalmente en postgreSQL
    ##* si llega otra peticion identica se queda esperando en fila por el congelamiento
    ##* o si el producto no existe o no le concuerda con el id del usuario tira 404 not found
    def create_movement(self, product_id: int, data: MovementCreate, user_id: int) -> MovementRead:
        product = self.product_repository.get_by_id_for_update(product_id, user_id)
        if product is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found.")

        ##* aca hacemos una validacion de negocio, miramos si el movimiento es .out osea una salida y si la cantidad solicitada 
        ##* supera el stock que tenemos
        if data.type == MovementType.out and data.quantity > product.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock. Available: {product.quantity}, requested: {data.quantity}.",
            )

        movement = self.movement_repository.create(
            product_id=product_id, user_id=user_id,
            type=data.type, quantity=data.quantity, note=data.note,
        )

        if data.type == MovementType.in_:
            product.quantity += data.quantity
        else:
            product.quantity -= data.quantity
        self.session.add(product)

        ##* aca dejamos un rollback inplicito, aplicamos atomicidad, nos referimos con esto a que creamos un solo commit, para productos
        ##* y movimiento osea si algo falla antes de este punto no se confirma ninguno de los 2
        ##? y si todo sale bien refresca movement para actualizar cambos automaticos como el id o cuando fue creado que los gnera la db
        self.session.commit()
        self.session.refresh(movement)
        return MovementRead.model_validate(movement)


    
    def list_movements(
        self, product_id: int, user_id: int, page: int, page_size: int
    ) -> PaginatedResponse[MovementRead]:  

        ##* con esta validacion lo que hacemos es verificar primero que el producto exista, y tambien verificar que sea de el 
        ##* usuario que esta consultado, para evitar mostrar productos de usuarios extraños
        product = self.product_repository.get_by_id(product_id, user_id)
        if product is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found.")

        items, total = self.movement_repository.list_by_product(product_id, user_id, page, page_size)
        return PaginatedResponse(
            items=[MovementRead.model_validate(m) for m in items],
            total=total, page=page, page_size=page_size,
        )