# Design

## Context

Ver `proposal.md` - Why. Estado actual relevante:

- App Vite + React 19 + TypeScript, un solo componente `src/App.tsx` que renderiza el contenido de demo del template.
- Sin router, sin state manager, sin librerías de UI, sin tests configurados. `npm run lint` (oxlint) y `npm run build` (`tsc -b && vite build`) son las verificaciones disponibles.
- Estilos con CSS plano en `src/index.css` (tokens `--accent`, `--bg`, `--border`, dark mode vía `prefers-color-scheme`) y `src/App.css` (CSS nesting).
- Assets estáticos servidos desde `public/` (ya existen `icons.svg`, `favicon.svg`).
- Sin specs previas; `openspec/specs/` vacío.

## Goals / Non-Goals

**Goals:**
- Estado del sorteo en un único punto de verdad, con persistencia explícita y tolerante a fallos.
- Resaltado secuencial con control preciso de velocidad sin dependencias nuevas.
- Avatares deterministas y offline, sin peticiones de red.
- UI accesible: grid semántico, controles con labels, modal con foco y cierre por teclado, resultado anunciado.
- Componentes y módulos pequeños, fáciles de testear si luego se agregan tests.

**Non-Goals:**
- Sincronización entre pestañas o backend.
- Pesos/probabilidades por persona, sonido o subida de avatares propios.
- Historial de rondas más allá de la lista de seleccionados.
- Internacionalización; textos en español.

## Decisions

### Modelo de estado único en `App`

Un solo hook `useRoster` mantiene:

```ts
type Person = { id: string; name: string; selected: boolean }
```

- `id` estable generado con `crypto.randomUUID()` (fallback contador + timestamp) para no romper la selección al agregar/eliminar nombres.
- Derivados: `available = people.filter(p => !p.selected)`, `selected = people.filter(p => p.selected)`.
- Se persiste `people` completo en una sola clave (`spin-taco:roster:v1`) en vez de dos claves separadas: elimina el riesgo de estados inconsistentes entre listado total y seleccionados.

Alternativa considerada: dos claves separadas (`names`, `selected`). Descartada por la posibilidad de desincronización parcial.

### Persistencia con lectura defensiva

Módulo `src/lib/storage.ts`:

- `loadRoster(fallback): Person[]` valida forma con type guard (`id`/`name` string no vacío, `selected` boolean), filtra entradas inválidas y devuelve `fallback` si el JSON no parsea o el esquema no coincide.
- `saveRoster(people)` envuelve `localStorage.setItem` en try/catch (modo privado, cuota llena) y no propaga el error a la UI.
- Lectura inicial vía `useState(() => loadRoster(DEFAULT_NAMES))` para evitar parpadeo; escritura vía `useEffect` sobre `people`.
- Clave versionada `:v1` para permitir migraciones futuras.

Alternativa considerada: `useSyncExternalStore` con store externo. Sobredimensionado para una sola pantalla.

### Avatares locales deterministas

- 25 archivos `public/avatars/avatar-01.svg` … `avatar-25.svg` (formas geométricas simples, paletas variadas, sin texto).
- `src/lib/avatars.ts`:
  - `AVATAR_COUNT = 25`.
  - `avatarFor(name: string): string` aplica un hash estable (FNV-1a de 32 bits sobre el nombre normalizado con `trim().toLowerCase()`) y devuelve `/avatars/avatar-${String(hash % 25 + 1).padStart(2, '0')}.svg`.
  - Determinista: mismo nombre → mismo avatar, sin estado adicional ni almacenamiento. Sobrevive a recargas y a cambios de orden.
- La tarjeta renderiza `<img>` con `alt=""` (decorativo) porque el nombre ya está visible; el nombre lleva el texto accesible.
- Colisiones de avatar entre dos nombres son aceptables (25 opciones para N personas).

Alternativa considerada: avatar aleatorio persistido por persona. Requiere un campo extra en el modelo y no aporta valor; el hash da el mismo resultado observable de forma más simple. Alternativa descartada: API externa (DiceBear) por dependencia de red.

### Motor de resaltado con `requestAnimationFrame`

El resaltado secuencial necesita aceleración/frenado no lineal, así que no se usa una `transition` CSS (no permite cambiar de elemento resaltado).

`src/lib/picker.ts`:

- `pickWinner(available: Person[]): Person` → índice aleatorio uniforme.
- `buildHighlightSchedule(winnerIndex, count, options)` → array de `{ index, delayMs }` o, más simple, función `nextDelay(elapsedMs, totalMs)`.
- Implementación elegida: **duración total fija** (`~4200ms`) y **intervalo por paso creciente** con easing `easeOutQuart`:
  - `progress = elapsed / duration` (0→1), `interval = MIN_INTERVAL + (MAX_INTERVAL - MIN_INTERVAL) * easeOut(progress)`.
  - `MIN_INTERVAL ≈ 60ms` (muy rápido al inicio), `MAX_INTERVAL ≈ 420ms` (frenado claro al final).
  - Cada tick avanza el índice resaltado con paso pseudoaleatorio (`1 + floor(rand * 3)`), de modo que el recorrido se ve aleatorio y no un barrido lineal.
