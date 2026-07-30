# ADR-000X: Command palette (⌘K) sin librería externa

## Contexto
Navegar por clicks en un inventario con muchos productos es lento.
Herramientas como Linear o VS Code resuelven esto con un buscador
global activable por teclado.

## Decisión
Se construyó con React nativo (`useState`, `useEffect`, `useMemo`),
sin librerías de terceros. Reutiliza el hook `useProducts` ya
existente (no se duplicó lógica de fetching), con debounce de 250ms
para no saturar la API en cada tecla.

## Consecuencias
- (+) Cero dependencias nuevas.
- (+) Reutiliza código y caché de React Query ya probados.
- (-) Sin virtualización de resultados; aceptable para el volumen
  de productos actual.