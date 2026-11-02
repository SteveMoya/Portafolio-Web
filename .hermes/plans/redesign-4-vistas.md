# Plan — Align the four new views with the portfolio design system

Branch: `redesign/personalblog-v2`
Scope: `src/pages/{skills,experience,education,gallery}.astro` + the components only they use.
Reference: https://github.com/Arfazrll/PersonalBlog (Next.js 15 port source)

---

## 1. Audit — what is actually wrong

### 1.1 Root cause

The four views were ported from the reference repo (Next.js + shadcn tokens:
`bg-background`, `text-foreground`, `text-primary`, cyan/neutral palettes).
The *structure* came across. The *design tokens* did not: they were left as the
reference's, and the reference's token names do not exist in this project.

Evidence, generated CSS from the last build (`dist/_astro/*.css`):

| class used by the new pages | occurrences in generated CSS |
| --- | --- |
| `bg-slate-900` | 6 |
| `text-sky-300` | 2 |
| `bg-background` | **0** |
| `text-foreground` | **0** |
| `text-muted-foreground` | **0** |

`tailwind.config.mjs` defines only `skin.*`, plus `blue`/`green` overrides
(lines 37-86). There is no `background`, `foreground`, `primary` or `muted-*`
color. So:

- `education.astro` renders **unstyled**: every `bg-background`,
  `text-foreground`, `border-foreground/10`, `bg-foreground/[0.02]`,
  `text-muted-foreground` is a no-op class. Its only effective styles are
  font sizes. This is a bug, not a taste issue.
- `skills.astro`, `experience.astro` render a **different product**: navy
  `slate-900` gradients, `sky-*`/`blue-*`/`purple-*`/`emerald-*` accents,
  while the site identity is `#0a0a0a` + `#c70039`.

### 1.2 Off-brand palettes in the ported components

Counted occurrences of non-system color families:

| file | lines | off-system colors |
| --- | --- | --- |
| `src/components/sections/skills/HardSkillsNew.tsx` | 185 | 17 (`sky`,`emerald`,`amber`,`indigo`) |
| `src/components/sections/skills/ToolsSectionNew.tsx` | 91 | 6 (`sky`,`indigo`) |
| `src/components/sections/ExpandableExperienceCard.tsx` | 205 | 27 (`slate`,`blue`) |
| `src/components/sections/EducationStickyScroll.tsx` | 367 | 25 (`cyan`,`blue`,`yellow`,`orange`,`neutral`) |
| `src/components/sections/gallery/CleanFilmGrid.tsx` | 461 | 2 (`red`) — already uses hex `#0a0a0a`/`#c70039` |

### 1.3 Missing project chrome

The new views do not use any of the site's signature language, all of which
already exists and is used by `/` and `/about`:

- eyebrow: `text-[10px] font-bold uppercase tracking-[0.3em] text-white/40`
- display type: `font-poppins font-black uppercase tracking-tight`
- muted body: `text-white/60`
- pills: `rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide`
- blueprint card: `.dotted-card` + `.corner-tick--tl/--br` (`src/styles/global.css:194-250`)
- entrance: `.reveal` scroll-driven animation (`global.css:118`)
- accent text: `.text-shiny` / `.text-shiny-accent` (`global.css:157-185`)
- reveal headline: `src/components/ui/BlockReveal.astro`
- closing CTA: `src/components/sections/FinalCTA.astro`

### 1.4 Structure gaps vs the reference

| reference page | signature pieces | present in ours |
| --- | --- | --- |
| `skills/page.tsx` | oversized wordmark hero + mono eyebrow, floating tech bubbles, arched/kinetic tech grid, HardSkills, ToolsSection, FeatureSection | hero yes (generic), no tech grid identity, no closing section |
| `experience/page.tsx` | statement hero, tab bar (Education/Journey/Experience), sticky-scroll timeline, expandable detail card with Tasks/Learned/Impact, category filter, highlight section, CTA | timeline yes, filter no, learned/impact no, CTA yes |
| `gallery/page.tsx` | manifesto hero, CleanFilmGrid, impact section | hero yes, grid yes, impact no |
| `achievements/page.tsx` (→ our Education) | certificate hero scroll, sidebar filter with counts (All/Certifications/Awards/Competitions), arch/card grid, empty state | **no** — plus broken tokens |

### 1.5 Code smells introduced with the views

- `src/pages/experience.astro:15` — `groupedByType` computed, never read.
- `src/pages/education.astro:48-87` — "Additional Information" repeats the same
  `education` entries the sticky-scroll block above already renders.
