# Auditoría de diseño — /skills

Fecha: 2026-11-02 · Rama: `redesign/personalblog-v2`
Método: skill `frontend-design` + reglas de `motion` + criterios de interfaz. Medido sobre el DOM servido
en `localhost:4321/skills` (1440×900 y 390×844) y el CSS de `bun run build`.

Veredicto: **0 HIGH · 5 MEDIUM · 5 LOW**.

---

## 1. Lo que ya está bien

| criterio | evidencia |
| --- | --- |
| Paleta limitada | 3 colores: `#0a0a0a`, `#c70039`, `#b11141` |
| Contraste del cuerpo | `text-white/60` = **7.3:1** |
| Barras de nivel sin JS | `.bar-grow` es CSS puro: se llenan sin hidratar la isla |
| Foco visible | anillo `#c70039` en rail, pills, tarjetas y enlaces |
| Reduced motion | barras, marquee, reveal, contador y hover quedan inertes |
| Overflow horizontal | **0 px** a 390 y 1440 |
| Índice de página | 7 secciones, `aria-current` en la activa, degradado de desborde en móvil |
| Contador de stats | arranca en 0 y aterriza en el valor real, una sola vez |

---

## 2. Hallazgos

### M-1 · MEDIO — Precisión inventada en las barras de nivel
`HardSkillsNew.tsx:22-43` traduce cuatro niveles cualitativos a porcentajes exactos: inicial **40 %**,
intermedio **60 %**, avanzado **80 %**, experto **95 %**. Una barra al 95 % se lee como una medición, y
no hay medición: hay una etiqueta. Es el hallazgo de honestidad de datos de la vista.

Reemplazo: cuatro segmentos discretos (uno por nivel, N encendidos) o una escala rotulada. Se pierde el
“casi lleno” y se gana exactitud.

### M-2 · MEDIO — La capa de texto secundario no llega a AA
`text-white/40` = **3.77:1** en 10 usos: eyebrows de sección (`SectionHeading.astro:36`),
categoría de cada tarjeta (`skills.astro:190`), etiquetas del marquee (`:114`), “Idiomas/Intereses”
(`:426`, `:447`). WCAG 1.4.3 pide 4.5:1 a ese tamaño.
Reemplazo: `text-white/55` (**6.28:1**).

### M-3 · MEDIO — El acento como texto de 10 px
`#c70039` sobre el tinte `white/5` ≈ **3.2:1** en la inicial de cada habilidad
(`HardSkillsNew.tsx:77`, `skills.astro:181`) y en el contador de columna. Pasa 3:1 solo si el texto es
grande, y acá es de 10 px.
Reemplazo: inicial en `text-white` con el acento solo en el borde/fondo.

### M-4 · MEDIO — Escala tipográfica y de tracking sin sistema
**13 tamaños** distintos (9, 10, 12, 14, 16, 20, 24, 30, 36, 48, 60, 72 px + tres medidas `vw`) y
**7 trackings** (0.1 / 0.12 / 0.15 / 0.2 / 0.22 / 0.28 / 0.3 em) en la misma página.
Mismo diagnóstico que en `/education`: no hay escala, hay decisiones sueltas.

### M-5 · MEDIO — Tres ejes de alineación
Hero centrado, índice de secciones a la izquierda, títulos de sección a la izquierda. Es idéntico al
hallazgo de `/education`, y ahora que las dos vistas comparten hero e índice, conviene resolverlo una vez
para las dos.

### L-1 · BAJO — Objetivos táctiles chicos
Medidos: botón “Ver más” 32 px, enlace de proyecto 23 px (ajustado a 28 en esta pasada), filas del rail
43 px. Pasa AA 2.5.8 (24 px) salvo el enlace de proyecto antes del ajuste.

### L-2 · BAJO — El marquee repite el stack que está justo abajo
Las 22 habilidades aparecen dos veces en la misma pantalla: la tira animada y la grilla “Tecnologías
principales”. La tira es decorativa, pero compite con el contenido real en jerarquía.

### L-3 · BAJO — `layout` de framer-motion en las tarjetas de habilidad
`HardSkillsNew.tsx:58` anima `layout` en cada tarjeta al expandir una columna; con 22 tarjetas es la
animación más cara de la página. Alternativa: animar solo el contenedor de la columna.

### L-4 · BAJO — El número de columna no dice qué cuenta
`HardSkillsNew.tsx:151-153` imprime `05` sin etiqueta. En el contexto de la columna se entiende, pero un
lector de pantalla recibe un número suelto.

### L-5 · BAJO — Estado expandido sin anuncio
“Ver más (N)” cambia a “Ver menos” y agrega tarjetas; no hay región viva ni `aria-controls` que una el
botón con la lista.

---

## 3. Corregido en esta pasada

1. `transition-all` en los dos CTA del cierre → `transition`.
2. `hover-lift` 350 ms → 220 ms y press 0.97 → 0.98 (global).
3. Zoom de imagen de proyecto 700 ms → 400 ms.
4. `.reveal` por contenedor → reveal por tarjeta con `--i`, armado solo bajo el fold (nunca en SSR).
5. Enlace de proyecto 23 px → 28 px.
6. Regla de los principios: `transition-all` 500 ms → `transition-[width]` 300 ms.
7. Añadido: riel de progreso, índice de secciones (compartido), `aria-current`, contador de stats.

---

## 4. Checklist `frontend-design`

| criterio | estado | nota |
| --- | --- | --- |
| Escala tipográfica definida | ✗ | M-4 |
| Paleta limitada con reglas | ✓ | 3 colores |
| Espaciado sobre grid | ✓ | todas las secciones `py-20/lg:py-28` |
| Estados interactivos | ✓ | hover, press, focus, expandido, disabled |
| Breakpoints probados | ✓ | 0 overflow a 390 |
| Modo claro/oscuro | n/a | tema único |
| Guía de motion | ✓ tras correcciones | todo ≤ 300 ms salvo zoom de imagen (400 ms) |

---

## 5. Prioridad

1. M-1 (barras con porcentajes inventados) — es el único que dice algo falso al usuario.
2. M-2 y M-3 (contraste) — junto con `/education`, una sola decisión de sistema.
3. M-4 y M-5 — sistema tipográfico y alineación, para las cuatro vistas a la vez.
4. L-1 a L-5 — deuda menor.
