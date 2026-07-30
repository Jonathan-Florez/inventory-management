# ADR-000X: Gráfico de movimientos en el dashboard


## Contexto
El dashboard mostraba solo totales estáticos, sin ninguna vista de
tendencia en el tiempo. La prueba sugiere un gráfico de movimientos
de los últimos 7 días como punto extra.

## Decisión
Se agregó `MovementRepository.get_daily_totals()`, que agrupa
movimientos por día y tipo usando `func.date()` y `func.sum()` de
SQLAlchemy — la agregación la hace Postgres, no Python. El servicio
rellena con ceros los días sin movimientos (zero-fill) antes de
exponerlos en `DashboardSummary.movements_timeline`, para que el
gráfico no tenga huecos. En el frontend se usó `recharts` (nueva
dependencia) para un `AreaChart`.

## Consecuencias
- (+) La serie siempre tiene 7 puntos consistentes, sin lógica de
  relleno duplicada en el cliente.
- (+) No se creó un endpoint nuevo; se extendió `/dashboard/summary`
  para evitar una llamada HTTP adicional.
- (-) Nueva dependencia de frontend (`recharts`).