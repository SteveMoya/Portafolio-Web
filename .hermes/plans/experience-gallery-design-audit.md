# Auditoría de diseño — /experience y /gallery

Fecha: 2026-11-02 · Rama: `redesign/personalblog-v2`
Método: skill `frontend-design` + reglas de `motion` + criterios de interfaz. Medido en el DOM servido
(`localhost:4321`) a 1440×900 y 390×844, y en el CSS de `bun run build`.

Veredicto: **0 HIGH · 5 MEDIUM · 6 LOW** entre las dos vistas.

---

# /experience

Alto medido: **3 918 px** a 1440, **4 826 px** a 390. Índice de 3 secciones, 8 reveals, 0 overflow.

## Lo que ya está bien

Timeline con spine sticky y año que se enciende al cruzar la banda (2025 → 2024 → 2023, verificado
offset por offset), filtro por tipo con `aria-pressed`, tarjeta expandible con teclado y foco visible,
marquee que pausa en hover, CTA con `BlockReveal`.

## Hallazgos

### M-1 · MEDIO — `white/40` en 12 lugares
**3.77:1** sobre `#0a0a0a`. Eyebrows, rangos de fecha (`experience.astro:253`), metadatos de los
cross-links (`:357`), etiqueta del filtro (`:195`). Reemplazo: `text-white/55` (**6.28:1**).

### M-2 · MEDIO — La sección de números no tiene encabezado
`experience.astro:301` abre `<section id="numeros">` con tres tarjetas y ningún `h2`. El índice de la
página salta a un bloque sin título y la estructura de encabezados pasa de `h2` (cronología) a `h3`
(tarjetas) sin nodo intermedio. Es decisión editorial: falta el texto, no el componente.

### M-3 · MEDIO — El año queda sin estado en los extremos
Medido: a `scrollY=900` ningún año está encendido (los grupos empiezan en 532 px, fuera de la banda
20–45 %); a `scrollY=2100` tampoco (todos ya pasaron). La banda es correcta; el borde no. Arreglo
barato: mantener encendido el último año que estuvo en banda hasta que entre el siguiente.

### L-1 · BAJO — Escala tipográfica de 17 tamaños
Contando también `ExpandableExperienceCard.tsx`. El tracking sí está acotado (3 valores: 0.2/0.25/0.3).

### L-2 · BAJO — Pills de filtro de 33 px
Pasa AA (24 px), no el cómodo de 44.

### L-4 · BAJO — El año se mete bajo el rail al terminar su grupo
Medido a `scrollY=1500`: la celda sticky del año mide 87 px y su grupo 241 px, así que al final del
grupo el año queda en `top: 86` mientras el rail termina en 109. Se desliza bajo el rail los últimos
~25 px de cada grupo. Es geometría del contenedor, no del offset: acortar el grupo o hacer el año
`static` lo cambiaría; con el offset en `112` el roce es el mínimo posible.

### L-3 · BAJO — El CTA cierra sin `BlockReveal` alineado al resto
Usa `triggerStart="top 98%"`, correcto; solo se anota que es el único bloque con wipe GSAP en la página,
mientras los títulos usan `ScrollReveal`. Dos lenguajes de entrada conviviendo.

## Corregido en esta pasada

Riel de progreso · índice de 3 secciones con `aria-current` · hero `motion="scroll"` · `ScrollReveal`
(word scrub) en el título · spine que se dibuja en vez de gradiente estático · reveal por tarjeta con
`--i` · count-up de las 3 cifras (03/17/02) · **`aria-live` del filtro** (“1 puesto” / “3 puestos”) ·
`transition-all` fuera de los 2 CTA · año sticky con `calc(var(--nav-h)+3rem)` en vez de `top-24`.

---

# /gallery

Alto medido: **6 579 px** a 1440, **10 650 px** a 390. Índice de 4 secciones, 8 reveals, 0 overflow.

## Lo que ya está bien

