# /portafolio · Índice — paginación y filtrado

**Estado**: ejecutado (F1 + F2). Pendiente: commit y push.
**Rama**: `redesign/personalblog-v2`. **Runner**: `bun` (el proyecto no tiene tests; se verifica con
`bun check`, `bun lint`, `bun build` y medición en navegador).

## 1. Estado actual (medido)

`src/components/sections/portfolio/WorkIndex.astro` **ya filtra** por categoría: pills derivadas de
los datos (`countByCategory`), contador, región `aria-live` y estado vacío. Lo que no existe es
paginación, y por eso el índice es un muro:

| Entorno | Proyectos | Tarjetas en el índice |
| --- | --- | --- |
| dev (mocks de GitHub) | 8 contenido + 5 repos | **12** (el destacado sale del índice) |
| producción | 8 contenido + 25 repos públicos (29 − 5 excluidos en `src/lib/github.ts:8`) | **32** |

32 tarjetas seguidas, cada una con portada 16/10, cabecera de navegador, badges y stack: en un
portátil son ~7 pantallas de scroll después del caso destacado. Es el problema real, y crece solo
(cada repo nuevo suma una tarjeta).

Huecos concretos de `WorkIndex.astro`:

1. **Sin paginación**: `apply()` solo toca `style.display` por categoría (`:121-125`); nada limita
   cuántas tarjetas se pintan.
2. **Un solo eje de filtro**: tipo de proyecto. No se puede preguntar «¿qué está en curso?» ni
   buscar «PayPal» entre 32 tarjetas.
3. **El contador dice «visibles»**, que con paginación deja de ser el total del filtro.

## 2. Qué propongo

### F1 — Paginación (el núcleo)

- **9 por página** (3×3 en `xl`, 3×3 en `md`, 9 seguidas en móvil). Con los números de arriba:
  12 → 2 páginas en dev, 32 → 4 en producción.
- **Filtrar primero, paginar después**: la página se calcula sobre el conjunto filtrado, no sobre
  el total. Cambiar de filtro vuelve a la página 1 y recalcula el número de páginas.
- **Barra al pie del índice**: `Anterior` · `1 2 3 4` · `Siguiente`, con
  `<nav aria-label="Paginación de proyectos">`, `aria-current="page"` y `disabled` real en los
  extremos. Se oculta entera si el filtro activo cabe en una página.
- **Lectura del rango**: `1–9 de 32`, y una región `aria-live` que anuncia
  «Página 2 de 4, proyectos 10 a 18 de 32» una vez por cambio (mismo patrón de debounce de 300 ms
  que ya usa el contador).
- **Al cambiar de página**, scroll al inicio de la sección (`#indice`) con
  `scrollIntoView({ block: 'start' })`, respetando `prefers-reduced-motion`.
- **URL compartible**: `?pagina=2` con `history.replaceState` (no recarga, no ensucia el historial).
  Al cargar se lee y se valida contra las páginas reales de ese filtro.
- **Sin JS**: se ven las 32 tarjetas como hoy. La paginación es una mejora, no un requisito para
  ver contenido; no hay contenido escondido en HTML que el usuario sin JS no pueda alcanzar.

### F2 — Dos ejes de filtro más

- **Estado**: `Todos · En curso · Entregados · Repos del taller`. Sale del campo `status` /
  `source` que ya existe en `Project` (`src/types/project.ts:32-49`); etiquetas derivadas de los
  datos, igual que las de categoría.
- **Búsqueda por texto** en título, stack, cliente y descripción, con `input type="search"`,
  debounce 150 ms, `aria-label` y limpieza con `Esc`. Con 32 tarjetas es el filtro que más se usa
  de verdad; con las 12 de dev apenas cambia nada.
- Los dos se combinan con la categoría y entre sí (AND), y cualquier cambio resetea a página 1.

