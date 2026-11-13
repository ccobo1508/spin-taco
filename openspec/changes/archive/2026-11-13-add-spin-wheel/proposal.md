# Proposal

## Why

Necesitamos una herramienta para sortear personas de una lista de forma visual y sin repeticiones. Hoy la app es el template de Vite/React sin funcionalidad; el selector permite elegir al azar a alguien de un arreglo de nombres, marcarlo como seleccionado y persistir el estado entre sesiones.

## What Changes

- Nueva vista principal que reemplaza el contenido del template por un grid de tarjetas de 4 columnas por N filas, una tarjeta por persona disponible con avatar y nombre.
- Al presionar "Play", las tarjetas se resaltan de a una en orden aleatorio, muy rápido al inicio y desacelerando progresivamente hasta detenerse en la tarjeta ganadora.
- Al finalizar el resaltado, se muestra un modal de felicitaciones con el nombre ganador.
- Cada persona seleccionada pasa a estado `selected` y se retira del grid para evitar duplicados.
- Listado total de nombres y listado de seleccionados se persisten en `localStorage` para futuras sesiones.
- El usuario puede agregar y eliminar nombres desde la interfaz, con validación de entradas vacías o duplicadas.
- Cada persona recibe un avatar desde un set local de 25 SVG, asignado de forma estable a partir de su nombre.
- **BREAKING**: se elimina el contenido de demo del template (contador, hero, enlaces) de la vista principal.

## Capabilities

### New Capabilities

- `random-card-picker`: sorteo aleatorio de personas desde un arreglo de nombres mediante un grid de tarjetas con resaltado secuencial desacelerado, avatares locales, exclusión de seleccionados, modal de ganador y persistencia en `localStorage`.

### Modified Capabilities

<!-- Ninguna: no existen specs previas. -->

## Impact

- `src/App.tsx`: pasa a orquestar el grid, el estado de nombres y la persistencia.
- Nuevos componentes/módulos para el grid de tarjetas, la tarjeta individual, el motor de resaltado, la lista de participantes, la gestión de nombres y el modal de ganador.
- Nuevo set de 25 avatares SVG en `public/avatars/` y un módulo que los asigna por hash del nombre.
- Nuevo módulo de persistencia en `localStorage` con lectura/escritura defensiva.
- `src/App.css` / `src/index.css`: estilos de grid, tarjeta, controles, listas y modal; se retiran estilos del template que queden sin uso.
- Sin dependencias nuevas: el resaltado usa `requestAnimationFrame` y clases CSS; los avatares son assets locales.
