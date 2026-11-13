# Spin Taco

Selector aleatorio de personas con tarjetas, avatares locales y persistencia en `localStorage`.

## Uso

1. `npm install`
2. `npm run dev`
3. Agrega nombres con el formulario del panel "Participantes" (máximo 40; se rechazan vacíos y duplicados sin distinguir mayúsculas).
4. Presiona **Play**: las tarjetas se iluminan de a una, muy rápido al inicio y desacelerando hasta detenerse en la persona ganadora.
5. Al terminar se abre un modal de felicitaciones. Al cerrarlo, la persona pasa al listado de seleccionados y su tarjeta sale del grid para no volver a ser elegida.
6. **Reiniciar sorteo** devuelve a todas las personas al grid de tarjetas y vacía el listado de seleccionados.

Cada persona recibe un avatar determinista del set local en `public/avatars/` (25 SVG), elegido por hash de su nombre: el mismo nombre conserva siempre el mismo avatar.

## Persistencia

El listado total y las marcas de selección se guardan en `localStorage` bajo la clave `spin-taco:roster:v1`. Al recargar la página se restaura el estado; si los datos están corruptos o ausentes se usa la lista inicial por defecto.

## Scripts

- `npm run dev` — servidor de desarrollo con HMR
- `npm run build` — chequeo de tipos y build de producción
- `npm run lint` — Oxlint
- `npm run preview` — sirve el build de producción

## Estructura

- `src/App.tsx` — composición de la pantalla
- `src/components/` — grid, tarjeta, gestión de nombres, listados y modal
- `src/hooks/` — estado del roster y motor de resaltado
- `src/lib/` — persistencia, avatares y cálculo del sorteo

## Stack

React 19 + TypeScript + Vite, sin dependencias adicionales. La animación usa `requestAnimationFrame` y respeta `prefers-reduced-motion`.
