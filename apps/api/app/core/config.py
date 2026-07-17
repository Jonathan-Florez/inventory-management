from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/inventory"

    jwt_secret: str = "change_me"
    jwt_algorithm: str = "HS256"
    jwt_expires_in: int = 3600  # segundos

    environment: str = "development"
    log_level: str = "INFO"
    api_port: int = 8000

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    """Cachea la instancia para no releer el entorno en cada request."""
    return Settings()


settings = get_settings()