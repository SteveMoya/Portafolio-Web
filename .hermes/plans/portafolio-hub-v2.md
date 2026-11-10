# /portafolio — de hub heredado a portafolio de casos

**Estado**: propuesta, pendiente de aprobación.
**Rama**: `redesign/personalblog-v2`. **Runner**: `bun` (el proyecto no tiene tests: se verifica con `bun check`, `bun lint`, `bun build`).

## 1. Diagnóstico

`/portafolio` es la única vista de primer nivel que se quedó en el diseño anterior, y es la que
está en el menú principal (`src/layouts/Navbar.astro:12`, entre Blog y Contacto). El resto del
sitio ya migró a `PageHero` + `SectionRail` + `SectionHeading` + reveals; esta no.

Evidencia concreta, en dev (`localhost:4321`):

| Vista | Hero | Rail | Números | Filtros |
| --- | --- | --- | --- | --- |
| `/gallery` | `PageHero` | 4 secciones | 63 obras (42 fotos + 21 diseños) | sí |
| `/education` | `PageHero` + escena | 5 secciones | programas, certificados, idiomas | sí |
| `/portafolio` | `Header.astro` (raleway, 45 px, centrado) | — | — | — |

Y los problemas de fondo:

1. **Mezcla dos registros distintos.** Cuatro tarjetas con imagen de fondo
   (`src/components/Portafolio/Portafolio.astro:14-39`): *Marketing* sale del portafolio a
   `/blog/category/marketing/1`; *Fotografía* y *Diseño Gráfico* llevan a vistas que **duplican
   `/gallery`** con una UI peor (masonry sin filtros, tokens viejos `bg-skin-fill` /
   `ring-skin-muted` en `src/components/Gallery.astro:25`). Solo *Web* → `/portafolio/webs` es un
   índice real de proyectos.
2. **`/portafolio/marketing` está vacía.** `getStaticPaths` genera el slug
   (`src/pages/portafolio/[...slug].astro:38-46`) y el template no tiene rama para él
   (`:77-80`). Medido: la página mide **297 px** de alto, solo el título «Mis Casos» y su bajada.
   Además nadie enlaza a ella: la tarjeta de Marketing apunta al blog.
3. **Portadas frágiles.** Los `public_id` de Cloudinary están escritos a mano
   (`Portafolio.astro:5-11`). Si un asset se renombra o se borra, la tarjeta pierde la imagen sin
   avisar (`img = ''` y `CldImage` recibe cadena vacía).
4. **Copy con faltas y frases incompletas**: «Aqui todas mis estrategias…», «Aqui todos mis
   diseños gráficos donde deje libre mi creatividad». Falta la tilde y falta el verbo.
5. **El hero no dice nada.** «Mi Portafolio» / «Mira un poco de mis Trabajos» es un título
   genérico en una página cuyo contenido real son 11 proyectos en markdown
   (`src/content/projects/`) más los repos de GitHub.

Conclusión: hoy `/portafolio` no aporta nada que `/gallery` + `/portafolio/webs` no digan mejor.
La mejora no es decorar las cuatro tarjetas: es **decidir qué es esta página**.

## 2. La decisión: separar trabajo de archivo

- **`/portafolio` = trabajo**: lo que hiciste para alguien, con rol, stack y resultado.
- **`/gallery` = archivo visual**: fotos y piezas sueltas. Ya existe, funciona y tiene 63 obras.

De ahí salen tres reglas:

- `/portafolio/fotografia` y `/portafolio/diseno` → **301 a `/gallery`**. No se mantienen dos UIs
  del mismo contenido; la vieja (`Gallery.astro`) se retira con ellas.
- `/portafolio/webs` **se queda**: es el índice completo, y es el destino de «Ver todos» en el home
  (`ProjectGallery.astro:134`) y en `/skills` (`skills.astro:385`).
- `/portafolio/marketing`: **o se construye o se borra**. Los posts de marketing ya existen en
  `src/content/blog/` (Marketing 5.0, las 22 leyes, la vaca púrpura…), así que un caso de estudio
  es filtrar `getPosts()` por categoría — no haría falta contenido nuevo. Si no querés eso, la
  ruta se elimina del árbol y la tarjeta de Marketing desaparece del hub.

