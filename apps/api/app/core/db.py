
##* este archivo se encarga de crear la conexion a la base de datos y de crear una sesion para poder interactuar con ella

from collections.abc import Generator

from sqlmodel import Session, create_engine

from app.core.config import settings

##* aca utilizamos pool_pre_ping=True para que si la conexion se cae, se vuelva a conectar automaticamente
engine = create_engine(settings.database_url, echo=False, pool_pre_ping=True)

##* esta funcion se utiliza con session para asegurar que se cierre correctamente despues de usarla
def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session