# Changelog

Todas las decisiones y cambios relevantes de este proyecto se documentan acá.
Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/).

### Added
- Infraestructura: Docker Compose (db, adminer, api) con healthcheck y hot-reload
- Modelos de dominio: User, Category, Product, Movement
- Migraciones iniciales de Alembic, incluyendo ON DELETE CASCADE en
  product.category_id y movement.product_id
- Seguridad: hashing bcrypt + JWT con expiración, testeado (6/6 tests unitarios)
- Auth: POST /auth/register, POST /auth/login, GET /auth/me
- Categorías: CRUD completo (GET/POST/PATCH/DELETE), paginación, búsqueda,
  conteo de productos por categoría
- Productos: CRUD completo, paginación, filtros (category_id, status,
  low_stock, q), SKU único global, GET /products/alerts
- Movimientos: POST/GET /products/id/movements con actualizacion atomica de stock, vlaidacion de stock suficiente en salidas
- Tests: cobertura de endpoints de auth y movimientos, con DB de test
  aislada y transacciones con rollback para aislamiento entre tests
  
### Fixed
- config.py: resolución de rutas para .env corregida para funcionar tanto en
  desarrollo local como dentro de contenedores Docker (antes usaba un índice
  fijo de parents[N] que rompía según la profundidad de carpetas del entorno)
- security.py: referencias a settings en mayúscula corregidas a snake_case
- Incompatibilidad bcrypt/passlib resuelta pineando bcrypt==4.0.1
- Enum MovementType: corregido para persistir 'in'/'out' (no 'in_') vía
  values_callable
- price migrado de Float a Numeric(10,2) para evitar errores de redondeo
- .dockerignore agregado para excluir .venv, __pycache__ y archivos .env
  del contexto de build (reduce tamaño de imagen y evita filtrar secretos)