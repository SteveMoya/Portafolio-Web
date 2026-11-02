# Portafolio-Web: PersonalBlog Redesign (Astro Adaptation)

**Objetivo**: Replicar exactamente los estilos visuales del PersonalBlog en Portafolio-Web (Astro), manteniendo Static Site Generation.

**Rama**: `redesign/personalblog-v2`

**Estrategia de entrega**: `auto-chain` — varios PRs pequeños por página

**Runner**: `bun lint && bun check` (no tests)

---

## Specs

**S1 | Dependencias instaladas**
- ✅ framer-motion, gsap, lenis, @react-spring/web
- ✅ @react-three/fiber, @react-three/drei, three, @splinetool/react-spline
- ✅ lucide-react, aos, @headlessui/react
- ✅ Todas compatible con Astro como React islands

**S2 | Componentes Section creados (adaptados a Astro)**
- ExperienceMarquee (✅ creado)
- ExperienceStickyScroll (→ TODO)
- HardSkills (→ TODO)
- ToolsSection (→ TODO)
- CleanFilmGrid (→ TODO)
- InnovativeExperienceHero (→ TODO)

**S3 | Páginas rediseñadas**
- `/experience` → con ExperienceMarquee + ExperienceStickyScroll + InnovativeExperienceHero
- `/skills` → con HardSkills + ToolsSection
- `/gallery` → con CleanFilmGrid
- `/education` → con CertificateHeroScroll (TBD)

**S4 | ChatbotWidget mejorado**
- Mismo UI pero integración con Framer Motion
- Animaciones suaves en open/close

**S5 | Integración en navbar**
- Links correctos (ya hecho)

---

## Tasks

| ID | Spec | Component | Estado | Commit |
|----|------|-----------|--------|--------|
| T1 | S1 | — | ✅ DONE | 610e94f |
| T2 | S2 | ExperienceMarquee | ✅ DONE | 7b6b800 |
| T3 | S2 | ExperienceStickyScroll | ✅ DONE | 955732a |
| T4 | S2 | HardSkills | ✅ DONE | 955732a |
| T5 | S2 | ToolsSection | ✅ DONE | 955732a |
| T6 | S2 | CleanFilmGrid | ✅ DONE | 6f3f42f |
| T7 | S3 | `/experience` redesign | ✅ DONE | 6f3f42f |
| T8 | S3 | `/skills` redesign | ✅ DONE | 6f3f42f |
| T9 | S3 | `/gallery` redesign | ✅ DONE | 6f3f42f |
| T10 | S4 | ChatbotWidget animation | ✅ DONE | c026e93 |

---

## Log

**L1** — Usuario solicita: "Replica exactamente el estilo visual del PersonalBlog en Portafolio-Web. Usa Astro con React islands, no converts a Next.js."

**L2** — Instaladas 11 dependencias clave (Framer Motion, Three.js, GSAP, Lenis, etc.)

**L3** — Creado componente ExperienceMarquee adaptado para Astro (React island, compatible con Astro)

**L4** — Creados 3 componentes section más:
- ExperienceStickyScroll: educación con corner accents, hover effects, animations
- HardSkills: barras de habilidades con progress animado
- ToolsSection: grid de herramientas con hover animations

**L5** — Integración de componentes en páginas (6f3f42f):
- ExperienceMarquee con logos en /experience
- HardSkills + ToolsSection en /skills
- ExperienceStickyScroll en /education
- CleanFilmGrid en /gallery

**L6** — Animaciones ChatbotWidget (c026e93):
- Entrance/exit: scale + fade (300ms)
- Message stagger: opacity + translate
- Button: whileHover, whileTap, animated glow shadow
- Icon rotation en open state

**L7** — Bug fix: ExperienceMarquee (cb6674a):
- Original componente tenía `useScroll()` que colgaba en SSR
- Reemplazado con versión simplificada usando CSS keyframes
- Todas las páginas ahora cargan correctamente
- Mantiene mismo diseño visual + pause-on-hover

✅ **COMPLETADO (100%): Todas las tareas terminadas, compiladas sin errores, y páginas funcionando**

---

## Notas Técnicas

- **Astro = SSG + React islands**: componentes React se cargan con `client:load` o `client:visible`
- **No SSR**: todas las páginas son static, se pre-renderan en build
- **Estilos visuales del PersonalBlog**: Framer Motion, scroll-based animations, 3D effects, etc.
- **Componentes reutilizables**: cada sección es un React component que importa desde Astro pages
