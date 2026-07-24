
import argparse
import random
from datetime import UTC, datetime, timedelta
from decimal import Decimal

from sqlmodel import Session, select, delete

from app.core.db import engine
from app.core.security import hash_password
from app.models.category import Category
from app.models.movement import Movement, MovementType
from app.models.product import Product, ProductStatus
from app.models.user import User


##* Esta funcion busca el primer usuario que encuentre en la tabla, si first devuelve algo que no sea none, osea que ya hay usuarios, la funcion devuelve booleano (true)
##* esto nos ayuda a evitar que si ejecutamos el script 2 veces dupliquemos datos
def already_seeded(session: Session) -> bool:
    return session.exec(select(User)).first() is not None



def create_users(session: Session) -> list[User]:
    users_data = [
        {"email": "ana@example.com", "name": "Ana Torres", "password": "password123"},
        {"email": "luis@example.com", "name": "Luis Gómez", "password": "password123"},
    ]
    users = []
    for data in users_data:
        user = User(
            email=data["email"],
            name=data["name"],
            password_hash=hash_password(data["password"]),
        )
        session.add(user)  ##? session.add no mete en la db de inmediato el usuario, lo deja por decir en el cache 
        users.append(user)
    session.commit() ##? aca en el commit si es donde se abre la transaccion y genera los comandos y los envia a postgre
    for user in users:
        session.refresh(user) ##? aca refrescamos usuarios para que python sepa que id tienen los usuarios en la db, ya que estaba generando error porque al hacer 
        ##? commit a la db python aun no sabe que ids tienen estos usuarios , entonces al refrescar vuelve y consulta y rellena el atributo que tenemos declarado .id
        ##? lo cual es muy importante porque los otros metodos necesitan los ids como FK
    return users



##* las funciones que crean las categorias y productos funcionan exactamente igual
def create_categories(session: Session, users: list[User]) -> list[Category]:
    categories_data = [
        {"user": users[0], "name": "Electrónica", "description": "Componentes y dispositivos electrónicos"},
        {"user": users[0], "name": "Ferretería", "description": "Herramientas y materiales de construcción"},
        {"user": users[1], "name": "Alimentos", "description": "Productos alimenticios no perecederos"},
        {"user": users[1], "name": "Oficina", "description": "Insumos y papelería de oficina"},
    ]
    categories = []
    for data in categories_data:
        category = Category(
            user_id=data["user"].id, name=data["name"], description=data["description"]
        )
        session.add(category)
        categories.append(category)
    session.commit()
    for category in categories:
        session.refresh(category)
    return categories


def create_products(session: Session, categories: list[Category]) -> list[Product]:
    # (categoría, nombre, sku, precio, min_stock)
    products_data = [
        (categories[0], "Arduino Uno R3", "ELEC-001", Decimal("18.50"), 5),
        (categories[0], "Resistencias 1k (pack 100)", "ELEC-002", Decimal("3.20"), 10),
        (categories[0], "Protoboard 830 puntos", "ELEC-003", Decimal("6.75"), 8),
        (categories[0], "Multímetro digital", "ELEC-004", Decimal("22.00"), 3),
        (categories[0], "Cable USB-C 1m", "ELEC-005", Decimal("4.90"), 15),
        (categories[1], "Martillo de acero 16oz", "FERR-001", Decimal("12.30"), 4),
        (categories[1], "Taladro inalámbrico", "FERR-002", Decimal("85.00"), 2),
        (categories[1], "Tornillos autorroscantes (caja)", "FERR-003", Decimal("5.60"), 20),
        (categories[1], "Cinta métrica 5m", "FERR-004", Decimal("7.15"), 6),
        (categories[2], "Arroz 1kg", "ALIM-001", Decimal("2.10"), 30),
        (categories[2], "Aceite vegetal 1L", "ALIM-002", Decimal("3.45"), 20),
        (categories[2], "Café molido 500g", "ALIM-003", Decimal("6.80"), 15),
        (categories[2], "Azúcar 1kg", "ALIM-004", Decimal("1.95"), 25),
        (categories[3], "Resma papel A4", "OFIC-001", Decimal("4.50"), 10),
        (categories[3], "Caja de lapiceros (12u)", "OFIC-002", Decimal("3.30"), 12),
        (categories[3], "Carpetas archivadoras", "OFIC-003", Decimal("2.75"), 15),
    ]

    products = []
    for category, name, sku, price, min_stock in products_data:
        product = Product(
            user_id=category.user_id,
            category_id=category.id,
            name=name,
            sku=sku,
            description=f"{name} — producto de ejemplo",
            quantity=0,
            price=price,
            min_stock=min_stock,
            location=f"Estante {random.choice('ABCD')}-{random.randint(1, 9)}",
            status=ProductStatus.active,
            image_url=None,
        )
        session.add(product)
        products.append(product)
    session.commit()
    for product in products:
        session.refresh(product)
    return products


