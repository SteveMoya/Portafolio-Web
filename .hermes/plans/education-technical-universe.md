# Plan — "Technical Universe" (física de palabras) en la vista de logros

Branch: `redesign/personalblog-v2`
Origen: `https://github.com/Arfazrll/PersonalBlog` → `src/app/achievements/page.tsx` (líneas 1015-1059) + `src/components/effects/FallingText.tsx`

---

## 1. Suposición de alcance (verificar antes de ejecutar)

No existe una ruta `/achievements` en este repo. La vista de logros es **`/education`**
(`src/pages/education.astro`), que es justamente la portada de
`achievements/page.tsx` según `.hermes/plans/redesign-4-vistas.md` §1.4
("`achievements/page.tsx` (→ our Education)"). Todo este plan asume eso.

Si "achievement" significa otra cosa (una ruta nueva `/achievements`, por ejemplo),
el plan cambia en el paso 4 y hay que decirlo antes de empezar.

---

## 2. Qué es realmente la sección "Technical Universe"

No es un efecto decorativo de texto: es un **motor de física 2D** (`matter-js`) donde
cada palabra se convierte en un cuerpo rígido.

Comportamiento exacto del original (`FallingText.tsx`, 276 líneas):

| Pieza | Cómo funciona |
| --- | --- |
| Render | El texto se inyecta como `<span>` inline en un contenedor de alto fijo (`h-[400px]`). |
| Cuerpos | Cada span se mide con `getBoundingClientRect()` y se convierte en `Bodies.rectangle(x, y, w, h)`. |
| Impulso inicial | `velocity.x = (random - 0.5) * 5`, `y = 0`; `angularVelocity = (random - 0.5) * 0.05` → las palabras arrancan girando y dispersándose. |
| Material | `restitution: 0.8` (rebote), `frictionAir: 0.01` (amortiguación), `friction: 0.2`. |
| Límites | 4 cuerpos estáticos invisibles: piso, techo, paredes izquierda/derecha → nada se escapa del bloque. |
| Gravedad | `engine.world.gravity.y = 0.8` (configurable). |
| Interacción | `MouseConstraint` con `stiffness: 0.2` → se puede **arrastrar** una palabra y tirarla; choca con las demás. |
| Sincronización DOM | `requestAnimationFrame` mueve cada span con `translate3d(...) rotate(...)`. Solo `transform` (sin reflow). |
| Disparador | `IntersectionObserver` (threshold 0.1): la física arranca cuando la sección entra en viewport. |
| Estética | `fontSize: 1.5rem`, `fontWeight: 900`; las palabras de `highlightWords` van en color de acento y peso 900. |

## 3. Qué NO traer del original

- **`framer-motion` para esto**: no hace falta (`useMotionValue`/`useSpring` del original
  son para el spotlight de las tarjetas, no para la física). El repo ya lo tiene, pero la
  sección solo necesita matter-js.
- **El canvas de `Matter.Render`**: el original lo crea (y es transparente, no dibuja
  nada útil) solo para poder asignarle `render.mouse`. Se puede usar el engine + runner
  sin canvas y crear el `Mouse` directamente sobre el contenedor → menos trabajo por frame.
- **`usePerformance` / low-power mode**: no existe en este repo; se reemplaza por
  `prefers-reduced-motion` + pausa fuera de viewport.
- **El texto hardcodeado en inglés** (Python, TensorFlow, LangChain, Blockchain,
  Ultralytics...). Steve no usa LangChain ni Ultralytics; inventaría un stack falso.

## 4. Diseño propuesto para `/education`

### 4.1 Ubicación

Sección nueva `id="universo"`, **después de la sección Blog y antes del CTA final**
(mismo lugar relativo que en el original: cierre del contenido). Entra al rail:

```
01 Trayectoria · 02 Certificaciones · 03 Idiomas · 04 Blog · 05 Universo técnico
```

(`railSections` ya se arma condicionalmente; se agrega una entrada más al final.)

### 4.2 Contenido

- Eyebrow `Universo técnico`, título display `Technical Universe` (el resto de las
  vistas ya mezcla titular en inglés + cuerpo en español), subtítulo en español con la
  instrucción real: *"Arrastrá una palabra y tirala. Chocan, rebotan y vuelven a caer."*