**Descartado**: rutas `/portafolio/pagina/N` renderizadas en servidor. Duplican el contenido del
índice entre URLs (SEO negativo), y al combinar con filtros obligarían a generar una ruta por
combinación. La paginación es del cliente.

## 3. Cambios por archivo

| Archivo | Cambio |
| --- | --- |
| `src/components/sections/portfolio/WorkIndex.astro` | Lógica de filtro paginado, barra de paginación, controles de estado y búsqueda, ARIA. Todo dentro del `<script>` vanilla que ya existe; mismo guard de `astro:after-swap`. |
| `src/utils/projectCategories.ts` | `countByStatus()` junto a `countByCategory()` (F2), y un helper `matchesQuery()` reutilizable. |
| `src/pages/portafolio/index.astro` | Props nuevas (`pageSize`), copy del `SectionHeading` que hoy dice «Filtrá por tipo de trabajo». |
| `src/pages/portafolio/webs.astro` | Idem. Es donde la paginación más se nota (33 tarjetas). |
| `src/styles/global.css` | Solo si hace falta: reutilizo las utilidades que ya usa el componente (`#c70039`, `text-white/40`, `border-white/10`). |

Sin dependencias nuevas, sin framework de isla, sin Alpine: el mismo `<script>` con `document`.

## 4. Comportamiento exacto (casos que voy a medir)

| Caso | Esperado (dev) |
| --- | --- |
| Carga de `/portafolio` | 9 tarjetas, «1–9 de 12», 2 páginas, foco en `1` con `aria-current="page"` |
| Clic en `2` | 3 tarjetas, «10–12 de 12», `Siguiente` deshabilitado, URL `?pagina=2` |
| Clic en filtro `Web` (7) | 7 tarjetas, sin barra de paginación, vuelve a página 1, contador `7` |
| Filtro sin resultados | Estado vacío actual, barra oculta |
| `?pagina=9` (fuera de rango) | Cae a la última página válida, sin error en consola |
| Teclado | `Tab` recorre pills → controles → tarjetas; `Enter`/`Espacio` activan; el foco no se pierde al paginar |

## 5. Verificación

- `bun check`, `bun lint`, `bun build` (46 páginas hoy; debe seguir igual).
- Navegador a 1440 y 390 px: recorrer la tabla de la sección 4 dos veces, una por vista
  (`/portafolio`, `/portafolio/webs`).
- Comprobar que al paginar no queda ninguna portada rota (el fallback de `WorkCard` sigue vivo) y
  que el tilt no se rompe en las tarjetas de la página 2.
- Contar con `document.querySelectorAll('[data-project-card]')` + `offsetParent !== null`, no a ojo.

## 6. Riesgos

- **`WorkIndex` es compartido** con `/portafolio/webs`: el cambio se ve en dos rutas. Es deseable
  (una sola implementación), pero `/portafolio/webs` es la que más tráfico de «ver todos» recibe y
  hay que medirla aparte.
- **El contador cambia de significado**: hoy cuenta tarjetas visibles; pasa a mostrar el total del
  filtro y el rango de página por separado. Es una mejora, pero es un cambio de contrato visible.
- **`display:none` sobre 32 tarjetas**: las imágenes de páginas no abiertas siguen en `lazy`, así
  que paginar no dispara 32 descargas. Ya es el comportamiento actual con los filtros.
- Todo el estado vive en memoria del `<script>`; el guard `data-work-init` ya evita el doble
  enganche tras `astro:after-swap`, pero hay que colgar los listeners nuevos del mismo init.

## 7. Decisiones abiertas

1. **¿F1 solo o F1 + F2?** F1 resuelve el muro de 32 tarjetas; F2 (estado + búsqueda) es lo que
   hace el índice navegable de verdad.
2. **9 vs 12 por página.** 9 llena 3 filas exactas; 12 reduce a 3 páginas en producción.
3. **`?pagina=` en la URL.** Lo propongo; si no querés parámetros en una página de portada, se
   queda solo en memoria.

## 8. Ejecutado

