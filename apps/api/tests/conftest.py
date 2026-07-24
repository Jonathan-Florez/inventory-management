import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine

from app.core.db import get_session
from app.main import app

TEST_DATABASE_URL = "postgresql+psycopg://postgres:postgres@localhost:5432/inventory_test"

test_engine = create_engine(TEST_DATABASE_URL)


@pytest.fixture(scope="session", autouse=True)
def setup_test_database():
    """Crea todas las tablas una vez por sesión de tests, y las borra al final."""
    SQLModel.metadata.create_all(test_engine)
    yield
    SQLModel.metadata.drop_all(test_engine)


@pytest.fixture
def session():
    """Cada test corre dentro de una transacción que se revierte al final,
    así ningún test deja datos que afecten a los siguientes (aislamiento)."""
    connection = test_engine.connect()
    transaction = connection.begin()
    db_session = Session(bind=connection)
    yield db_session
    db_session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture
def client(session):
    """TestClient con get_session sobreescrito para usar la sesión de test
    (transaccional) en vez de conectarse a la base de datos real."""

    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()