- El último paso se **fuerza** al índice del ganador y se fija su `delay` al `MAX_INTERVAL`, garantizando que la animación termine exactamente en la tarjeta elegida sin importar el camino.
- El bucle se implementa con `requestAnimationFrame` + `performance.now()`, guardando el `requestAnimationFrame` id en un `ref` y cancelándolo en cleanup y al desmontar.
- Al terminar: `onFinish(winner)` → abre el modal y marca el ganador como seleccionado.

Alternativas consideradas: `setInterval` con `setTimeout` recursivo (menos preciso, deriva acumulada); `setInterval` de intervalo fijo con duración variable (no cumple el frenado progresivo).

### Reducción de movimiento

`window.matchMedia('(prefers-reduced-motion: reduce)')` leído al iniciar el sorteo. Si está activo: sin bucle, se resalta directamente al ganador y se abre el modal de inmediato. Se respeta también a mitad de sorteo si cambia la preferencia (se consulta en cada tick).

### Estado de sorteo y desbloqueo

`isSpinning` bloquea "Play", la edición de nombres y el reinicio durante la animación. El ganador queda resaltado mientras el modal está abierto y su tarjeta se retira del grid **al cerrar el modal**, para que el resaltado siga visible durante la felicitación.

### Modal sin librería

`WinnerModal` con `<dialog>` nativo (`showModal()`): backdrop, cierre con Escape y focus trap gratis. Fallback: render condicional con overlay y `role="dialog" aria-modal="true"` si `showModal` no existe. Botón "Cerrar" y click en backdrop cierran; Escape solo con `<dialog>`.

### Gestión de nombres en UI

`NameManager`: input controlado + botón "Agregar", y lista con botón eliminar por fila. Validaciones:

- Trim del valor; rechazo si queda vacío → "El nombre no puede estar vacío".
- Rechazo case-insensitive si ya existe → "Ese nombre ya está en la lista".
- Deshabilitado durante `isSpinning`.
- Agregar deja `selected: false`; eliminar borra la persona y su marca.
- Botón "Reiniciar sorteo" con confirmación inline (no `window.confirm`) que pone todos `selected: false`.

### Grid responsive

- `display: grid` con `grid-template-columns: repeat(4, minmax(0, 1fr))`.
- Media queries: 3 columnas por debajo de ~900px, 2 por debajo de ~600px, manteniendo el orden de lectura.
- `min-width: 0` en las tarjetas para que nombres largos hagan `text-overflow: ellipsis` en vez de desbordar.
- Tarjeta resaltada: clase `.is-active` con borde/elevación usando `--accent`; transición corta para que el paso rápido se vea nítido pero no parpadeante.

### Estructura de archivos

```
public/avatars/avatar-01.svg … avatar-25.svg
src/
  App.tsx                     # composición y estado
  App.css                     # estilos de layout y componentes nuevos
  components/
    CardGrid.tsx              # grid 4xN + botón Play
    PersonCard.tsx            # avatar + nombre + estado resaltado/seleccionado
    NameManager.tsx           # alta/baja de nombres + reinicio
    PeopleLists.tsx           # listado total y seleccionados
    WinnerModal.tsx           # dialog de felicitaciones
  hooks/
    useRoster.ts              # estado + persistencia + selección
  lib/
    storage.ts                # load/save defensivo
    avatars.ts                # hash → avatar local
    picker.ts                 # ganador aleatorio + bucle de resaltado
  types.ts                    # Person, RosterState
```

Se conserva `main.tsx`. Se elimina el contenido de demo de `App.tsx` y los estilos muertos de `App.css` (hero, counter, next-steps).

### Accesibilidad

- Play: `<button>` con `aria-label="Iniciar el sorteo"`, deshabilitado mientras corre.
- Grid: `<ul role="list">` con un `<li>` por persona; la tarjeta activa expone `aria-current="true"`.
- Resultado anunciado en región `aria-live="polite"` ("Seleccionado: <nombre>").
- Listados con estado textual ("Seleccionado"/"Disponible"), no solo color.
- Modal con `aria-labelledby` y foco inicial en "Cerrar".

## Risks / Trade-offs

- **`requestAnimationFrame` pausado en pestaña oculta** → al volver, el `elapsed` salta; el cálculo por `performance.now()` finaliza el sorteo en el siguiente frame, sin quedar colgado.
- **`localStorage` bloqueado o lleno** → try/catch silencioso; la app funciona en memoria.
- **Muchos nombres** (>40) hacen el grid largo y el sorteo más vistoso pero con scroll → límite blando de 40 nombres con mensaje, y el resaltado hace `scrollIntoView({ block: 'nearest' })` sobre la tarjeta activa.
- **Paso rápido con `MIN_INTERVAL = 60ms`** puede ser demasiado para pantallas lentas → el intervalo se calcula en ms reales, así que la duración total se mantiene estable aunque caigan frames.
- **Colisión de avatares** con N > 25 → aceptable; el nombre desambigua.
- **Doble click en Play** → guard al inicio de `start()` y botón deshabilitado.
- **Eliminar el ganador con modal abierto** → el modal se cierra y el estado se recalcula.
- **StrictMode doble efecto** → persistencia idempotente; el bucle de animación vive en handlers, no en efectos de montaje, y su cleanup cancela el frame.

## Migration Plan

Sin migración de datos: no hay estado previo en `localStorage`. La clave nueva se crea en el primer cambio. Rollback trivial (revertir el commit); los datos huérfanos bajo `spin-taco:roster:v1` no afectan al template original.

## Open Questions

- Ninguna pendiente que afecte specs, enfoque o desglose de tareas.
