# Sistema de Gestión de Inventario Personal

## Resumen del proyecto y arquitectura

Monorepo con backend en FastAPI (Python) y frontend en Next.js (React), orquestados
vía Docker Compose junto con PostgreSQL. Permite gestionar un inventario personal:
categorías, productos, movimientos de stock (entradas/salidas) y alertas de stock bajo.

├── apps/
│ ├── api/ # Backend FastAPI
│ └── web/ # Frontend Next.js (en progreso)
├── infra/
│ └── docker/ # docker-compose.yml
├── docs/
│ └── adr/ # Decisiones de arquitectura documentadas
├── CHANGELOG.md
└── README.md

Backend: FastAPI + SQLModel (ORM) + Alembic (migraciones) + PostgreSQL.
Arquitectura en capas: routers/ (HTTP) → services/ (lógica de negocio) →
repositories/ (acceso a datos) → models/ (persistencia).

## Requisitos previos

- Docker y Docker Compose
- Python 3.11+ (solo si querés correr el backend fuera de Docker)
- Node.js LTS y pnpm (para el frontend — sección pendiente)

## Variables de entorno

Copiá .env.example a .env en la raíz del repo y completá los valores:

bash
cp .env.example .env


Revisa .env.example para el detalle de cada variable.

## Guía de instalación y ejecución

### Con Docker Compose (recomendado)

bash
docker compose -f infra/docker/compose.yml up --build


Servicios:
- API: http://localhost:8000/docs
- Adminer (administración visual de la DB): http://localhost:8080
- Postgres: localhost:5432

### Backend, local sin Docker

bash
cd apps/api
python -m venv .venv && source .venv/bin/activate  # En Windows: .venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000


## Cómo correr pruebas

bash
cd apps/api
pytest -v


## Decisiones técnicas y trade-offs

Ver docs/adr/ para el detalle de cada decisión de arquitectura, incluyendo:
- App Router vs Pages Router (frontend)
- React Query vs Server Actions (frontend)
- Organización de schemas por feature, no por entidad
- SKU único a nivel global (no por usuario)
- ON DELETE CASCADE para categoría → productos → movimientos
- bcrypt pineado a 4.0.1 por incompatibilidad con passlib 1.7.4


Este readme lo actualizo en cada feature acabado, ultima actualizacion en (Productos)