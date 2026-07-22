
##* En este archivo creamos una clase generica que hace de respuesta paginada para cualquier modelo que se le pase como parametro
from typing import Generic, TypeVar

from pydantic import BaseModel

##* Definimos una variable de tipo para la clase generica
T = TypeVar("T")

##* Creamos la clase paginatedresponse que hereda de basemodel y generic, y recibe un tipo generico T
class PaginatedResponse(BaseModel, Generic[T]):
    items: list[T]
    total: int
    page: int
    page_size: int