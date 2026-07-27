#!/bin/sh
set -e

echo "Aplicando migraciones..."
alembic upgrade head

echo "Corriendo seed (idempotente)..."
python -m scripts/seed.py

echo "Arrancando servidor..."
exec uvicorn app.main:app --host 0.0.0.0 --port "$PORT"