- `EducationStickyScroll.tsx` and `ExperienceStickyScroll.tsx` are near-duplicates
  of one ported component; `HardSkills(.tsx)` / `HardSkillsNew(.tsx)`,
  `ToolsSection(.tsx)` / `ToolsSectionNew(.tsx)`, `ExperienceMarquee` /
  `ExperienceMarqueeSimple` are duplicated pairs. Only the `New`/`Simple`
  variants are used by the pages; the others are dead files.
- `ExpandableExperienceCard.tsx:39` — the whole card is a clickable `<div>`
  with no `role`/`tabIndex`/key handler: not keyboard accessible.
- `src/data/skills.ts` stores emoji as `icon`, so the skills page can never show
  real tech logos even though `src/icons/*.astro` already ships 29 of them.

---

## 2. Target: the token mapping (single source of truth)

Every ported file gets remapped with these exact substitutions. No new
design tokens, no shadcn vocabulary.

| reference | this project |
| --- | --- |
| `bg-background`, `bg-white dark:bg-neutral-950` | `bg-[#0a0a0a]` |
| `text-foreground`, `text-neutral-900 dark:text-white` | `text-white` |
| `text-muted-foreground`, `text-neutral-500 dark:text-neutral-400` | `text-white/60` |
| `text-primary`, `text-cyan-400`, `text-blue-400` | `text-[#c70039]` |
| `border-neutral-200 dark:border-neutral-800`, `border-white/10` | `border-white/10` |
| `bg-neutral-100 dark:bg-neutral-900` (chips, surfaces) | `bg-white/5` |
| `bg-cyan-500 text-white` (active filter) | `bg-[#c70039] text-white` |
| `rounded-3xl` cards | `rounded-2xl` + `.dotted-card` + corner ticks |
| `text-[10px] font-mono uppercase tracking-[0.5em] text-primary/80` | keep the tracking, drop `mono`, `text-white/40` |
| `font-black tracking-tighter` display | `font-poppins font-black uppercase tracking-tight` |
| entrance animations (`whileInView`) | `.reveal` class (scroll-driven, no JS) |

Accessibility/performance rules for every file touched:

- `prefers-reduced-motion: reduce` disables transforms (already the pattern in
  `ExpertiseSection.astro:272`).
- Interactive elements are `<button>`/`<a>`, never bare `<div onClick>`.
- Decorative layers get `aria-hidden="true"` + `pointer-events-none`.
- No new client-side JS where a CSS scroll animation suffices.

---

## 3. Target structure per view

### Skills (`/skills`)
1. Hero: eyebrow `Capabilities`, oversized `SKILLS / & TOOLS` (accent on the
   second word via `.text-shiny-accent`), mono subtitle, scroll cue.
2. Floating tech pills/bubbles using `src/icons/*.astro` mapped from
   `src/data/skills.ts` names (fix the emoji-to-icon mapping in the page, not in
   the data file).
3. "Core Technologies" grid: icon + name cards (reference `KineticTechGrid`
   equivalent) — pure Astro, no React needed.
4. Hard skills by category: level shown as a bar in `#c70039` on a `white/10`
   track, grouped in three blueprint cards (AI & Data / Software / Tools).
5. Stats strip (`Total`, `Expert`, `Advanced`, `Categories`).
6. Closing CTA (reuse `FinalCTA`-style block, not the whole component).

### Experience (`/experience`)
1. Statement hero with eyebrow + mono meta (years, roles, technologies).
2. Filter bar by `type` (internship / freelance / contract / full-time) with
   counts — reference's category selector, ported to pills.
3. Timeline: date range mono uppercase, company + position, logo, expandable
   body with `Responsibilities` + `Skills` as chips.
4. Stats + CTA.

### Education (`/education`)
1. Hero (fix: remove dead tokens).
2. Sticky-scroll timeline of the `education` entries with GPA/activities/achievements.
3. Certifications block driven by `src/data/certifications.ts` with a
   sidebar-style filter (All / Certifications) — the reference's achievements
   pattern, minus the one we have no data for.
4. Remove the duplicated "Additional Information" grid.

### Gallery (`/gallery`)
1. Hero aligned to project type (keep the big statement, recolor accent from
   `#c70039`, mono eyebrow).
2. `CleanFilmGrid` untouched except token deltas.
3. Stats + closing CTA.

---

## 4. Execution order

