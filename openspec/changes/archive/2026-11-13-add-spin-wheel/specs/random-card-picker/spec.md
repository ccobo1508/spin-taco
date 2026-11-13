# Spec Delta

## Purpose

Permite sortear al azar a una persona de un arreglo de nombres mediante un grid de tarjetas con resaltado secuencial desacelerado, excluyendo a quienes ya fueron seleccionados y conservando el estado entre sesiones del navegador.

## ADDED Requirements

### Requirement: Gestión de nombres en la interfaz
El sistema SHALL permitir al usuario agregar y eliminar nombres del listado total desde la interfaz, manteniendo el grid sincronizado con ese listado.

#### Scenario: Agregar un nombre
- **WHEN** el usuario ingresa un nombre no vacío que no existe en el listado y confirma
- **THEN** el nombre se agrega al listado total, aparece como una tarjeta disponible en el grid y se persiste en `localStorage`

#### Scenario: Rechazo de nombre vacío o duplicado
- **WHEN** el usuario intenta agregar un nombre vacío o uno que ya existe en el listado
- **THEN** el sistema no modifica el listado y muestra un mensaje de validación

#### Scenario: Eliminar un nombre
- **WHEN** el usuario elimina un nombre del listado total
- **THEN** el nombre desaparece del listado y de su tarjeta en el grid, y su marca de selección se descarta

#### Scenario: Eliminar al ganador actual
- **WHEN** el usuario elimina a la persona que acaba de ganar
- **THEN** el nombre se retira del listado total y del listado de seleccionados sin afectar a los demás

### Requirement: Grid de tarjetas de participantes
El sistema SHALL mostrar a las personas disponibles como tarjetas en un grid de 4 columnas por N filas, cada una con avatar y nombre visibles.

#### Scenario: Grid con participantes disponibles
- **WHEN** la aplicación carga y existen personas no seleccionadas
- **THEN** el grid muestra una tarjeta por persona disponible con su avatar y nombre, en 4 columnas

#### Scenario: Sin participantes disponibles
- **WHEN** todas las personas del arreglo están marcadas como seleccionadas
- **THEN** el grid se muestra vacío y la acción "Play" queda deshabilitada con un mensaje indicándolo

#### Scenario: Grid adaptable
- **WHEN** el ancho de la pantalla no permite 4 columnas legibles
- **THEN** el grid reduce la cantidad de columnas manteniendo todas las tarjetas visibles y sin desbordamiento horizontal

### Requirement: Avatar estable por persona
El sistema SHALL asignar a cada persona un avatar de un set local de 25 SVG, elegido de forma determinista a partir de su nombre.

#### Scenario: Avatar asignado al agregar
- **WHEN** el usuario agrega un nombre nuevo
- **THEN** la tarjeta de esa persona muestra un avatar del set local sin requerir conexión a red

#### Scenario: Avatar consistente entre sesiones
- **WHEN** la aplicación se recarga con el mismo nombre en el listado
- **THEN** esa persona conserva el mismo avatar que tenía antes de recargar

### Requirement: Selección aleatoria al presionar Play
El sistema SHALL seleccionar a una persona al azar entre las disponibles cuando el usuario presiona "Play".

#### Scenario: Selección aleatoria
- **WHEN** el usuario presiona "Play" con al menos una persona disponible
- **THEN** el sistema elige a una persona al azar entre las disponibles y ninguna persona no disponible puede resultar elegida

#### Scenario: Bloqueo durante el sorteo
- **WHEN** el resaltado secuencial está en curso
- **THEN** la acción "Play" queda deshabilitada hasta que el sorteo termina

### Requirement: Resaltado secuencial con desaceleración
El sistema SHALL resaltar las tarjetas de a una por vez durante el sorteo, comenzando a alta velocidad y desacelerando progresivamente hasta detenerse en la tarjeta ganadora.

#### Scenario: Animación visible
- **WHEN** el usuario presiona "Play"
- **THEN** las tarjetas se resaltan de a una en una secuencia visible que reduce su velocidad gradualmente y termina detenida en la tarjeta de la persona elegida

#### Scenario: Una sola tarjeta resaltada
- **WHEN** el resaltado secuencial está en curso
- **THEN** en cada instante se ve resaltada como máximo una tarjeta

#### Scenario: Detención en el ganador
- **WHEN** el resaltado secuencial termina
- **THEN** la tarjeta resaltada es la de la persona elegida y permanece resaltada hasta que el modal se cierra

#### Scenario: Preferencia de movimiento reducido
- **WHEN** el usuario tiene activada la preferencia de movimiento reducido del sistema
- **THEN** el sistema acorta o elimina la animación y revela al ganador directamente, sin perder el modal de felicitaciones

### Requirement: Modal de felicitaciones
El sistema SHALL mostrar un modal de felicitaciones con el nombre de la persona ganadora al finalizar el sorteo.

#### Scenario: Aparición del modal
- **WHEN** el resaltado secuencial termina
- **THEN** se muestra un modal de felicitaciones con el nombre de la persona ganadora

#### Scenario: Cierre del modal
- **WHEN** el usuario cierra el modal
- **THEN** el modal desaparece y el grid refleja únicamente a las personas aún disponibles

### Requirement: Exclusión de seleccionados
El sistema SHALL marcar como `selected` a la persona ganadora y retirar su tarjeta del grid, de modo que no pueda volver a ser elegida.

#### Scenario: Ganador retirado del grid
- **WHEN** una persona es seleccionada
- **THEN** se agrega al listado de seleccionados y su tarjeta deja de aparecer en el grid en sorteos posteriores

#### Scenario: Sin duplicados entre sesiones
- **WHEN** el usuario repite el sorteo hasta agotar a las personas disponibles
- **THEN** ninguna persona resulta seleccionada más de una vez

### Requirement: Persistencia del estado en localStorage
El sistema SHALL persistir en `localStorage` el listado total de nombres y el listado de personas seleccionadas, y restaurarlos al iniciar una nueva sesión.

#### Scenario: Restauración al recargar
- **WHEN** el usuario recarga la aplicación después de haber seleccionado personas
- **THEN** el grid muestra solo a las personas no seleccionadas y el listado de seleccionados conserva su contenido

#### Scenario: Estado persistido tras cada selección
- **WHEN** una persona es seleccionada
- **THEN** el listado total y el listado de seleccionados se escriben en `localStorage`

#### Scenario: Datos almacenados inválidos o ausentes
- **WHEN** la aplicación inicia sin datos en `localStorage` o con datos que no pueden interpretarse
- **THEN** el sistema usa el arreglo de nombres configurado como estado inicial y no falla al cargar

### Requirement: Visualización de listados
El sistema SHALL mostrar el listado total de nombres y el listado de personas seleccionadas en la interfaz.

#### Scenario: Listados visibles
- **WHEN** la aplicación está en pantalla
- **THEN** el usuario puede ver el listado total de nombres y el listado de seleccionados, indicando el estado de cada persona

### Requirement: Reinicio del sorteo
El sistema SHALL permitir reiniciar el estado para que todas las personas vuelvan a estar disponibles y se limpie el listado de seleccionados.

#### Scenario: Reinicio manual
- **WHEN** el usuario solicita reiniciar el sorteo y confirma la acción
- **THEN** todas las personas vuelven a estar disponibles en el grid, el listado de seleccionados queda vacío y el estado actualizado se persiste en `localStorage`
