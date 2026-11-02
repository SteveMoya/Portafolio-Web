# Portafolio-Web: Nuevas Vistas y Chatbot UI

**Objetivo**: Agregar 4 páginas individuales (Experience, Skills, Gallery, Education) + widget flotante de chatbot sin backend.

**Rama**: `redesign/portafolio-web-vistas`

**Estrategia de entrega**: `single-pr` — un PR con todas las vistas + chatbot

**Runner**: `bun lint && bun check` (no hay tests)

---

## Specs

**S1 | Página `/experience`**
- Listado de experiencias profesionales desde datos estructura
- Mostrar: Empresa, puesto, fechas, descripción breve, skills
- Componente expandible opcional para detalles
- Sin filtros complejos (a diferencia de PersonalBlog)

**S2 | Página `/skills`**
- Mostrar habilidades técnicas (lenguajes, frameworks, herramientas)
- Grid o lista de tecnologías con iconos
- Sin Spline 3D ni efectos complejos (simplificado)
- Opcional: categorías (Frontend, Backend, AI/ML, DevOps)

**S3 | Página `/gallery`**
- Galería de imágenes desde Cloudinary (usar colecciones existentes)
- Grid responsivo con lightbox o modal simple
- Mostrar: Título, categoría opcional
- Sin GLSL Hills ni efectos WebGL

**S4 | Página `/education`**
- Historial académico y certificaciones
- Línea de tiempo o listado simple
- Mostrar: Institución, título, año, descripción breve

**S5 | Widget Chatbot UI (Componente flotante)**
- Posición: esquina inferior derecha (fixed)
- Estados: collapsed (solo ícono) / expanded (ventana de chat)
- UI simple: header, mensaje inicial, input field, botón send
- Acciones de UI: click toggle expand/collapse, escribir en input, click send
- Sin lógica de API (solo UI estática, placeholder de mensajes)
- Cerrar con X o click outside

**S6 | Integración en layout global**
- Widget se carga en todas las páginas (por defecto en layout base)
- No debe interferir con contenido existente
- Responsive: ocultable en mobile si es necesario

---

## Tasks

| ID | Spec | Ruta | Estado | Commit |
|----|------|------|--------|--------|
| T1 | S1 | Inline | ✅ GREEN | feat: experience page with timeline and filtering |
| T2 | S2 | Inline | ✅ GREEN | feat: skills page with categorized tech stack |
| T3 | S3 | Inline | ✅ GREEN | feat: gallery page with Cloudinary integration |
| T4 | S4 | Inline | ✅ GREEN | feat: education page with timeline view |
| T5 | S5 + S6 | Inline | ✅ GREEN | feat: chatbot widget UI (no backend) + global integration |

---

## Log

**L1** — Usuario solicita: "Crea vistas de Experiencia, Habilidades, Galería, Educación como páginas individuales (no secciones). Vincularlas en navegación. Widget chatbot UI sin API en esquina inferior derecha. Usa features simples."

**Análisis**: PersonalBlog (Next.js) tiene estructura compleja (Spline 3D, Framer Motion, OpenGL). Portafolio-Web (Astro 7) es static rendering. Necesita adaptación simplificada: componentes Astro + React islands mínimas para interactividad.

**L2** — Implementación completada:
- ✅ `/experience` — Página con timeline vertical, tarjetas de empleos, filtros por tipo
- ✅ `/skills` — Grid de habilidades categorizadas con indicadores de nivel
- ✅ `/gallery` — Integración nativa con Cloudinary (colecciones fotografia + diseño)
- ✅ `/education` — Timeline de educación con logros y actividades
- ✅ ChatbotWidget — Componente React flotante (fixed bottom-right), toggle expand/collapse, UI completa pero sin backend (placeholder responses)
- ✅ Integración global en Layout.astro con `client:load`
- ✅ Compilación: `bun check` ✓ (solo warnings no-críticos)

---
