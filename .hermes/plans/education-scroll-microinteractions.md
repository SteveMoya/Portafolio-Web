# Plan — /education: coreografía de scroll, microinteracciones y auditoría de diseño

Branch: `redesign/personalblog-v2`
Scope: `src/pages/education.astro`, `src/components/ui/PageHero.astro` (solo prop opcional),
`src/components/sections/EducationStickyScroll.tsx` (reemplazo), nuevo
`src/components/sections/EducationTimeline.astro`, `src/styles/global.css` (primitivas compartidas).
Fuera de alcance: `/`, `/about`, `/skills`, `/experience`, `/gallery`, `src/data/*`, `cv.json`.

Fecha: 2026-11-02

---

## 0. Estado actual medido

| bloque | markup | movimiento hoy |
| --- | --- | --- |
| Hero | `PageHero` sin `align`/`background` (las otras vistas usan variantes) | estático |
| Trayectoria académica | `EducationStickyScroll.tsx` (isla React, 3 tarjetas, una es placeholder "Coming Soon") | solo `hover-lift` + `whileHover` |
| Archivo de certificaciones | search + pills + contador + grid 2 col (6 certificados) | `pulseCounter` en cada `input`, sin reveal |
| Idiomas e intereses | 2 tarjetas + 1 grupo con 2 keywords | estático |
| Aprendizaje continuo | 3 posts reales | `.reveal` (scroll-driven CSS) |
| CTA final | `BlockReveal` | wipe GSAP |

Datos reales disponibles (nada se inventa): `src/data/education.ts` (3), `cv.json certificates` (6),
`cv.json languages` (2: English/Intermediate, Spanish/Native Speaker), `interests` (1 grupo: Technology),
3 posts vía `getPosts(3)`. **No hay niveles numéricos de idioma ni premios**, así que no habrá barras
de porcentaje ni cifras nuevas: solo se anima lo que ya existe.

Primitivas ya disponibles: `.reveal`, `.bar-grow`, `.hover-lift`, `.tap`, `.marquee`, `BlockReveal`,
`ScrollReveal`, `initMotion()` (GSAP + ScrollTrigger + Lenis) en `src/lib/motion.ts`.

---

## 1. Fase 1 — animaciones y elementos interactivos con scroll

### S1. Trayectoria académica como timeline de scroll (pieza central)

Reemplazar las 3 tarjetas estáticas por un timeline server-rendered en Astro
(`EducationTimeline.astro`), mismo lenguaje que el spine de `/experience`:

- riel de año sticky por entrada (`2022`, `2021`, `2020`) con el año que se enciende en `#c70039`
  cuando el bloque cruza la banda central (IntersectionObserver, mismo patrón que
  `experience.astro:467`).
- columna vertebral de 1 px que se dibuja con el scroll: gradiente `#c70039 → white/15 → transparent`
  y `scaleY` ligado a `animation-timeline: view()` (CSS puro; sin JS, con fallback a altura completa).
- cada entrada revela con retardo escalonado por índice (`--i`), sin `opacity: 0` en el HTML del
  servidor: la animación arranca en `entry 0%` y el contenido es legible sin JS.
- detalle por entrada como `<details>` accesible (`achievements` + `activities` como chips):
  abrir/cerrar con transición de altura real, no un panel React.
- estado "en curso" (`isOngoing`) como indicador pulsante **solo si** `prefers-reduced-motion` no
  está activo; el texto "Actual" siempre visible.

Se elimina la isla React de esta vista: `EducationStickyScroll.tsx` queda sin uso (ver §6).

### S2. Riel de progreso de lectura

Barra de 2 px en `#c70039`, `position: fixed` al borde superior, `transform: scaleX()` con
`animation-timeline: scroll(root block)`. Sin JS, sin layout shift, oculta en `prefers-reduced-motion`
(queda al 0%). No compite con el navbar: se dibuja debajo de él, no encima.

### S3. Índice de secciones sticky (navegación in-page)

Rail horizontal bajo el navbar con 4 anclas (`Trayectoria`, `Certificaciones`, `Idiomas`, `Blog`):
- anclas reales (`href="#trayectoria"`), no botones.
- sección activa por IntersectionObserver (`rootMargin: '-25% 0px -60% 0px'`), subrayado animado.
- `scroll-margin-top` en cada sección para que el ancla no quede bajo el navbar.
- oculto por debajo de `md`; en móvil no se agrega un menú nuevo (el navbar ya cubre navegación).

### S4. Archivo de certificaciones: reveal escalonado