## 3. Dirección visual: el portafolio físico

Cada vista nueva tiene su objeto: **Education** = estantería, **Experience** = engranajes,
**Skills** = visor. El portafolio necesita el suyo, y el natural es el que el propio nombre
describe: **un portafolio es un archivo plano** — el cajón de láminas (flat file / plan chest) que
hay en cualquier estudio de diseño e imprenta.

- Cajón cerrado = ranura con etiqueta grabada (`PROYECTOS · 11`), como un mueble real.
- Hover / foco / clic → el cajón sale ~40 px y deja ver el canto de la lámina con el título y el año.
- **Solo CSS 3D**: `translateZ` + `rotateX`, la misma técnica que ya usa `src/utils/tilt3d.ts`.
  Sin canvas, sin física, sin motor nuevo. Se degrada solo en móvil (lista vertical con el mismo
  etiquetado).

Sale distinto de las otras tres escenas y de `/gallery` (que es una mesa de luz con tira de
contactos): misma familia, otro mueble.

**Alternativa más barata** si preferís no sumar otra escena: `background="pattern"` en `PageHero`
— exactamente lo que hace `/gallery`. Menos identidad, cero riesgo, y la página igual queda
ordenada.

## 4. Estructura propuesta

1. **Hero** — `eyebrow="Selección"`, líneas `TRABAJO / SELECCIONADO`, acento en la segunda,
   `motion="scroll"`, meta con números reales: `11 proyectos`, `N clientes`, `63 obras` (esta
   última enlaza a `/gallery`, y es la que evita duplicar la galería).
2. **SectionRail** — Casos · Índice · Proceso · Archivo.
3. **Caso destacado** — un proyecto `featured`: portada grande, rol, stack, año, demo y código.
   Es lo que hoy no existe en ninguna vista.
4. **Índice de proyectos** — la grilla, con el lenguaje de tarjeta que ya está resuelto en
   `src/components/Webs/Webs.astro` (marco de navegador, corner ticks, tilt, badges, fecha),
   **extraído a un componente único** `WorkCard` en vez de dos implementaciones divergentes
   (`PortafolioCard` + la tarjeta inline de `Webs`). Filtros por categoría
   (`web · mobile · api · ai · backend · devops · frontend · fullstack`) y por estado.
5. **Puente al archivo** — dos tiles a `/gallery` (42 fotos / 21 diseños) con una tira de imágenes.
   Reemplaza las dos tarjetas duplicadas: el archivo se ve, no se copia.
6. **CTA** — a `/contact`, cerrando igual que las otras vistas.

## 5. Arreglos que van en el mismo paquete

- **Portadas sin `public_id` a mano**: el destacado sale del proyecto `featured`; los tiles del
  archivo, del asset más reciente de cada colección. Ninguna imagen puede quedar en blanco.
- **Copy**: acentos y frases completas («Aquí están mis estrategias de marketing y los proyectos
  que salieron de ellas»).
- **LCP**: la portada del caso destacado con `loading="eager"` y `fetchpriority="high"`.
- **`Header.astro`** deja de usarse en `/portafolio` (sigue vivo en blog/404 si aplica).
- **Redirects** en `astro.config.mjs` (`redirects`), que es donde Astro los declara para output
  estático; no hay `vercel.json` en el repo.

## 6. Fases

| Fase | Alcance | Riesgo | Visible |
| --- | --- | --- | --- |
| **F1** | Decisiones de ruta: redirects 301, borrar el slug `marketing` vacío, portadas derivadas, copy | bajo | sí, inmediato |
| **F2** | Hub con el sistema nuevo: `PageHero`, rail, caso destacado, `WorkCard` + filtros, puente a `/gallery` | medio | sí |
| **F3** | Escena del archivero en el hero (CSS 3D) | medio | sí |
| **F4** | Casos de marketing desde el blog — **solo si lo aprobás** | bajo | sí |

F1 arregla lo que hoy está roto sin tocar el diseño. F2 es el rediseño real. F3 y F4 son
decisiones aparte, para no meterlas en el mismo paquete que el resto.

## 7. Verificación

