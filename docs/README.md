# Sistema de Gestión de Inventario Personal

Prueba técnica Aprendiz/Junior Full-Stack. Monorepo con backend en FastAPI,
frontend en Next.js y PostgreSQL como base de datos, orquestados con Docker
Compose. Permite gestionar un inventario personal: categorías, productos,
movimientos de stock (entradas/salidas), alertas de stock bajo y un dashboard
con estadísticas agregadas.

## Arquitectura

.
├── apps/
│ ├── api/ # Backend FastAPI
│ └── web/ # Frontend Next.js
├── infra/
│ └── docker/ # docker-compose.yml
├── docs/
│ └── adr/ # Decisiones de arquitectura documentadas
├── .env.example
├── CHANGELOG.md
└── README.md

**Backend** (`apps/api`): FastAPI + SQLModel (ORM) + Alembic (migraciones) +
PostgreSQL. Arquitectura en capas: `routers/` (HTTP) → `services/` (lógica de
negocio) → `repositories/` (acceso a datos) → `models/` (persistencia).
Autenticación vía JWT (header `Authorization: Bearer`, sin refresh token).

**Frontend** (`apps/web`): Next.js 14 (App Router) + TypeScript + Tailwind +
React Query. Estructura por features: `src/lib/` (cliente HTTP y tipos
compartidos), `src/features/<dominio>/` (hooks y contexto por dominio),
`src/app/` (rutas), agrupadas en `(auth)/` (login/registro, público) y
`(protected)/` (requiere sesión).

## Estado del proyecto

- ✅ Backend: completo (Auth, Categorías, Productos, Movimientos, Dashboard,
  seed, tests).
- 🚧 Frontend: en progreso — ver roadmap más abajo.

## Requisitos previos

- Docker y Docker Compose
- Python 3.11+ (solo si corrés el backend fuera de Docker)
- Node.js LTS y npm (para el frontend)

## Variables de entorno

Copiá `.env.example` a `.env` en la raíz del repo:

```bash
cp .env.example .env
```

| Variable | Descripción |
|---|---|
| `API_PORT` | Puerto donde escucha el backend (default `8000`) |
| `DATABASE_URL` | Cadena de conexión a PostgreSQL |
| `JWT_SECRET` | Secreto para firmar tokens JWT — **generar uno propio, nunca dejar vacío** |
| `JWT_ALGORITHM` | Algoritmo de firma del JWT (`HS256`) |
| `JWT_EXPIRES_IN` | Expiración del token en segundos (default `3600`) |
| `ENVIRONMENT` | `development` / `production` |
| `LOG_LEVEL` | Nivel de logging del backend (`INFO`, `ERROR`, etc.) |
| `WEB_PORT` | Puerto donde corre el frontend (default `3000`) |
| `NEXT_PUBLIC_API_BASE_URL` | URL del backend que usa el **navegador** (`http://localhost:8000`) |
| `API_BASE_URL` | URL del backend para comunicación **entre contenedores** Docker (`http://api:8000`) — no se usa todavía, reservada para cuando el frontend se dockerice (ver roadmap) |

## Guía de instalación y ejecución

### Backend + base de datos (Docker Compose)

```bash
docker compose -f infra/docker/compose.yml up --build
```

Servicios:
- API: http://localhost:8000/docs
- Adminer (administración visual de la DB): http://localhost:8080
- Postgres: `localhost:5432`

### Backend, local sin Docker

```bash
cd apps/api
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

### Frontend

El frontend **todavía no está dockerizado** (pendiente, ver roadmap) — corre
en local, contra el backend levantado por cualquiera de los dos métodos de
arriba:

```bash
cd apps/web
npm install
npm run dev
```

Abrí http://localhost:3000. Necesita `NEXT_PUBLIC_API_BASE_URL` disponible
(ya viene en `.env.example`; Next.js la toma automáticamente si copiaste el
`.env` a la raíz del repo, o creá `apps/web/.env.local` con la misma variable
si corrés el frontend desde una carpeta distinta).

### Datos de ejemplo (seed)

```bash
python apps/api/scripts/seed.py
```

## Cómo correr pruebas

```bash
cd apps/api
pytest -v
```

Frontend: pendiente (ver roadmap, Fase K).

## Decisiones técnicas y trade-offs

Ver `docs/adr/` para el detalle completo de cada decisión. Resumen:

- Inventario aislado por usuario (todas las queries filtran por `user_id`)
- Organización de schemas por feature, no por entidad
- SKU único a nivel global, no por usuario
- `price` como `Numeric`, no `Float`
- `ON DELETE CASCADE` en categoría → productos → movimientos
- bcrypt pineado a `4.0.1` por incompatibilidad con `passlib`
- `SELECT FOR UPDATE` en movimientos, para actualización atómica de stock
- App Router + React Query en el frontend
- Vulnerabilidades conocidas de `next@14.x` aceptadas conscientemente (sin
  salto a v16 por tiempo)
- Protección de rutas en el frontend vía guard client-side, no `middleware.ts`
  (el JWT vive en `localStorage`, inaccesible desde el Edge Runtime)

## Roadmap

- [x] Backend: Auth, Categorías, Productos, Movimientos, Dashboard, seed, tests
- [x] Frontend: scaffold real de Next.js (TypeScript, Tailwind, App Router)
- [x] Frontend: autenticación (registro, login, sesión persistente, rutas
      protegidas)
- [ ] Frontend: CRUD de Categorías (UI)
- [ ] Frontend: CRUD de Productos (UI), con filtros combinados
- [ ] Frontend: Movimientos e historial por producto
- [ ] Frontend: Dashboard con estadísticas
- [ ] Frontend: tests (mínimo 1–2, componente + formulario)
- [ ] CI (GitHub Actions): lint + test en cada PR
- [ ] Dockerfile de `apps/web` + servicio `web` en `compose.yml`
- [ ] Revisión final: `docker compose up --build` desde cero en carpeta limpia

*Última actualización: cierre de autenticación en el frontend