Las tarjetas entran con `--i` y `animation-range` desplazado por índice (CSS scroll-driven), sin
`opacity: 0` en SSR. Al filtrar, las tarjetas visibles re-entran con un fade+lift de 180 ms y las
ocultas salen sin animación (evita pelear con el filtro).

### S5. Contador que cuenta

El número del contador hace count-up **una sola vez**, cuando la sección entra en viewport
(`IntersectionObserver` + `requestAnimationFrame`, 450 ms, easings del sistema). En cambios de filtro
solo se actualiza el valor; no se re-anima en cada tecla (ver M1).

### S6. Hero con entrada de scroll (opt-in, no global)

`PageHero` gana una prop opcional `motion?: 'static' | 'parallax'` (default `static`, así
`/skills`, `/gallery`, `/experience` no cambian):
- `parallax`: las dos líneas del display se desplazan ±12 px con `animation-timeline: view()`
  y el `meta` rail revela sus ítems escalonados.
- El hero de `/education` pasa a `align="center" background="pattern"` **solo si se aprueba**
  (default propuesto: sí, para alinear con `/experience`).

### S7. Idiomas e intereses

- Regla horizontal que se dibuja al entrar (`scaleX` con `view()`), corner ticks que aparecen.
- Fluency como etiqueta que se revela al hover/focus dentro de la tarjeta (wipe de 160 ms).
- Chips de intereses con entrada escalonada; sin datos nuevos.

---

## 2. Fase 2 — microinteracciones (presupuesto: ≤ 300 ms, easing del sistema)

| # | elemento | microinteracción | regla |
| --- | --- | --- | --- |
| M1 | buscador | `/` enfoca, `Escape` limpia y devuelve foco, botón de limpiar con cross-fade; **sin pulso en cada tecla** | `motion-no-motion-on-repeat` (hoy el contador pulsa en cada `input`) |
| M2 | pills de entidad | press a `scale(0.98)`, indicador activo, `aria-pressed` ya existe | `motion-press-scale` |
| M3 | tarjetas de certificado | corner ticks se dibujan al hover, icono +4 px, flecha desliza, borde `#c70039/40` | transiciones por propiedad, nunca `all` |
| M4 | grid de certificados | roving tabindex: flechas mueven foco, `Home`/`End` a extremos | `motion-gesture-alternative` (todo gesto tiene equivalente de teclado) |
| M5 | estado vacío | entra con fade+lift 180 ms y anuncia en la región `aria-live` ya existente | feedback inmediato |
| M6 | foco visible | anillo `#c70039` en pills, tarjetas, anclas y details; área táctil ≥ 44 px | a11y |
| M7 | presupuesto de motion | 120–180 ms press/hover, 180–260 ms cambios de estado, curva `cubic-bezier(0.23, 1, 0.32, 1)` | `motion-under-300ms`, `motion-strong-ease-out` |

Todas degradan a estado estático legible con `prefers-reduced-motion: reduce` y sin JS.

---

## 3. Fase 3 — auditoría de diseño (solo lectura)

Con la skill `frontend-design` (+ `motion` y `web-design-guidelines` como criterios de motion y de
interfaz), sobre la vista ya implementada:

- jerarquía y escala tipográfica (¿3-4 tamaños con propósito?), ritmo vertical, grid de 8 px;
- uso del color (2-3 colores + neutrales; el acento solo en CTA y foco);
- consistencia con el sistema de las otras vistas (eyebrow, `font-poppins font-black uppercase`,
  `.dotted-card`, corner ticks);
- motion: duración, easing, `transition: all`, motion repetido, reduced motion;
- a11y: foco, contraste, landmarks, `aria-live`, teclado, área táctil;
- responsive 390 / 768 / 1440 y overflow horizontal.

Entrega: `.hermes/plans/education-design-audit.md` con hallazgos `archivo:línea — [regla] qué está mal`,
severidad HIGH/MEDIUM/LOW y el reemplazo exacto. **La auditoría no aplica cambios por sí sola**:
los fixes se ejecutan en una ronda aparte si los pedís.

---

## 4. Verificación

