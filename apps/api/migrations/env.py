
##* Este archivo es el entorno de migración de Alembic, que se utiliza para ejecutar las migraciones de la base de datos.


##* creamos un archivo de configuración de Alembic para que pueda leer la url de la base de datos desde settings.database_url, y así tener una sola fuente de verdad para la conexión a la base de datos.
##* y para cargar los modelos de la base de datos para que Alembic pueda generar las migraciones automáticamente. con --autogenerate

from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config, pool
from sqlmodel import SQLModel

from app.core.config import settings

##* importar los modelos es obligatorio para que Alembic pueda detectar los cambios en la base de datos y generar las migraciones automáticamente. con --autogenerate
##* pero estos modelos no se utilizan en este archivo, por lo que se importa con noqa: F401 para evitar el error de "imported but unused"
from app.models import category, movement, product, user  # noqa: F401  

config = context.config
##* ------ Inyectamos la url de la base de datos desde settings.database_url para que Alembic pueda usarla, y así tener una sola fuente de verdad para la conexión a la base de datos.
config.set_main_option("sqlalchemy.url", settings.database_url)


##* configura la salida de logs de alembic para que muestre mensajes tipo INFO, WARNING ETC que definimos en alembic.ini
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

##* SQLModel.metadata es un objeto que contiene la información de todos los modelos y tablas que importamos en este archivo, alembic usará esta información para generar las migraciones automáticamente. con --autogenerate
target_metadata = SQLModel.metadata



##* Alembic esta preparado para trabajar de dos maneras, offline y online
##* que hace?, este modo offline no se conecta a la base de datos 
##* y genera un script de migración que se puede ejecutar manualmente
def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url") 
    context.configure(
        url=url, target_metadata=target_metadata, literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


##* que hace de manera online?, este modo online se conecta a la base de datos y ejecuta las migraciones directamente.
def run_migrations_online() -> None:
    connectable = engine_from_config(  ##* engine_from_config es una función de SQLAlchemy que crea un motor de base de datos que sirve para conectarse a la base de datos y ejecutar las migraciones
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.", poolclass=pool.NullPool,  ##* en esta linea prefix="sqlalchemy." le dice a alembic que busque las configuraciones que empiecen con sqlalchemy
    )                                                   ##* y poolclass=pool.NullPool le dice a alembic que no use un pool de conexiones, sino que cree una nueva conexión para cada migración, esto es importante para que no queden posibles canales abiertos consumiendo memoria en el servidor
    with connectable.connect() as connection: ##* usando el motor que creamos arriba, abre una puerta de conexion real a la db, el "with" garantiza que, pase lo que pase (incluso si da un error intermedio) la puerta de conexion se cierra automaticamente al terminar para evitar fugas de memoria y la conexion se bautiza as connection 
        context.configure(connection=connection, target_metadata=target_metadata)  
        with context.begin_transaction():
            context.run_migrations() ##* esto es lo ultimo, alembic compara los modelos mios con las tablas reales de la db mediante la conexion abiereta y aplica los cambios inmediatamente


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()