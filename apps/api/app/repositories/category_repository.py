from sqlmodel import Session, func, select

from app.models.category import Category
from app.models.product import Product


class CategoryRepository:
    def __init__(self, session: Session):
        self.session = session


    ##* por convencion se inicia esta funcion con _ para indicar que es privada, y no se debe llamar desde afuera de la clase 
    def _apply_filters(self, statement, user_id: int, search: str | None):
        ##? aplicamos un filtro a la consulta para que solo traiga las categorias del usuario logueado, usando el user_id que se pasa como parametro, para evitar que se muestran las categorias de otros usuarios por error o por un ataque
        statement = statement.where(Category.user_id == user_id)
        ##? si tenemos el parametro search, aplicamos un filtro adicional a la consulta, usando ilike para hacer una busqueda que no le improte si es mayuscula o minuscula, 
        if search:
            statement = statement.where(
                ##? ILIKE (insensitive LIKE)
                ##? el % es un comodin que indica que puede haber cualquier cosa antes o despues del texto buscado, para que la busqueda sea mas flexible
                Category.name.ilike(f"%{search}%") | Category.description.ilike(f"%{search}%")
            )
        return statement

    def get_by_id(self, category_id: int, user_id: int) -> Category | None:
        statement = select(Category).where(
            Category.id == category_id, Category.user_id == user_id
        )
        return self.session.exec(statement).first()

    def list_with_product_count(
        self, user_id: int, search: str | None, page: int, page_size: int
    ) -> tuple[list[tuple[Category, int]], int]:

        ##* 
        count_statement = self._apply_filters(
            select(func.count(Category.id)), user_id, search
        )
        total = self.session.exec(count_statement).one()

        ##* Aca creamos una query que selecciona las categorias y hace un left outer join(isouter=True) con la tabla de productos, si no utilizaramos el isouter=true, solo nos traeria las categorias que tienen productos asociados, y no las categorias que no tienen productos, y es lo que necesitamos
        statement = select(Category, func.count(Product.id)).join(
            Product, Product.category_id == Category.id, isouter=True
        )

        
        statement = self._apply_filters(statement, user_id, search)

        ##* Aca aplicamos un group by para agrupar por categoria, y un order by para ordenar por nombre de categoria, y un offset y limit para paginar los resultados, usando el page y page_size que se pasan como parametros
        statement = (
            statement.group_by(Category.id)
            .order_by(Category.name)
            .offset((page - 1) * page_size)
            .limit(page_size)
        )


    ##*aca ejecutamos la query y obtenemos una lista de tuplas (Category, product_count), usando un list comprehension para desempaquetar cada tupla en las variables category y product_count, y devolver una lista de tuplas (Category, product_count) y el total de categorias que cumplen con los filtros que es lo que el service esta esperando recibir
        results = [(row[0], row[1]) for row in self.session.exec(statement).all()]
        return results, total



    def create(self, *, user_id: int, name: str, description: str | None) -> Category:
            category = Category(user_id=user_id, name=name, description=description)
            self.session.add(category)
            self.session.commit()
            self.session.refresh(category)
            return category

    def update(self, category: Category, *, name: str | None, description: str | None) -> Category:
            if name is not None:
                category.name = name
            if description is not None:
                category.description = description
            self.session.add(category)
            self.session.commit()
            self.session.refresh(category)
            return category

    def delete(self, category: Category) -> None:
            self.session.delete(category)
            self.session.commit()   

    def count(self, user_id: int) -> int:
        statement = select(func.count(Category.id)).where(Category.user_id == user_id)
        return self.session.exec(statement).one()