- `bun check`, `bun lint`, `bun build`.
- Recorrido: `/portafolio`, `/portafolio/webs`, `/gallery`, `/portafolio/fotografia` (debe dar 301),
  `/portafolio/marketing` (301 o 404, nunca vacío), y 390 px de ancho.
- Cero imágenes rotas: cada tarjeta y cada tile con portada real.
- Navegación por teclado: el cajón y las tarjetas se abren con foco, no solo con hover.

## 8. Riesgos

- Redirigir `/portafolio/fotografia` rompe enlaces externos **si se hace con 404**; con 301 no se
  rompe nada. Es el único cambio con efecto fuera del repo, y por eso va primero y aislado.
- Extraer `WorkCard` toca `/portafolio/webs`, que hoy funciona: se hace con el mismo markup y se
  revisa esa página antes de seguir.
- La escena del archivero es lo único puramente visual: va al final, separada, para poder
  revertirla sin arrastrar el resto.

## 9. Lo que no propongo

- Otro canvas con física. Esta página es un índice; la escena de Education y la de Experience ya
  cubren ese registro.
- Un CMS nuevo: los proyectos ya son markdown en `src/content/projects/` (11 archivos) y Tina
  cubre el blog.
- Mantener `/portafolio/diseno` y `/portafolio/fotografia` «por si acaso»: son las dos rutas que
  hacen que esta página parezca un menú de otra página.

## 10. Ejecutado

F1 y F2 están implementadas; F3 se entregó en su forma barata (CSS puro) y F4 queda pendiente de
una decisión. Se mantiene lo aprobado con cuatro desvíos, todos medidos:

1. **Titular en inglés (`Selected Work`).** «Seleccionado» a `text-[15vw]` desbordaba 39 px en
   390 px de ancho y el `overflow-hidden` del hero lo recortaba. Las otras tres vistas ya usan
   líneas en inglés con subtítulo en español.
2. **Rail de 3 secciones** (Caso destacado · Índice · Archivo) en vez de 4: un bloque «Proceso»
   aquí duplicaría `principles`, que ya se renderiza completo en `/gallery`.
3. **`/portafolio/marketing` va a 301 al blog**, no se construyó el caso de estudio (era F4).
4. **Portadas en `object-contain`** dentro de una bandeja oscura, no recortadas a 16/10: la
   portada del destacado (`horas-trabajo.png`) es un screenshot de móvil de 390×844 y el recorte
   la ampliaba 1,7×.

### Archivos

Nuevos: `src/pages/portafolio/index.astro`, `src/pages/portafolio/webs.astro`,
`src/components/ui/WorkCard.astro`, `src/components/sections/portfolio/WorkIndex.astro`,
`src/components/sections/portfolio/FlatFileHero.astro`, `src/utils/projectCategories.ts`.

Modificados: `astro.config.mjs` (3 redirects), `src/components/ui/PageHero.astro`
(`background="flatfile"`), `src/components/sections/GalleryTeaser.astro` (enlace a `/gallery`).

Borrados: `src/pages/portafolio/[...slug].astro`, `src/components/Webs/Webs.astro`,
`src/components/Portafolio/Portafolio.astro`, `src/components/PortafolioCard.astro`,
`src/components/Gallery.astro`.

### Verificación observada

- `bun check`: 0 errores. `bun lint`: 7 errores, todos preexistentes en
  `ChatbotWidget.tsx`, `ExperienceStickyScroll.tsx` y `CleanFilmGrid.tsx`; ninguno en archivos
  tocados.
- `bun run build`: 46 páginas, sin errores. `.vercel/output/config.json` contiene los tres 301 con
  su `Location`.
- Hero medido a 1440/1280/1024/390: el titular no se cruza con el archivero (derecha del texto
  537 / 484 / 400 px contra un cajón que arranca en 943 / 784 / 563 px) y `scrollWidth` iguala al
  viewport en los cuatro anchos.
- Filtros: 12 tarjetas → 7 al pulsar «Web» → 12 en «Todos», con `aria-pressed` y contador
  sincronizados.
- Las 16 imágenes de la página cargan tras recorrerla (0 portadas vacías); las que parecían rotas
  eran `loading="lazy"` que nunca entraron en viewport al saltar directo al fondo.

### Pendiente

- F4: casos de estudio de marketing desde el blog.
- Commit y push: decisión de Steve.
