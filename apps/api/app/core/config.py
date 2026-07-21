from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


##* este codigo nos ayuda con la finalidad de que no se rompa por culpa de las rutas en local o en el servidor, de esta forma busca el archivo .env donde este hacia arriba 

_THIS_FILE = Path(__file__).resolve()

##* la funcion recibe el nombre que debe ser un string y sera el archivo que estamos buscando, recibe start que es la ruta desde donde empezamos a buscar y maxlevels que es el numero de niveles hacia arriba que vamos a buscar, y devuelve la ruta del archivo si lo encuentra o none si no lo encuentra
def _find_upwards(filename: str, start: Path, max_levels: int = 6) -> Path | None:
    current = start
    for _ in range(max_levels):
        candidate = current / filename ##? el operador / en path sirve para concatenar rutas no para dividir
        if candidate.exists():
            return candidate
        if current.parent == current:  # llegamos a la raíz del filesystem
            break
        current = current.parent
    return None


_ROOT_ENV_FILE = _find_upwards(".env", _THIS_FILE.parent)
_LOCAL_OVERRIDE_ENV_FILE = _find_upwards(".env.local", _THIS_FILE.parent)


class Settings(BaseSettings):
    database_url: str

    jwt_secret: str
    jwt_algorithm: str = "HS256"
    jwt_expires_in: int 

    environment: str = "development"
    log_level: str = "INFO"
    api_port: int


    model_config = SettingsConfigDict(
            env_file=tuple(
                p for p in (_ROOT_ENV_FILE, _LOCAL_OVERRIDE_ENV_FILE) if p is not None
            ),
            extra="ignore",
        )


##* lru cache es un decorador que se utilzia para guardar el cache de la funcion get_settings para que se reutilice cada vez que se llame 
@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()