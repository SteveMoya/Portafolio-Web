# Auditoría de diseño — /education

Fecha: 2026-11-02 · Rama: `redesign/personalblog-v2`
Método: skill `frontend-design` (jerarquía, tipografía, color, espaciado, estados, motion) cruzada con las
reglas de `motion` y los criterios de interfaz de `web-design-guidelines`. Todo lo medido abajo sale del
DOM real servido en `localhost:4321/education` (1440×900 y 390×844) y del CSS generado por `bun run build`.

Veredicto: **0 HIGH · 4 MEDIUM · 7 LOW**. La vista se aprueba; los MEDIUM son de sistema (contraste y
escala tipográfica), no de esta pantalla sola.

---

## 1. Lo que ya está bien (con evidencia)

| criterio | evidencia |
| --- | --- |
| Paleta limitada | 3 colores en toda la vista: `#0a0a0a`, `#c70039`, `#b11141` |
| Contraste del cuerpo | `text-white/60` sobre `#0a0a0a` = **7.3:1** (AA y AAA) |
| Foco visible | anillo `#c70039` en pills, tarjetas, anclas, `summary` y buscador |
| Sin JS | 3 entradas del timeline, 6 tarjetas, contador y `details` nativos se renderizan completos |
| Reduced motion | `.reveal`, `.io-reveal`, `.spine-draw`, `.hero-drift`, contador y pulso quedan inertes |
| Overflow horizontal | **0 px** a 390 y 1440 |
| Presupuesto de motion | press 120 ms, hover 150–220 ms, `details` 220 ms, pulso 260 ms |
| Semántica | `nav` con `aria-label`, `aria-current="location"`, `aria-live` con debounce, `time datetime` |

---

## 2. Hallazgos

### M-1 · MEDIO — La capa de texto secundario no llega a AA
`text-white/40` sobre `#0a0a0a` = **3.77:1**. WCAG 1.4.3 pide 4.5:1 para texto normal, y acá se usa en
texto de 10–12 px: `src/components/ui/SectionHeading.astro:36`, `src/components/ui/PageHero.astro:86`,
`src/pages/education.astro:158`, `:184`, `:193`, `:242`, `:250`,
`src/components/sections/EducationTimeline.astro:66`.

Reemplazo: `text-white/55` (**6.28:1**) para eyebrows/fechas/hints. `white/45` queda en 4.48:1, justo
por debajo; no sirve.

### M-2 · MEDIO — El acento se usa como texto pequeño
`#c70039` sobre `#0a0a0a` = **3.29:1**, y sobre su propio tinte al 10 % = **3.18:1**. Pasa el mínimo de
3:1 solo para texto grande (≥18.66 px bold o ≥24 px). Hoy aparece en 10 px:
`src/pages/education.astro:295` (“Ver credencial”) y `src/components/sections/EducationTimeline.astro:98` (chip GPA).

Reemplazo: el chip GPA pasa a `bg-[#c70039]` con texto blanco (**6.02:1**); “Ver credencial” queda en
`text-white/60` y toma el acento solo en hover. Si se quiere acento legible en tamaño chico, el tono
tendría que ser `#ff5c7a` (**6.66:1**), que es otro color de marca: decisión tuya, no mía.

### M-3 · MEDIO — No hay escala tipográfica ni de tracking
12 tamaños distintos (9, 10, 12, 14, 16, 20, 24, 36, 48, 60, 72 px + las tres medidas `vw` del hero) y
**7 valores de tracking** (0.1 / 0.14 / 0.18 / 0.2 / 0.24 / 0.28 / 0.3 em). `frontend-design` pide 3–4
tamaños con propósito; acá hay un tamaño nuevo casi por elemento.

Reemplazo propuesto: 5 pasos (`10 / 12 / 14 / 20 / display`) y 3 trackings (`0.2 / 0.25 / 0.3 em`).
Cada valor actual se mapea a uno de esos sin cambiar el diseño, solo la consistencia.

### M-4 · MEDIO — Tres ejes de alineación en la misma pantalla
El hero va centrado (`align="center"`), el índice de secciones va a la izquierda y los títulos de
sección también. En 1440 se lee como tres retículas distintas: la marca del hero no se repite en el
resto de la página. Es el hallazgo más visible a ojo, y el más barato de corregir: centrar el índice
bajo el hero, o volver el hero a la izquierda como `/skills`.

### L-1 · BAJO — El offset del rail sticky está acoplado al navbar
`src/pages/education.astro:75` usa `top-16`, que es exactamente la altura de `src/layouts/Navbar.astro:39`
(`h-16`). Si el navbar cambia, el rail se superpone. Un `--nav-h` compartido lo resuelve.