1. **Shared primitives (parent, inline)** — `src/components/ui/PageHero.astro`
   and `src/components/ui/SectionHeading.astro` so the four views share one
   hero/heading implementation and cannot drift again.
2. **Four parallel writers (disjoint surfaces)**
   - A: `src/pages/skills.astro`, `src/components/sections/skills/HardSkillsNew.tsx`, `ToolsSectionNew.tsx`
   - B: `src/pages/experience.astro`, `src/components/sections/ExpandableExperienceCard.tsx`
   - C: `src/pages/education.astro`, `src/components/sections/EducationStickyScroll.tsx`
   - D: `src/pages/gallery.astro`, `src/components/sections/gallery/CleanFilmGrid.tsx`
   Each writer reads the token mapping above and the two reference files
   `src/components/sections/ExpertiseSection.astro` + `FinalCTA.astro` as the
   house style. Each returns the `S#`-equivalent checklist it covered.
3. **Seam fix (parent)** — one pass to unify spacing/hero rhythm across the four
   pages after the writers land.
4. **Docs check via Context7** — verify Tailwind v3 arbitrary-value and
   opacity-modifier syntax plus Astro `astro:page-load` usage before/while
   writing, so no invented API.
5. **Verification (parent)** — see §5.

Deletion of the dead duplicate components is listed as optional Phase 6 and only
with explicit approval; nothing is deleted in Phases 1-5.

---

## 5. Verification (definition of done)

| check | command | pass condition |
| --- | --- | --- |
| types | `bun run check` | 0 errors (baseline today: 0 errors, 0 warnings, 17 hints; the `groupedByType` hint must disappear) |
| lint | `bun run lint` | no new errors vs baseline |
| build | `bun run build` | exit 0 |
| token guard | grep for `slate- | sky- | indigo- | purple- | emerald- | cyan- | neutral- | bg-background | text-foreground | text-muted-foreground` in the 4 pages + 5 components | zero hits (except allowed `CleanFilmGrid` hex) |
| generated CSS | grep `dist/_astro/*.css` | no `.bg-slate-900`, `.text-sky-300` |
| visual | dev server + screenshots at 1440x900 and 390x844 for the 4 routes | compared against `/` and `/about`; consistent bg, accent, eyebrow, type scale |
| a11y | keyboard tab through each page | expandable cards and filters reachable and operable |
| reduced motion | emulate `prefers-reduced-motion: reduce` | no animation-only content |

Baseline captured before any change: `bun run check` → **0 errors, 0 warnings,
17 hints**.

---

## 6. Risks

- **Medium**: rewriting four pages touches only page-level markup and
  single-purpose components; no data files, no routing, no shared layout.
  `Layout.astro`, `Navbar`, `cv.json` and `src/data/*` are not modified.
- The skills icon mapping change stays inside the page, so `/about` (which reads
  the same `skills.ts`) is unaffected.
- `CleanFilmGrid` is interactive (lightbox). A wrong edit breaks the gallery; the
  writer must keep its behaviour and only change color/typography tokens.

---

## 7. Open decision

Phase 6 cleanup: delete the now-dead duplicates
(`HardSkills.tsx`, `ToolsSection.tsx`, `ExperienceMarquee.tsx`,
`ExperienceStickyScroll.tsx` if unused) or leave them in place?
Default if not specified: **leave them**, do not touch in this pass.

---

## 8. Result (executed)

### Baseline → after

| check | baseline | after |
| --- | --- | --- |
| `bun run check` | 0 errors / 0 warnings / 17 hints | 0 errors / 0 warnings / **15 hints** |
| `bun run lint` | 9 errors | **7 errors** (all pre-existing, in files not touched here) |
| `bun run build` | — | exit 0, 49 pages |
| dead tokens (`bg-background`, `text-foreground`, `text-primary`) in the 9 touched files | present in all four pages | **0** |
| off-brand palette (`slate|sky|indigo|purple|emerald|cyan|amber|neutral|zinc|stone` + numeric shade) in the 9 touched files | 77 occurrences | **0** |
| horizontal overflow at 390px | not measured | **0** on all four routes |
| island hydration (`client:visible`) | unknown | all islands hydrate after scroll; filters, expand panel and lightbox verified in the production preview |

### Defects found during verification and fixed

1. `experience.astro` inline script typed `Element` → `button.disabled` broke
   `astro check` (1 error). Fixed with `querySelectorAll<HTMLButtonElement>`.
2. `gallery.astro` nested a second `<main>` inside `Layout.astro`'s `<main>`.
   Replaced with a `<div>`.