- Las palabras salen de **`src/data/skills.ts`** (dato real, no inventado). Criterio:
  todas las `expert` + `advanced`, normalizadas como etiqueta corta (Node.js → Node,
  Tailwind CSS → Tailwind, Machine Learning → ML). Aproximadamente 12-14 palabras.
- Las `expert` (`HTML/CSS`, `Astro`, `Tailwind CSS`) son las `highlightWords` → color
  `#c70039`, igual que el acento del resto del sitio.

### 4.3 Componente

`src/components/sections/education/TechUniversePhysics.tsx` — isla React, `client:visible`.

Reglas de implementación:

1. **SSR primero**: el marcado del servidor muestra las palabras como texto normal
   (estáticas, legibles, sin `opacity: 0`). Lección del plan anterior: un `initial={{opacity:0}}`
   dejó bloques en blanco hasta hidratar.
2. **Carga diferida del motor**: `const Matter = await import('matter-js')` dentro del
   `useEffect`, no en el import de módulo. matter-js (~26 KB gzip) no entra en el bundle
   inicial de la isla; solo se descarga cuando la sección está a punto de verse.
3. **Arranque por viewport**: `IntersectionObserver` (threshold 0.15) → engine + runner
   arrancan; **al salir del viewport se pausa el runner** (no se destruye el mundo). Es la
   mejora sobre el original, que deja el rAF y el runner corriendo el resto de la página.
4. **Sincronización**: un solo `rAF` que escribe `transform` en cada span. Nada de `left/top`.
5. **Redimensionado**: `ResizeObserver` sobre el contenedor → `Engine.clear` + reconstrucción
   de cuerpos con las medidas nuevas (el original se rompe si cambia el ancho, porque los
   límites y cuerpos quedan con las medidas viejas).
6. **Pointer fino vs. coarse**: con `(pointer: fine)` se activa `MouseConstraint` (arrastrar).
   Con `(pointer: coarse)` NO se activa: capturar `touchmove` rompe el scroll vertical en
   móvil. En su lugar, un botón `Sacudir` (real `<button>`) aplica el impulso a todas las
   palabras — es además la alternativa de teclado que el original no tiene.
7. **`prefers-reduced-motion: reduce`**: no se instancia matter-js en absoluto; las palabras
   quedan como bloque de texto envuelto y el botón desaparece. Cero movimiento.
8. **A11y**: la capa visual va `aria-hidden="true"`; encima, un `<p class="sr-only">` con la
   lista real de tecnologías. El botón `Sacudir` tiene `focus-visible` con el acento.
9. **Contenedor**: `h-[320px] sm:h-[400px]`, `overflow-hidden`, fondo `#0a0a0a`, borde
   `white/10` + `.dotted-card` como las demás tarjetas de la vista, `touch-action: pan-y`.

### 4.4 Dependencias

```
bun add matter-js@0.20.0
bun add -d @types/matter-js@0.20.2
```

Única dependencia nueva. Se instala con bun (lockfile canónico del repo).

## 5. Archivos tocados

| Archivo | Acción |
| --- | --- |
| `package.json`, `bun.lock` | + `matter-js`, `@types/matter-js` |
| `src/components/sections/education/TechUniversePhysics.tsx` | nuevo (~230 líneas) |
| `src/pages/education.astro` | sección nueva (~45 líneas) + entrada del rail |
| `src/styles/global.css` | solo si hace falta un utility para la capa física (probablemente no) |

No se toca `Layout.astro`, `Navbar`, `cv.json`, ni `src/data/*`.

## 6. Verificación (definition of done)

| check | comando | pasa si |
| --- | --- | --- |
| tipos | `bun run check` | 0 errores (baseline: 0 errores / 15 hints) |
| lint | `bun run lint` | 7 errores pre-existentes y ninguno nuevo |
| build | `bun run build` | exit 0 |
| peso | comparar `dist/_astro/*.js` | matter-js en chunk aparte, no en el entry |
| navegador real (1440x900) | dev server + browser | las palabras caen, chocan y se pueden arrastrar; 0 errores de consola |
| móvil (390x844) | browser con viewport | sin scroll horizontal, sin secuestro del scroll vertical, el botón `Sacudir` funciona |
| reduced motion | emular la media query | la sección queda estática y legible |
| sin JS | desactivar JS | las palabras se leen como texto normal |
| fuga de rAF | devtools Performance | al salir de la sección el runner se detiene |

