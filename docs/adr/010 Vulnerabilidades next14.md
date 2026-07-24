# ADR-010: Next.js 14.x mantenido pese a vulnerabilidades reportadas por npm audit

## Contexto
npm audit reporta vulnerabilidades de severidad alta en next@14.x y sus
dependencias transitivas (postcss, glob vía eslint-config-next). El fix
sugerido (npm audit fix --force) implica saltar a next@16.x, un cambio de
versión mayor no probado

## Decisión
Se mantiene next en la rama 14.x (actualizada al último patch disponible,
14.2.35), sin saltar a la versión mayor 16.

## Alternativas consideradas
- **Actualizar a Next 16 npm audit fix --force: resolvería las
  vulnerabilidades reportadas, pero es un cambio de versión mayor sin probar,
  con riesgo real de romper compatibilidad de App Router/convenciones ya
  usadas, en un momento del proyecto donde no hay margen de tiempo para
  troubleshooting extenso de una migración mayor.

## Consecuencias
- Riesgo aceptado conscientemente: las vulnerabilidades reportadas (DoS,
  SSRF, cache poisoning) requieren mayormente exposición pública en
  producción con configuraciones específicas (Server Actions expuestas,
  rewrites con destino controlado externamente, WebSocket upgrades). Para
  un proyecto que corre en localhost/Docker local sin despliegue público
  durante la prueba técnica, la superficie de explotación real es mínima.
