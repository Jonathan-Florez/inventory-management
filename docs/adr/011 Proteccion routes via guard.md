# ADR-011: Protección de rutas vía guard client-side en vez de middleware

## Contexto
Next.js App Router permite proteger rutas centralizadamente con
middleware.ts, que corre en el Edge Runtime del servidor antes de
renderizar cualquier página. Es el enfoque recomendado por defecto.

## Decisión
Se protege (protected)/ con un layout client-side (ProtectedLayout)
que usa AuthContext y redirige con useRouter, en vez de middleware.ts.

## Alternativas descartadas
- middleware.ts real**: descartado porque el Edge Runtime corre en el
  servidor, donde `localStorage` no existe. El middleware no puede leer
  el token guardado ahí decisión ya tomada en ADR de localStorage
  sobre cookie httpOnly, por tiempo disponible.


## Consecuencias
- Hay un parpadeo mínimo evitado explícitamente con un estado isLoading
  (se muestra "Cargando..." en vez de contenido protegido o de un flash
  de la página antes del redirect).
- La protección no es "gratis a nivel de red": una respuesta HTML/JS de
  una ruta protegida SÍ llega al navegador antes de redirigir (a
  diferencia de un middleware real, que corta la respuesta antes de que
  el cliente reciba nada). Para este proyecto (datos de inventario
  personal, no información sensible de terceros) es un trade-off
  aceptable.