3. `ExpandableExperienceCard` logo (`/logos/icc.svg` does not exist) rendered a
   broken-image glyph. Added a monogram fallback; `onError` alone is not enough
   because the SSR'd `<img>` can 404 *before* React hydrates, so the settled
   state is re-checked on mount.

### Pre-existing issues left untouched (out of scope, listed for the record)

- `src/data/education.ts` third entry is placeholder copy ("Coming Soon / Always
  eager to expand my horizons").
- `/logos/icc.svg` is referenced by `src/data/experiences.ts` but the file is
  not in `public/`.
- Footer renders "Steve Moya Copeda" (`src/layouts/Footer.astro`).
- 7 lint errors and 15 type hints in files outside this change
  (`ChatbotWidget.tsx`, `ExperienceStickyScroll.tsx`, `CleanFilmGrid.tsx`
  `columns`, `Cursor.astro`, `Head.astro`, `ScrollReveal.astro`).
- Card descriptions come from the data files in English while the page chrome is
  Spanish — same mix `/about` already ships.

---

## 9. Round 2 — content density + microinteractions

### L2 (user request, verbatim)

> Ok vamos mejor, pero recuerda que a estas vistas hay que colocarle contenido, y
> recuerda tambien que tiene que verse de las siguientes formas Aqui te mando las
> URLs:
> https://www.syahrilarfianalmazril.my.id/skills
> https://www.syahrilarfianalmazril.my.id/achievements
> https://www.syahrilarfianalmazril.my.id/experience
> https://www.syahrilarfianalmazril.my.id/gallery
> Estos que ya estan en el repositorio: https://github.com/Arfazrll/PersonalBlog
> que te habia mandando, colocale mas contenido acorde y mas elementos
> interactivos y microinteraciones

### Measured gap (live reference vs ours)

| route | reference height | ours before round 2 |
| --- | --- | --- |
| /skills | 8 902 px | 4 452 px |
| /achievements → /education | 10 509 px | 4 272 px |
| /experience | 21 100 px | 3 013 px |
| /gallery | 5 297 px | 4 800 px |

Reference section inventory captured for each route: skills has a tech-icon
field, "Strategic Directives" soft skills, "Core Focus" bars, "The Engineering
Foundation" grid, a "Professional Tooling" marquee and a closing orbital CTA;
achievements has a sticky search + count + category filters + two-column
credential grid; experience has a logo wall, quote, tab bar, year-grouped spine
and per-card media; gallery ends with an editorial process section and a
featured article.

### Content rule for round 2

**No fabricated facts.** Every figure is computed from existing data; every
external link comes from the data files. Sources used: `src/data/skills.ts` (22),
`src/data/experiences.ts` (4), `src/data/education.ts` (3),
`src/data/certifications.ts` (6), `cv.json` (languages, interests),
16 blog posts via `getPosts()`, Cloudinary `portafolio` projects via
`getAllProjects()`, GitHub repos via `getHighlightRepos()`.

Editorial copy that did not exist before was authored in
`src/data/capabilities.ts` (`softSkills` ×6, `principles` ×4). It describes how
Steve works and contains no verifiable claims — it must be reviewed by him.

### Shared microinteraction primitives (added to global.css)

`.bar-grow` (scroll-driven progress bar via `--bar-w`), `.hover-lift`,
`.tap`, `.marquee` / `.marquee-track` (`--marquee-duration`, pauses on
hover/focus). All reduced-motion safe and static-readable without JS.

### Result after round 2

| route | reference | before round 2 | after round 2 |
| --- | --- | --- | --- |
| /skills | 8 902 px | 4 452 px | **7 513 px** |
| /education | 10 509 px | 4 272 px | **6 104 px** |
| /experience | 21 100 px | 3 013 px | **3 825 px** |
| /gallery | 5 297 px | 4 800 px | **6 534 px** |

Experience stays short because the dataset is 3 roles; padding it would mean
inventing jobs. Education is capped by 6 real certifications and no awards.

Sections added: `/skills` → tech marquee, Cómo trabajo (4 principios),
Competencias (6), Proyectos en producción (3 reales), Idiomas e intereses.
`/experience` → company marquee, changelog quote, year spine (2025/2024/2023)
with IntersectionObserver highlight, cross-links. `/education` → searchable
archive with sticky rail and live counter, Idiomas e intereses, Aprendizaje
continuo (3 real posts). `/gallery` → collection marquee, El proceso (4
principios), Última historia, lightbox con flechas/Home/End y contador `n / 63`.

Verification after round 2: `bun run check` 0 errors / 15 hints; `bun run lint`
7 errors (all pre-existing); `bun run build` exit 0, 49 pages; both guards empty;
no page-level horizontal overflow at 390 px (the only elements past the viewport
are inside `.marquee`, which clips them: `outsideMarquee: 0`).

### Defects found and fixed in round 2

1. `gallery.astro` marquee mapped `[0,1].map((copy))` and `marqueeNames.map((name, index))`
   without using either binding → 2 new lint errors.
2. `EducationStickyScroll` rendered `initial={{opacity:0}}`, which survives in the
   SSR markup: the whole academic timeline was blank until the `client:visible`
   island hydrated, and blank forever without JS. Now `initial={false}`.
3. `CleanFilmGrid` thumbnails had the same `opacity:0` initial. Entrance now
   animates `scale` only, so the grid is painted server-side.
4. `ExpandableExperienceCard.formatDate` formatted date-only strings in local
   time (UTC-4), so `2024-01-01` rendered "dic 2023" and disagreed with the year
   rail showing 2024. Pinned to `timeZone: 'UTC'`.
5. The year spine was `border-white/10` and effectively invisible; replaced with
   a 1 px gradient (`#c70039/40 → white/15 → transparent`).

### L3 (user request, verbatim)

> Los CTA de cada seccion duran demasiado para hacer las animaciones y deberian
> de hacerse desde que se ven

Measured before the fix: on `/skills` the CTA heading was still `opacity: 0`
with the block top at 810 px of a 900 px viewport, and only appeared once the
block reached 694 px. Two causes stacked: `.reveal` ended at `cover 25%`
(several hundred px of extra scroll) and `BlockReveal` fired at `top 88%`,
i.e. while the block was still 12% below the fold, with `0.45s` + `0.2s`
stagger per line.

Changes:

- `BlockReveal.astro` gained a `triggerStart` prop (default unchanged at
  `top 88%`, so the home page is untouched). The four closing CTAs pass
  `triggerStart="top 98%"`, `duration={0.3}`, `stagger={0.09}`.
- The redundant `.reveal` wrapper was removed from the three closing CTAs; the
  GSAP wipe is the entrance, everything else paints immediately.
- `.reveal` now runs `entry 0% → entry 40%` instead of `entry 5% → cover 25%`.

Measured after: the heading reaches `opacity: 1` as soon as the block top passes
802 px (previously 694 px), i.e. the moment it is visible, and completes in
~0.42 s instead of ~0.85 s. All `.reveal` blocks on the four routes settle to
opacity 1 (`stillHidden: 0`), none is taller than the viewport, so the 40%
entry range cannot stall.

### L4 (user report, verbatim)

> Existe un error y es que en la vista de experiencia no se muestra el time line,
> mira que es lo que se ve

Screenshot showed the year rail and the filter pills with an empty right column.

**Root cause.** `astro dev` and `astro build` share `node_modules/.vite`. The
build runs with `NODE_ENV=production`, so Vite pre-bundles
`react/jsx-dev-runtime` in its production form, where `exports.jsxDEV = void 0`.
The dev server then throws `_jsxDEV is not a function`, React error #423 follows,
and every React island is emptied — the experience cards included.

Proof from the poisoned cache:

```
node_modules/.vite/deps/react_jsx-dev-runtime.js
  //#region .../react/cjs/react-jsx-dev-runtime.production.min.js
  exports.jsxDEV = void 0;
```

The cache mtime (00:10:31) matched a `bun run build` of this session, so the
builds run during verification caused it. Production was never affected.

**Fix.**

1. Removed `node_modules/.vite`; the next dev start re-optimizes with
   `NODE_ENV=development`.
2. `package.json` → `"build": "astro build && rm -rf node_modules/.vite"`, so a
   build can no longer leave a poisoned pre-bundle behind.

Attempted and reverted: `vite.cacheDir` per command in `astro.config.mjs`. It
broke `astro-icon` (`Cannot find module 'virtual:astro-icon'`), so the config
stays untouched.

**Verified** on a dev server after the fix, and again after running
`bun run build` underneath the running server: `/experience` returns 3
`[data-exp-card]` items, all 4 islands hydrated (`ssrPending: 0`), zero console
errors, and the card expands (`aria-expanded="true"` + panel).

Note for the record: `AGENTS.md` documents the command table and would be the
natural home for this trap, but the file is protected and the write needs
explicit approval.