**Aprobado**: F1 + F2 (paginación de 9, `?pagina=N`, estado y búsqueda). Nada de lo aprobado quedó
fuera; tres desvíos, todos medidos:

1. **`WorkIndex` calcula sus propios filtros** (`countByCategory` + `countByStatus` desde
   `projects`) en vez de recibir `counts` por prop: dos ejes de filtro derivados en dos lugares era
   la forma más fácil de que el hub y la lista completa se desincronizaran. Las dos páginas dejaron
   de pasar `counts`.
2. **El estado oculto de las tarjetas es una clase CSS** (`.is-paged-out`), no `style.display`
   inline. La regla sólo aplica con `html[data-pager='on']`, flag que pone un `<script is:inline>`
   durante el parseo: sin JS se ven todas las tarjetas (medido: 13 de 13 en `/portafolio/webs`), y
   con JS la primera pintura ya muestra sólo la página 1 en vez de las 13 y un salto después.
3. **El contador cambió de significado**: muestra el total del filtro activo, y el rango de la
   página (`10–12 de 12`) vive en la barra de paginación. Con eso el número deja de bailar al
   paginar.

### Archivos

- `src/components/sections/portfolio/WorkIndex.astro` — barra de filtros (categoría + estado +
  búsqueda), grilla paginada, barra de paginación y todo el comportamiento en el mismo `<script>`
  vanilla con guard de `astro:after-swap`.
- `src/components/ui/WorkCard.astro` — `data-status` y `data-search` (texto normalizado de título,
  descripción, cliente, empresa, rol y stack).
- `src/utils/projectCategories.ts` — `statusOf`, `countByStatus`, `normalizeText`, `searchTextOf`.
- `src/styles/global.css` — `.is-paged-out`, `.pager-btn`, `.pager-gap`.
- `src/pages/portafolio/index.astro`, `src/pages/portafolio/webs.astro` — sin prop `counts`, copy
  nuevo.

### Verificación observada (dev `localhost:4321`, producción en `dist/`)

- `bun check`: 0 errores. `bun lint`: los mismos 7 preexistentes (`ChatbotWidget.tsx`,
  `ExperienceStickyScroll.tsx`, `CleanFilmGrid.tsx`), ninguno en archivos tocados.
  `bun run build`: 46 páginas; `dist/portafolio/index.html` renderiza 29 tarjetas, 20 marcadas
  como paged-out y `1–9 de 29`.
- `/portafolio` (12 tarjetas en dev): página 1 → 9 visibles, `1–9 de 12`, `1 2`, «anterior»
  deshabilitado. Página 2 → 3 visibles, `10–12 de 12`, URL `?pagina=2`, anuncio «Página 2 de 2,
  proyectos 10 a 12 de 12.».
- `?pagina=2` en frío restaura la página 2; `?pagina=9` cae a la última válida y reescribe la URL.
- Filtro `Web` → 7 tarjetas, barra de paginación oculta, vuelve a página 1, URL limpia.
- Estado `Repositorios` → 5; búsqueda «astro» → 5; búsqueda sin coincidencias → estado vacío,
  `Sin resultados`, anuncio propio; `Esc` limpia y devuelve 9.
- `/portafolio/webs`: 13 tarjetas → 9 + 4, pills `Todos · En curso 1 · Entregados 7 ·
  Repositorios 5`.
- Sin JS (CDP `setScriptExecutionDisabled`): 13 de 13 visibles, paginación oculta.
- 390 px: `scrollWidth` igual al viewport, barra de paginación 342 px, buscador 342 px, 9 tarjetas,
  0 portadas rotas.

### Pendiente

- El tilt 3D no se pudo medir en este entorno: el navegador headless reporta `pointer: coarse`, así
  que `initTiltCards` se desactiva solo (comportamiento previo, no de este cambio). En un puntero
  fino las 29 tarjetas se enganchan igual que antes, porque están todas en el DOM desde el inicio.
- Commit y push: decisión de Steve.

