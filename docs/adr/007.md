# ADR-007: Resolución dinámica de rutas para .env

## Contexto
config.py originalmente usaba un índice fijo Path(__file__).parents[N]
para ubicar el archivo .env en la raíz del repo. Este índice es distinto
según la profundidad de carpetas del entorno: funciona en desarrollo local
(ruta completa del repo) pero falla dentro de un contenedor Docker donde
config.py vive en /app/app/core/config.py, con muchos menos niveles
hasta la raíz del filesystem del contenedor

## Decisión
Se reemplazó el índice fijo por una función que busca .env/.env.local
subiendo directorio por directorio desde la ubicación de config.py, hasta
un máximo de niveles, devolviendo None si no encuentra nada (en cuyo caso
Pydantic usa las variables de entorno del proceso, inyectadas por Docker
Compose vía env_file:).

## Alternativas consideradas
- Mantener un índice fijo distinto para cada entorno: requeriría
  detectar en qué entorno se está corriendo y mantener dos rutas
  hardcodeadas, frágil ante cualquier cambio futuro de estructura.

## Consecuencias
- Un solo `config.py` funciona sin cambios tanto en desarrollo local como
  dentro de Docker, sin necesidad de lógica condicional por entorno.