| check | comando / método | condición de paso |
| --- | --- | --- |
| tipos | `bun run check` | 0 errores (baseline: 0 errores / 15 hints) |
| lint | `bun run lint` | sin errores nuevos (baseline: 7, todos preexistentes) |
| build | `bun run build` | exit 0, 49 páginas |
| guard de tokens | grep de paletas ajenas (`slate-`, `sky-`, `cyan-`, `bg-background`, `text-foreground`) en los archivos tocados | 0 |
| CSS generado | `dist/_astro/*.css` | sin `.bg-slate-900` / `.text-sky-300` |
| SSR sin JS | preview con JS deshabilitado | timeline, tarjetas y contador legibles |
| reduced motion | emular `prefers-reduced-motion: reduce` | sin desplazamientos; todo visible |
| teclado | tab + flechas en el grid, `/` y `Escape` en buscador | todo operable, foco visible |
| viewports | capturas 1440×900 y 390×844 | 0 overflow horizontal fuera de `.marquee` |
| filtros | búsqueda + entidad combinadas, sin resultados | contador, singular/plural y estado vacío correctos |

Riesgo: **medio-bajo**. Se toca markup de una sola vista + una prop opcional de un componente
compartido con default inerte. Sin cambios en datos, rutas, layout ni tema.

---

## 5. Fuera de alcance (se reporta, no se toca)

- `src/data/education.ts` tercera entrada es copy placeholder ("Coming Soon / Always eager to expand…").
- `languages` (2) e `interests` (1 grupo, 2 keywords) son datos pobres: no se rellenan con cifras inventadas.
- Footer "Steve Moya Copeda" y los 7 errores de lint preexistentes.

---

## 6. Decisiones (default si aprobás)

1. **Hero**: `align="center" background="pattern"` como `/experience` (default) — o se queda alineado
   a la izquierda como hoy.
2. **`EducationStickyScroll.tsx`**: queda en el repo sin uso (default, igual que los otros duplicados
   muertos de la Fase 6 del plan anterior). Borrarlo requiere aprobación explícita.

---

## 7. Resultado (ejecutado)

Archivos: `src/pages/education.astro`, `src/components/sections/EducationTimeline.astro` (nuevo),
`src/components/ui/PageHero.astro` (prop `motion`), `src/styles/global.css` (primitivas).

Implementado: timeline Astro con spine dibujado por scroll y año sticky iluminado; riel de progreso de
lectura; índice de secciones sticky con `aria-current` y degradado de desborde en móvil; reveal por
IntersectionObserver armado solo bajo el fold (sin `opacity:0` en SSR); contador con count-up único;
botón de entidad en cada tarjeta para filtrar desde el contenido; `/` enfoca el buscador; flechas
recorren las acciones de las tarjetas; `details` nativo con altura animada donde hay `::details-content`.

Medido en dev (1440×900): alto 5 434 px, progreso 0 → 0.70 a 3 200 px, hero drift −18 px, spine
0.02 → 1 al cruzar el bloque, riel activo correcto en 0/900/1700/2400/3100/4534 px, 0 overflow a 390 px,
14/14 `[data-reveal]` resueltos, contador 0→6 al entrar, pulso solo en click de pill, filtro por entidad
desde tarjeta ✓, flechas y `Home`/`End` ✓, `/` y `Escape` ✓, `details` 258 → 362 → 258 px.

Verificación: `bun run check` 0 errores / 0 warnings / 15 hints; `bun run lint` 7 errores (los 7
preexistentes, todos fuera de esta vista); `bun run build` exit 0, 49 páginas; guard de tokens ajeno 0 en
la vista; sin JS las 3 entradas, 6 tarjetas, contador y `details` se renderizan completos; con
`prefers-reduced-motion` nada se mueve y todo queda visible; `/experience` sigue hidratando y expandiendo.

Riesgo: **bajo**. Sin cambios en datos, rutas, layout ni tema; `PageHero.motion` es opt-in con default
`static`, así que `/skills`, `/gallery` y `/experience` no cambian (verificado: 0 elementos `.hero-drift`
en esas tres rutas).

Auditoría de diseño: `.hermes/plans/education-design-audit.md` (0 HIGH · 4 MEDIUM · 7 LOW).

### Extracción a componentes compartidos (posterior)

Al replicar el trabajo en `/skills` el riel y el reveal se movieron a `src/components/ui/SectionRail.astro`
y `src/components/ui/ScrollReveals.astro`, y `/education` pasó a usarlos (se borraron 122 líneas
duplicadas de su script). Se sumó `--nav-h` en `:root` para que el rail no dependa de `top-16` a mano.
`ScrollReveals` incluye una red de seguridad: cualquier elemento `[data-reveal]` que un salto de ancla
haya dejado atrás sin cruzarse se resuelve en el siguiente frame de scroll. Verificado después del
refactor: `/education` mantiene 4 enlaces de rail, 14 reveals y el contador sigue contando.
