from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


_REPO_ROOT = Path(__file__).resolve().parents[3]
_ROOT_ENV_FILE = _REPO_ROOT / ".env"
_LOCAL_OVERRIDE_ENV_FILE = Path(__file__).resolve().parents[2] / ".env.local"


class Settings(BaseSettings):
    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/inventory"

    jwt_secret: str = "change_me"
    jwt_algorithm: str = "HS256"
    jwt_expires_in: int = 3600  # segundos

    environment: str = "development"
    log_level: str = "INFO"
    api_port: int = 8000

    # Se cargan en orden: primero el .env de la raíz (compartido, usado
    # también por Docker Compose), y LUEGO .env.local de apps/api si
    # existe (no se commitea) — lo que esté en el segundo sobreescribe
    # al primero. Esto permite correr el backend directo en tu máquina
    # (sin Docker) sobreescribiendo solo DATABASE_URL a localhost, sin
    # tocar el .env compartido que usa "db" como host.
    model_config = SettingsConfigDict(
        env_file=(_ROOT_ENV_FILE, _LOCAL_OVERRIDE_ENV_FILE),
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    """Cachea la instancia para no releer el entorno en cada request."""
    return Settings()


settings = get_settings()