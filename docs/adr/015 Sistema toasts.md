# ADR-000X: Sistema de notificaciones (toasts) sin librería externa

## Contexto
Las acciones de crear/editar/eliminar no daban feedback visual más
allá del refresco de la UI.

## Decisión
Se construyó un `ToastProvider` propio con Context API de React, en
vez de instalar `sonner` o similar, dado el tiempo disponible y para
mantener control total del diseño. Se conecta a los callbacks
`onSuccess`/`onError` ya existentes en las mutaciones de React Query.

## Consecuencias
- (+) Cero dependencias nuevas.
- (+) Mensajes de error usan el detalle real que manda la API.
- (-) Menos features que una librería madura (sin cola configurable,
  sin posiciones múltiples).