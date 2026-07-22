from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class CategoryCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Nombre único de la categoría")
    description: str | None = Field(default=None, max_length=500, description="Descripción opcional")


class CategoryUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    description: str | None = Field(default=None, max_length=500)


#? esta clase actua como un contrato de salida 
class CategoryRead(BaseModel):
    id: int
    name: str
    description: str | None
    created_at: datetime
    product_count: int = 0


    ##* esta configuracion es como un superpoder de pydantic que permite leer directamente objetos de dbs como sqlmodel y poder extraer los atributos 
    model_config = ConfigDict(from_attributes=True)