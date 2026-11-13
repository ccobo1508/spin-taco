# Tasks

## 1. Base de tipos y persistencia

- [x] 1.1 Crear `src/types.ts` con `Person` (`id`, `name`, `selected`) y constantes de clave `spin-taco:roster:v1`; verificar que `npm run build` compila sin errores
- [x] 1.2 Crear `src/lib/storage.ts` con `loadRoster(fallback)` que valide forma y devuelva el fallback ante JSON inválido, y `saveRoster(people)` con try/catch; verificar manualmente en consola del navegador que un valor corrupto en `localStorage` no rompe la carga
- [x] 1.3 Crear `src/lib/avatars.ts` con `avatarFor(name)` basado en hash FNV-1a normalizado y `AVATAR_COUNT = 25`; verificar en consola que el mismo nombre devuelve siempre la misma ruta `/avatars/avatar-NN.svg`

## 2. Set de avatares

- [x] 2.1 Crear los 25 SVG `public/avatars/avatar-01.svg` … `avatar-25.svg` con formas geométricas y paletas variadas, sin texto ni dependencias externas; verificar que los 25 archivos cargan abriendo la URL directa en el navegador
- [x] 2.2 Verificar que las rutas generadas por `avatarFor` para los nombres del listado por defecto apuntan a archivos existentes; corregir cualquier 404 detectado en la pestaña Network

## 3. Estado del roster

- [x] 3.1 Implementar `src/hooks/useRoster.ts` con `people`, `available`, `selected`, `addName`, `removeName`, `markSelected`, `reset` y `loadRoster` en el inicializador de `useState`; verificar que agregar y eliminar nombres actualiza los listados derivados
- [x] 3.2 Añadir persistencia con `useEffect` sobre `people` llamando a `saveRoster`; verificar que tras recargar la página los nombres y seleccionados se restauran
- [x] 3.3 Implementar validación en `addName` (trim, vacío, duplicado case-insensitive) devolviendo mensaje de error; verificar rechazo de `""`, `"  "` y de un nombre ya existente

## 4. Motor de resaltado

- [x] 4.1 Crear `src/lib/picker.ts` con `pickWinner(available)` (índice aleatorio uniforme) y la función de intervalo progresivo basada en `easeOutQuart` con `MIN_INTERVAL`/`MAX_INTERVAL`; verificar con valores de `elapsed` en consola que el intervalo crece monótonamente de ~60ms a ~420ms
- [x] 4.2 Implementar el bucle con `requestAnimationFrame` + `performance.now()` que avanza el índice resaltado con paso pseudoaleatorio y fuerza el último paso al índice del ganador; verificar que el resaltado final coincide con el ganador elegido
- [x] 4.3 Cancelar el frame en cleanup y al desmontar, y respetar `prefers-reduced-motion` revelando al ganador sin bucle; verificar que desmontar durante el sorteo no produce warnings de estado tras unmount y que con movimiento reducido el modal abre de inmediato

## 5. Grid de tarjetas

- [x] 5.1 Crear `src/components/PersonCard.tsx` con avatar (`<img alt="">`), nombre y estado `is-active`/seleccionado, usando `avatarFor(name)`; verificar visualmente que cada tarjeta muestra avatar y nombre
- [x] 5.2 Crear `src/components/CardGrid.tsx` que renderice el grid 4xN desde `available`, exponga `activeIndex`, `aria-current` en la tarjeta activa y el botón "Play" deshabilitado durante el sorteo; verificar que hay una tarjeta por persona disponible y que el botón se bloquea al iniciar
- [x] 5.3 Implementar `scrollIntoView({ block: 'nearest' })` sobre la tarjeta activa y el estado sin participantes (grid vacío, mensaje y Play deshabilitado); verificar con más de 20 nombres y marcando a todas las personas como seleccionadas

## 6. Modal de ganador

- [x] 6.1 Crear `src/components/WinnerModal.tsx` con `<dialog>` nativo (`showModal`/`close`), `aria-labelledby` y foco inicial en "Cerrar", con fallback de overlay si `showModal` no existe; verificar que Escape, el botón y el click en backdrop cierran el modal
- [x] 6.2 Integrar el modal en `App.tsx`: al cerrar, marcar al ganador como `selected` y retirar su tarjeta del grid; verificar que el ganador no vuelve a aparecer en sorteos posteriores

## 7. Gestión de nombres y listados

- [x] 7.1 Crear `src/components/NameManager.tsx` con input controlado, botón "Agregar", mensaje de validación y botón eliminar por fila; verificar que agregar un nombre lo muestra de inmediato como tarjeta y en el listado total
- [x] 7.2 Añadir botón "Reiniciar sorteo" con confirmación inline que limpia seleccionados y persiste el estado; verificar que tras reiniciar todos vuelven a estar disponibles y `localStorage` refleja el cambio
- [x] 7.3 Crear `src/components/PeopleLists.tsx` con listado total y listado de seleccionados, mostrando estado textual además de color; verificar que ambos listados se actualizan al agregar, eliminar, seleccionar y reiniciar
- [x] 7.4 Deshabilitar edición de nombres y reinicio mientras el sorteo está en curso; verificar que los controles no responden durante la animación

## 8. Integración y estilos

- [x] 8.1 Reescribir `src/App.tsx` para componer grid, gestión de nombres, listados y modal usando `useRoster` y el motor de resaltado, eliminando el contenido de demo del template; verificar que la app carga sin errores en consola con `npm run dev`
- [x] 8.2 Actualizar `src/App.css` con estilos de grid responsive (4/3/2 columnas), tarjeta, resaltado, controles, listados y modal (incluyendo dark mode con los tokens existentes) y eliminar estilos muertos del template; verificar visualmente en modo claro y oscuro y en 3 anchos de pantalla
- [x] 8.3 Añadir región `aria-live` para anunciar el resultado y `aria-label`s en controles y grid; verificar con el inspector de accesibilidad que los nombres accesibles son descriptivos

## 9. Verificación final

- [x] 9.1 Ejecutar `npm run lint` y `npm run build` sin errores ni warnings nuevos
- [x] 9.2 Recorrer el flujo completo en `npm run dev`: agregar nombres, sortear varias veces hasta agotar, recargar la página, reiniciar el sorteo y comprobar que no hay duplicados ni pérdida de estado
- [x] 9.3 Actualizar `README.md` con una sección breve de uso del selector de tarjetas (agregar nombres, sortear, avatares, persistencia, reinicio); verificar que las instrucciones coinciden con la UI real

## Workflow follow-up

- Archivar el cambio con `openspec archive` cuando la revisión del proyecto esté satisfecha.
- Verificar que `openspec/specs/random-card-picker/spec.md` quedó creado tras el archivado.
