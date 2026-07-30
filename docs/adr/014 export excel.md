# ADR-000X: Exportar inventario a Excel en vez de CSV


## Contexto
La prueba sugiere exportar el inventario como punto extra. Un CSV
es texto plano: pierde formato, tipos de dato y no distingue
visualmente los productos con stock bajo.

## Decisión
Se usó `openpyxl` para generar un `.xlsx` real en memoria (`BytesIO`,
sin tocar disco), con encabezado con color, formato de moneda, y
resaltado de las filas con stock bajo. Se expone vía
`GET /products/export/xlsx` con `StreamingResponse`.

## Consecuencias
- (+) Archivo con formato profesional, listo para abrir en Excel.
- (+) No se persiste nada a disco en el servidor.
- (-) Nueva dependencia de backend (`openpyxl`).