## 7. Riesgos

- **Medio**: dependencia nueva (+ ~26 KB gzip en la ruta `/education`). Mitigado con
  import dinámico: solo baja cuando la sección se acerca al viewport.
- **Medio**: matter-js + Astro SSR. Se resuelve con `client:visible` (isla) y `import()`
  dentro del efecto; nunca se evalúa en el servidor.
- **Bajo**: el original asume que `getBoundingClientRect()` de los spans existe al arrancar.
  Si la isla hidrata antes de que las fuentes carguen, los cuerpos quedan con medidas
  equivocadas → se espera `document.fonts.ready` antes de medir.
- **Bajo**: scroll de página en móvil si se activa `MouseConstraint`. Ya está resuelto
  en el diseño (pointer coarse = sin drag).

## 8. Decisiones abiertas (default si no decís nada)

1. **Ubicación**: al final, antes del CTA. Alternativa: entre Certificaciones e Idiomas.
2. **Palabras**: derivadas de `skills.ts`. Alternativa: lista curada a mano.
3. **Alcance**: solo la sección de física. El resto de las animaciones del original
   (spotlight de tarjetas, sidebar de filtros, modal de detalle) ya tienen equivalente
   propio en la vista y no se tocan.

---

## 9. Result (executed)

### Files

| File | Change |
| --- | --- |
| `package.json`, `bun.lock` | + `matter-js@0.20.0`, + `@types/matter-js@0.20.2` |
| `src/components/sections/education/TechUniversePhysics.tsx` | new, 400 lines |
| `src/pages/education.astro` | import + word derivation + `#universo` section + rail entry `05` |
| `.hermes/plans/education-technical-universe.md` | this document |

### Measured

| check | result |
| --- | --- |
| `bun run check` | 0 errors / 0 warnings / 15 hints (baseline 15) |
| `bun run lint` | 7 errors, all pre-existing in untouched files (baseline 7) |
| `bun run build` | exit 0, 49 pages |
| bundle split | `matter.DI20K1x1.js` 83 960 B (25 928 B gzip), own chunk, fetched only when the stage nears the viewport; island chunk 5 831 B |
| `dist/education/index.html` | 17 `[data-word]` spans rendered as text, no blank stage |
| desktop 1440×900 (dev + production preview) | 17 bodies positioned, transforms advancing per frame, 0 console errors |
| drag | press on a word → `constraint.bodyB` attached, body tracked the pointer to (410, 248) vs cursor (411, 248), release clears the body |
| `Sacudir` | relaunches the field (word y 209 → 91 within 350 ms) |
| containment | 0 words outside the stage after settling, at 1440, 780 and 342 px wide |
| resize | world rebuilt at 420 px wide; 17/17 repositioned; rebuilds again on the way back |
| pause | scrolling away freezes the transforms; returning resumes |
| mobile 390×844 | `(pointer: coarse)` → no `matter` listeners on the stage at all (`DOMDebugger` shows `[]`), no horizontal overflow, physics still runs |
| reduced motion | matter never fetched, spans stay in flow, `Sacudir` hidden, static note shown |
| no JS | words read as a plain tag cloud |

### Defects found while verifying and fixed

1. **Bottom clipping.** The floor sat exactly on the stage edge, so a resting word
   overhung the border by ~2 px. Walls are now inset 12 px (`WALL_INSET`).
2. **`Mouse.create` binds `touchmove` with `passive: false` on every device**, not only
   on touch-only ones. On a hybrid laptop that swallows a vertical scroll started over
   the stage. Touch events are now stopped at capture on the stage whenever the mouse
   constraint exists; the finger path is the `Sacudir` button.
3. **`↺` rendered ambiguously** at 10 px. Replaced with an inline SVG arc.

### Deviation from the plan

- Words are **17**, not 12–14: the rule is "every technical skill that is not `beginner`",
  which turns out to be all of them. No curation, nothing invented.
- `client:visible` islands do not hydrate while the tab is hidden (`document.visibilityState
  === 'hidden'`), so browser verification needed the tab brought to the front. This is
  environmental, not a page defect: `/skills` behaves the same way.

### Pre-existing, out of scope

- The floating search FAB and the WhatsApp bubble overlap the panel's bottom-right corner
  on mobile. They are site-wide fixed elements, not part of this section.
- 7 lint errors and 15 type hints in files this change does not touch.