def create_movements(session: Session, products: list[Product]) -> None:
    movements_created = 0
    now = datetime.now(UTC)

    ##* Primero con el for recorremos cada producto y hacemos un movimiento de tipo in_ osea que le agregamos stock
    for product in products:
        initial_qty = random.randint(10, 40)
        movement = Movement(
            product_id=product.id,
            user_id=product.user_id,
            type=MovementType.in_,
            quantity=initial_qty,
            note="Carga inicial de inventario",
            created_at=now - timedelta(days=random.randint(15, 20)),
        )
        session.add(movement)
        product.quantity += initial_qty
        movements_created += 1

    ##? al hacer commit una de las caracteristicas de SQL model es que detecta que cambiamos el atributo y lo actualiza automaticamente con un update
    session.commit()

    
    while movements_created < 22:
        product = random.choice(products)
        movement_type = random.choice([MovementType.in_, MovementType.out])

        if movement_type == MovementType.out:
            ##? aca decidimos que la maxima cantidad de salida posible es 8, luego validamos que la 
            max_qty = min(product.quantity, 8)
            if max_qty < 1:
                continue  ##? si la cantidad es menor a 1 no podemos hacer movimiento de salida
            quantity = random.randint(1, max_qty)
            product.quantity -= quantity
            note = "Salida por venta"
        else:
            quantity = random.randint(3, 15)
            product.quantity += quantity
            note = "Reposición de stock"


        movement = Movement(
            product_id=product.id,
            user_id=product.user_id,
            type=movement_type,
            quantity=quantity,
            note=note,
            created_at=now - timedelta(days=random.randint(0, 14)),
        )
        session.add(movement)
        movements_created += 1

    ##! Aca forzamos que alguns productso queden con stock bajo para poder probar las alertas
    for product in random.sample(products, 3): ##* primero elie 3 productos al azar (random)
        if product.quantity > product.min_stock:
            excess = product.quantity - product.min_stock + random.randint(0, 2) ##! aca calculamos cuanto hay que restarlo para dejarlo en modo alerta, y le sumamos 
            ##! un radiante de entre 0 y 2 con eso nos aseguramos que quede en el limite o un porquito por debajo osea en alerta 
            excess = min(excess, product.quantity)
            if excess > 0: ##* aca creamos esta validacion para asegurarnos de no tener stock negativo, 
                movement = Movement(
                    product_id=product.id,
                    user_id=product.user_id,
                    type=MovementType.out,
                    quantity=excess,
                    note="Salida por venta",
                    created_at=now - timedelta(days=1),
                )
                session.add(movement)
                product.quantity -= excess
                movements_created += 1

    session.commit() ##? hacemos el commit, y un print para ver en la consola que creamos los movimientos con exito y cuantos fueron
    print(f"  {movements_created} movimientos creados.")


def main() -> None:
    parser = argparse.ArgumentParser(description="Poblar la base de datos con datos de ejemplo.") ##? argparse es la libreria de python para procesar args por consola
    parser.add_argument(
        "--reset", 
        action="store_true", 
        help="Limpia todas las tablas antes de insertar los datos de la seed."
    )
    args = parser.parse_args()

    
    with Session(engine) as session:
        if args.reset:
            print("Bandera --reset detectada. Limpiando base de datos...")
            
            ##! para no romper ninguna regla de integridad por las fk hacemos el borrado en cascada inversa empezando por movimientos
            session.execute(delete(Movement))
            session.execute(delete(Product))
            session.execute(delete(Category))
            session.execute(delete(User))

            session.commit()
            print(" Base de datos limpia.")

        # 3. Comprobación de idempotencia normal
        if already_seeded(session):
            print("La base de datos ya tiene usuarios — seed omitido (idempotente).")
            print("Usa 'python apps/api/scripts/seed.py --reset' si quieres recrear los datos.")
            return

        print("Creando usuarios...")
        users = create_users(session)
        print(f"  {len(users)} usuarios creados.")

        print("Creando categorías...")
        categories = create_categories(session, users)
        print(f"  {len(categories)} categorías creadas.")

        print("Creando productos...")
        products = create_products(session, categories)
        print(f"  {len(products)} productos creados.")

        print("Creando movimientos...")
        create_movements(session, products)

        print("\nSeed completado.")
        print("Usuarios de prueba (password: password123):")
        for user in users:
            print(f"  - {user.email}")



##! este bloque de codigo hace reutilizable los metodos de main
if __name__ == "__main__":
    main()