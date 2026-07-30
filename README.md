# Sistema de Gestión de Inventario Personal

Prueba técnica Aprendiz/Junior Full-Stack. Monorepo con backend en FastAPI,
frontend en Next.js y PostgreSQL como base de datos, orquestados con Docker
Compose. Permite gestionar un inventario personal: categorías, productos,
movimientos de stock (entradas/salidas), alertas de stock bajo y un dashboard
con estadísticas agregadas.

## Arquitectura

```
.
├── apps/
│   ├── api/          # Backend FastAPI
│   └── web/          # Frontend Next.js
├── infra/
│   └── docker/       # docker-compose.yml
├── docs/
│   └── adr/           # Decisiones de arquitectura documentadas
├── .env.example
├── CHANGELOG.md
└── README.md
```

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
  seed, tests, exportación a Excel).
- ✅ Frontend: completo (CRUD de categorías/productos, movimientos, dashboard
  con gráfico, command palette, notificaciones, tests, Docker, CI).

## Funcionalidades destacadas

Además de los requisitos base de la prueba, el proyecto incluye:

- **Gráfico de movimientos** — serie de los últimos 7 días (entradas vs.
  salidas) en el dashboard, con agregación diaria hecha en SQL.
- **Command palette (`Cmd/Ctrl + K`)** — búsqueda rápida de productos por
  nombre/SKU y navegación, sin salir del teclado.
- **Exportación a Excel** — descarga del inventario como `.xlsx` con formato
  (moneda, resaltado de productos con stock bajo).
- **Notificaciones (toasts)** — feedback visual al crear, editar o eliminar
  categorías, productos y movimientos.

El detalle técnico y el porqué de cada decisión está documentado en
`docs/adr/` (ver sección de Decisiones técnicas más abajo).

## Demo desplegada

La aplicación está desplegada y accesible públicamente en:

**https://inventory-management-8rbc.onrender.com/**

Usuarios de prueba (password: `password123`):
- `ana@example.com`
- `luis@example.com`

Las instrucciones de instalación local de más abajo son para quien quiera
correr el proyecto en su propia máquina (por ejemplo, para revisar el
código, correr las pruebas o levantarlo con Docker).

## Requisitos previos

- Docker y Docker Compose
- Python 3.11+ (solo si corrés el backend fuera de Docker)
- Node.js LTS y npm (para el frontend, o si corrés el frontend fuera de Docker)
- Git

## Cómo clonar el proyecto

```bash
git clone <URL_DEL_REPOSITORIO>
cd <nombre-de-la-carpeta-del-repo>
```

Reemplazá `<URL_DEL_REPOSITORIO>` por la URL real de tu repo (HTTPS o SSH).

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
| `API_BASE_URL` | URL del backend para comunicación **entre contenedores** Docker (`http://api:8000`) |

Ninguna de las funcionalidades agregadas (gráfico, command palette, export a
Excel, toasts) requiere una variable de entorno nueva.

## Guía de instalación y ejecución (desarrollo local)

### Todo el sistema con Docker Compose (recomendado)

Levanta `web`, `api`, `db` y `adminer` de una sola vez:

```bash
docker compose -f infra/docker/compose.yml up --build
```

Servicios:
- Web: http://localhost:3000
- API: http://localhost:8000/docs
- Adminer (administración visual de la DB): http://localhost:8080
- Postgres: `localhost:5432`

Las migraciones (`alembic upgrade head`) y el seed corren automáticamente al
levantar el contenedor de `api` — no hace falta ningún paso manual.

### Backend, local sin Docker

```bash
cd apps/api
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

### Frontend, local sin Docker (desarrollo con hot-reload)

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

Si corrés el backend sin Docker (el contenedor ya lo hace solo):

```bash
cd apps/api
python -m scripts.seed
```

Usuarios de prueba creados por el seed (password: `password123`):
- `ana@example.com`
- `luis@example.com`

## Cómo correr las pruebas

### Backend

```bash
cd apps/api
pytest -v
```

Requiere una base de datos Postgres accesible (local o vía Docker)

### Frontend

```bash
cd apps/web
npm run test
```

Corre la suite con Vitest + Testing Library (componentes y formularios
clave). No necesita el backend levantado — los tests mockean las
dependencias de red.

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
- Gráfico de movimientos: agregación diaria hecha en SQL (`func.date` +
  `func.sum`), con zero-fill en el servicio — ver `docs/adr/`
- Command palette y sistema de toasts construidos sin librerías externas,
  por control de diseño y para no sumar dependencias de última hora — ver
  `docs/adr/`
- Exportación a Excel (no CSV) generada en memoria con `openpyxl` — ver
  `docs/adr/`

## Roadmap

- [x] Backend: Auth, Categorías, Productos, Movimientos, Dashboard, seed, tests
- [x] Frontend: scaffold real de Next.js (TypeScript, Tailwind, App Router)
- [x] Frontend: autenticación (registro, login, sesión persistente, rutas protegidas)
- [x] Frontend: CRUD de Categorías (UI)
- [x] Frontend: CRUD de Productos (UI), con filtros combinados
- [x] Frontend: Movimientos e historial por producto
- [x] Frontend: Dashboard con estadísticas
- [x] Frontend: tests (mínimo 1–2, componente + formulario)
- [x] CI (GitHub Actions): lint + test en cada PR
- [x] Dockerfile de `apps/web` + servicio `web` en `compose.yml`
- [x] Revisión final: `docker compose up --build` desde cero en carpeta limpia

## Puntos extra implementados

- [x] Gráfico de movimientos (últimos 7 días) en el dashboard
- [x] Command palette (`Cmd/Ctrl + K`) para búsqueda y navegación rápida
- [x] Exportación de inventario a Excel
- [x] Sistema de notificaciones (toasts) en las acciones principales

---
última actualización: gráfico de movimientos, command palette, exportación a
Excel y sistema de toasts agregados, con tests y CI verdes.