from fastapi import HTTPException, status
from sqlmodel import Session

from app.repositories.category_repository import CategoryRepository
from app.schemas.category import CategoryCreate, CategoryRead, CategoryUpdate
from app.schemas.common import PaginatedResponse


class CategoryService:
    def __init__(self, session: Session):
        self.repository = CategoryRepository(session)

    def list_categories(
        self, user_id: int, search: str | None, page: int, page_size: int
    ) -> PaginatedResponse[CategoryRead]:
        ##* aca creamos 2 variables results y total, que son el resultado de la funcion list_with_product_count del repositorio, que devuelve una lista de tuplas (Category, product_count) y el total de categorias que cumplen con los filtros
        results, total = self.repository.list_with_product_count(
            user_id=user_id, search=search, page=page, page_size=page_size
        )
        ##* cada objeto fabricado limpiamente por categoryRead se va enlistando en la lista items, que es la que se va a devolver en la respuesta paginada
        items = [
            CategoryRead(
                id=category.id,
                name=category.name,
                description=category.description,
                created_at=category.created_at,
                product_count=product_count,
            )

            ##? En este for desempaquetamos la tupla (Category, product_count) en las variables category y product_count, y creamos un objeto CategoryRead con los atributos de la categoria y el product_count
            for category, product_count in results
        ]
        return PaginatedResponse(items=items, total=total, page=page, page_size=page_size)

    def get_category(self, category_id: int, user_id: int) -> CategoryRead:
        category = self.repository.get_by_id(category_id, user_id)
        if category is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Category not found."
            )
        return CategoryRead.model_validate(category)

    def create_category(self, data: CategoryCreate, user_id: int) -> CategoryRead:
        category = self.repository.create(
            user_id=user_id, name=data.name, description=data.description
        )
        return CategoryRead.model_validate(category)

    def update_category(
        self, category_id: int, data: CategoryUpdate, user_id: int
    ) -> CategoryRead:
        category = self.repository.get_by_id(category_id, user_id)
        if category is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Category not found."
            )
        updated = self.repository.update(
            category, name=data.name, description=data.description
        )
        return CategoryRead.model_validate(updated)

    def delete_category(self, category_id: int, user_id: int) -> None:
        category = self.repository.get_by_id(category_id, user_id)
        if category is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Category not found."
            )
        self.repository.delete(category)