### L-2 · BAJO — Ritmo vertical asimétrico entre secciones
`#certificaciones` no tiene `padding-top` (`:138`), así que el salto desde el timeline es de **185 px**
mientras el resto de los cortes usa **224 px** (112 + 112). Agrupa certificaciones con el timeline, lo
cual es defendible, pero hoy es un accidente de padding y no una decisión escrita.

### L-3 · BAJO — Transiciones de color de 150–300 ms en hover
`motion-instant-hover-color`: el color de hover no debería transicionar. Las dos del CTA ya bajaron a
200 ms con `transition` (antes `transition-all`). Quedan las de tarjetas y pills (150 ms), menores.

### L-4 · BAJO — Objetivos táctiles por debajo del cómodo
Medidos: pill 33 px, buscador 37 px, limpiar 32 px, rail 43 px, botón de entidad 28 px, `summary` 28 px.
Pasan el mínimo AA 2.5.8 (24 px), no el cómodo de 44 px.

### L-5 · BAJO — El estado vacío no se anuncia como estado
`data-cert-empty` solo se destapa. La región `aria-live` ya dice “0 entradas”, así que el mensaje llega;
`role="status"` en el párrafo lo haría explícito.

### L-6 · BAJO — Números decorativos a `white/30`
**2.61:1**. Aceptable solo porque están `aria-hidden` (`:91` del timeline y los índices del rail). Si
alguna vez cargan información, hay que subirlos.

### L-7 · BAJO — Sin JS no hay anuncio del contador
El número visible es `aria-hidden` y el anuncio vive en `data-cert-live`, que el script rellena. Sin JS
queda vacío (el número y las tarjetas siguen visibles). Es correcto; se anota para que no sorprenda.

---

## 3. Corregido durante esta pasada (no son hallazgos abiertos)

1. El contador pulsaba **en cada tecla** del buscador (`motion-no-motion-on-repeat`). Ahora solo al
   cambiar de filtro.
2. El contador animaba dentro de `aria-live` → un lector de pantalla leía cada dígito. El número pasó a
   `aria-hidden` y el anuncio a una región aparte con debounce de 350 ms.
3. `.reveal` no respetaba `prefers-reduced-motion`: quedaba a media opacidad con el `fill: both`. Ahora
   se apaga entero.
4. `transition-all` en los dos CTA del cierre → `transition` (propiedades nombradas).
5. `.tap:active` 0.97 → **0.98** y `.hover-lift` 350 ms → **220 ms** (reglas `motion-press-scale` y
   presupuesto de hover).
6. El rail móvil no avisaba que se desbordaba (202 px ocultos a 390 px): se agregó un degradado de borde
   que desaparece al llegar al final, y `aria-current="location"` en el enlace activo.

---

## 4. Notas de contenido (no son defectos de diseño)

- Los 6 certificados de `cv.json` **no tienen URL**: ninguna tarjeta puede abrir la credencial, y por eso
  la acción de la tarjeta es filtrar por entidad. El día que se carguen las URLs, las tarjetas pasan a
  ser enlaces y el botón de entidad desaparece solo (la rama ya existe).
- `src/data/education.ts` tercera entrada sigue siendo copy de relleno (“Coming Soon / Always eager…”).
- `languages` (2) e `interests` (1 grupo, 2 keywords) son datos pobres: no se agregaron barras de nivel
  ni cifras porque no existen en la fuente.
- `src/components/sections/EducationStickyScroll.tsx` quedó sin uso (el timeline ahora es Astro).

---

## 5. Checklist `frontend-design`

| criterio | estado | nota |
| --- | --- | --- |
| Escala tipográfica definida y consistente | ✗ | M-3: 12 tamaños, 7 trackings |
| Paleta limitada con reglas de uso | ✓ | 3 colores, acento reservado a foco/estado |
| Espaciado sobre grid | ✓ | múltiplos de 8 (24/40/80/112) |
| Estados interactivos definidos | ✓ | hover, press, focus-visible, disabled, vivo |
| Breakpoints probados | ✓ | 390 / 768 / 1440, 0 overflow |
| Modo claro/oscuro | n/a | tema único oscuro |
| Guía de motion | ✓ tras correcciones | todo ≤ 300 ms salvo el reveal de entrada (360 ms) |

---

## 6. Prioridad sugerida

1. M-2 (acento en texto chico) — 2 líneas, mejora inmediata de legibilidad.
2. M-1 (`white/40` → `white/55`) — 7 lugares, toca componentes compartidos: decidir si se cambia en toda
   la casa o solo en esta vista.
3. M-4 (alineación hero/rail) — decisión de diseño, 1 atributo.
4. M-3 (escala de tipos y tracking) — trabajo de sistema, conviene hacerlo junto en las cuatro vistas.
5. L-1 a L-7 — deuda menor, sin impacto en uso.
