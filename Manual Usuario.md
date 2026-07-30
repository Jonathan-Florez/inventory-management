# Manual de Usuario — Sistema de Gestión de Inventario Personal

Esta guía explica cómo usar la aplicación desde cero, sin necesidad de
conocimientos técnicos. Si buscas información sobre instalación o
arquitectura del proyecto, revisa el `README.md` en la raíz del repositorio.

## 1. Acceso al sistema

### 1.1 Crear una cuenta

1. Entra a la aplicación: **https://inventory-management-8rbc.onrender.com/**
2. En la pantalla de bienvenida, elige **"Registrarse"**.
3. Completa tu nombre, correo y una contraseña.
4. Al confirmar, quedarás automáticamente autenticado y verás el Dashboard.


### 1.2 Iniciar sesión

Si ya tienes una cuenta, ingresa tu correo y contraseña en la pantalla de
**"Iniciar sesión"**. La sesión queda guardada en tu navegador, así que no
necesitas volver a loguearte cada vez que abres la app.

## 2. El Dashboard

Al entrar, lo primero que ves es el Dashboard, con un resumen general:

- **Total de productos** y **total de categorías** registradas.
- **Productos con stock bajo** (alertas).
- **Valor total del inventario** (suma de cantidad × precio de todos tus productos).
- **Gráfico de movimientos** de los últimos 7 días — muestra, día por día,
  cuánto stock entró (verde) y cuánto salió (rojo). Al pasar el mouse sobre
  el gráfico puedes ver el detalle exacto de cada día.
- **Últimos 5 movimientos** registrados en el sistema.



## 3. Organizar tu inventario

### 3.1 Crear categorías

Antes de cargar productos, necesitas al menos una categoría (por ejemplo:
"Electrónica", "Oficina", "Limpieza").

1. Ve a la sección **"Categorías"** desde el menú.
2. Haz clic en **"Nueva categoría"**.
3. Escribe un nombre y, si quieres, una descripción.
4. Guarda — la categoría aparece en la lista, con la cantidad de productos
   que tiene dentro.

Puedes editar o eliminar una categoría en cualquier momento desde la misma
lista.

### 3.2 Crear productos

1. Ve a la sección **"Productos"**.
2. Haz clic en **"Nuevo producto"**.
3. Completa los datos:
   - **Nombre** y **SKU/código** (el SKU debe ser único, no puede repetirse).
   - **Cantidad en stock** y **precio unitario**.
   - **Stock mínimo** — cuando el stock caiga a este número o menos, el
     producto aparecerá marcado con una alerta.
   - **Ubicación** (opcional, por ejemplo "Estante A-3").
   - **Estado**: activo, inactivo o descontinuado.
4. Guarda — el producto queda listado, agrupado en su categoría.

### 3.3 Buscar y filtrar productos

En la parte superior de la tabla de productos puedes:

- Buscar por **nombre o SKU**.
- Filtrar por **categoría**, **estado**, o mostrar solo los que tienen
  **stock bajo**.

## 4. Registrar movimientos de stock

Cada vez que entra o sale mercadería, se registra como un **movimiento**:

1. Entra al detalle de un producto (haz clic sobre él en la tabla).
2. En el formulario de movimiento, elige el tipo:
   - **Entrada / Stock (+)** — cuando recibes mercadería nueva.
   - **Salida / Despacho (-)** — cuando vendes o despachas stock.
3. Escribe la cantidad y, si quieres, una nota (ej. "Orden de compra #1024").
4. Haz clic en **"Registrar Flujo de Stock"**.

El stock del producto se actualiza automáticamente, y el movimiento queda
guardado en el historial de ese producto (con paginación, si tiene muchos).

> Si intentas registrar una salida mayor a la cantidad disponible, el
> sistema no lo permite y te avisa.

## 5. Alertas de stock bajo

Un producto entra en "alerta" cuando su cantidad actual es igual o menor a
su stock mínimo configurado. Puedes verlos de dos formas:

- Desde el Dashboard, en la tarjeta de "Productos con stock bajo".
- Desde la tabla de Productos, activando el filtro de stock bajo.

## 6. Buscador rápido (`Cmd/Ctrl + K`)

En cualquier pantalla de la aplicación puedes abrir un buscador rápido:

- **Atajo de teclado**: `Cmd + K` (Mac) o `Ctrl + K` (Windows/Linux).
- También puedes hacer clic en el botón **"Buscar"** del encabezado.

Desde ahí puedes:
- Escribir el nombre o SKU de un producto y presionar `Enter` para ir
  directo a su detalle.
- Navegar con las flechas del teclado (`↑` `↓`) entre los resultados.
- Ir directo al **Dashboard**, **Categorías** o **Productos** escribiendo
  esas palabras.
- Cerrar el buscador con `Esc`.


## 7. Exportar el inventario a Excel

Si necesitas compartir tu inventario con alguien fuera del sistema, o
analizarlo en una hoja de cálculo:

1. Ve a la sección **"Productos"**.
2. Haz clic en **"Exportar a Excel"**.
3. Se descarga un archivo `inventario.xlsx` con todos tus productos,
   incluyendo categoría, cantidad, precio, valor total y estado.
   Los productos con stock bajo aparecen resaltados en rojo claro.

## 8. Notificaciones del sistema

Cada vez que creas, editas o eliminas una categoría, un producto, o
registras un movimiento, aparece una notificación temporal en la esquina
inferior derecha de la pantalla:

- **Verde** — la acción se completó correctamente.
- **Roja** — algo falló (por ejemplo, un SKU repetido), con un mensaje que
  explica el motivo.

Las notificaciones desaparecen solas después de unos segundos, o puedes
cerrarlas manualmente con la "X".

## 9. Cerrar sesión

Desde el menú de tu perfil, en la esquina superior del encabezado, puedes
cerrar sesión en cualquier momento. Al volver a entrar, deberás iniciar
sesión de nuevo.

---

¿Encontraste un problema o algo no descrito en esta guía? Revisa el
`README.md` para detalles técnicos, o el `CHANGELOG.md` para ver el
historial de cambios del proyecto.