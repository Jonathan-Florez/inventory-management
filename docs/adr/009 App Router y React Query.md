# ADR-009: Next.js App Router + React Query para el frontend

## Contexto
El PDF deja explícitamente abierta la elección entre App Router y Pages
Router, y entre React Query/Server Actions u otra gestión de estado,
pidiendo justificación. El backend es FastAPI, un servicio HTTP externo
completamente separado de Next.js (no hay API routes de Next.js de por medio).

## Decisión
- App Router (no Pages Router) para el enrutamiento.
- React Query (TanStack Query) (no Server Actions) para fetching,
  caché e invalidación de datos contra la API de FastAPI.

## Alternativas consideradas
- Pages Router: descartado — está en modo mantenimiento, sin features
  nuevas. Protección de rutas y layouts compartidos requieren patrones
  manuales (HOCs) que App Router resuelve nativamente con middleware.ts
  y layouts anidados.
- Server Actions puros: descartado como mecanismo principal de datos.
  Server Actions están pensados para cuando Next.js es dueño de la capa
  de datos (mutaciones locales o proxy fino a un backend propio). Acá el
  backend es un servicio FastAPI externo con su propio ciclo de vida —
  React Query maneja caché, loading, error e invalidación de forma
  declarativa contra esa API externa, sin reimplementar esa lógica a mano.

## Consecuencias
- Los listados paginados/filtrados (categorías, productos, movimientos)
  usan queryKey dinámico basado en los parámetros de filtro — patrón
  directo de React Query para este caso de uso.
- Mutaciones (crear/editar/borrar, registrar movimientos) usan useMutation
    invalidateQueries para mantener la UI sincronizada tras cada cambio.