`CleanFilmGrid` es la pieza más completa de las cuatro vistas: filtro por colección con `aria-pressed`,
conmutador grid/filas, contador `n / total` con `aria-live`, scroll horizontal por categoría y lightbox
con flechas, `Home`/`End` y cierre con `Escape`. El archivo se sirve completo sin JS.

## Hallazgos

### M-1 · MEDIO — `scroll-behavior: smooth` global desde una página
`gallery.astro:408` aplica `scroll-behavior: smooth` a `html` mientras se está en `/gallery`. La página
ya corre sobre Lenis (`src/lib/motion.ts`), que anima el scroll por JS: dos interpoladores sobre el mismo
eje. Los saltos del índice nuevo pasan por los dos. Reemplazo: quitar el `:global(html)` y dejar que
Lenis haga el suavizado, o `scroll-behavior: auto` y animar el ancla a mano.

### M-2 · MEDIO — 19 `transition-all` en la isla del archivo
`CleanFilmGrid.tsx` usa `transition-all duration-300` en 19 nodos (pills `:240`, botones de vista `:263`,
`:278`, enlaces de categoría `:306`, controles del lightbox `:343`, `:354`, overlays `:401`, `:414`).
`transition-all` anima propiedades que nadie pidió (layout, color de borde, sombra) y es la regla
`motion-name-the-properties` repetida diecinueve veces. No lo toqué: es la isla que verifiqué menos.

### M-3 · MEDIO — `white/40` en 6 lugares
**3.77:1**: etiqueta “Última historia” (`gallery.astro:246`), metadatos del destacado (`:260`), labels de
las stats (`:251`). Mismo reemplazo que en el resto: `white/55`.

### L-1 · BAJO — El marquee de colecciones repite los pills del archivo
Los nombres de colección salen dos veces en la misma pantalla: la tira decorativa (`:127`) y los filtros
de la grilla. La tira es `aria-hidden`, así que no rompe nada; compite en jerarquía.

### L-2 · BAJO — Escala tipográfica de 15 tamaños
Sumando la isla. Tracking acotado (0.3em y 3px).

### L-3 · BAJO — Contraste decorativo del número de proceso
`text-white/10` sobre `#0a0a0a` ≈ **1.3:1**. Es `aria-hidden` y funciona como textura, no como dato:
correcto mientras no cargue información.

### L-4 · BAJO — El lightbox no se auditó en profundidad
Leí su interfaz y su manejo de teclado, no sus 461 líneas completas. Queda como *no verificado* en
profundidad, no como aprobado.

## Corregido en esta pasada

Riel de progreso · índice de 4 secciones · hero `motion="scroll"` + `center`/`pattern` (era la única
vista alineada a la izquierda) · `ScrollReveal` en los 3 títulos · reveal con `--i` en las 4 filas del
proceso, las 3 stats y el destacado · count-up de las 3 cifras (62/41/21) · hover de fila del proceso
cambiado de “escala la fila entera” a barra de acento que crece + número que se enciende ·
`transition-all` fuera de los 2 CTA · flechas del destacado de `scale` a desplazamiento.

---

## Checklist `frontend-design`

| criterio | experience | gallery |
| --- | --- | --- |
| Escala tipográfica definida | ✗ 17 tamaños | ✗ 15 tamaños |
| Paleta limitada | ✓ | ✓ |
| Espaciado sobre grid | ✓ | ✓ |
| Estados interactivos | ✓ | ✓ (+ lightbox) |
| Breakpoints probados | ✓ 0 overflow | ✓ 0 overflow |
| Guía de motion | ✓ tras correcciones | ✗ M-2 en la isla |
| Reduced motion | ✓ | ✓ |

## Prioridad

1. **M-2 de gallery** (19 `transition-all`): es el mayor incumplimiento de motion que queda en el sitio.
2. **M-1 de gallery** (`scroll-behavior` global): riesgo de doble suavizado con Lenis.
3. **M-3 de experience** (año sin estado en los extremos) y **M-2** (sección sin `h2`).
4. Contraste `white/40` (M-1 en ambas): decisión de sistema, junto con las otras dos vistas.
