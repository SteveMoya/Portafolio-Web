# AGENTS.md — Portafolio-Web

## What this is

Astro 7.1.1 personal portfolio + blog. Static site deployed to Vercel. Content is MDX blog posts and Cloudinary-hosted images. TinaCMS available for editing blog posts in dev mode.

## Commands


| What                | Command        |
| ------------------- | -------------- |
| Dev with TinaCMS    | `pnpm dev`     |
| Dev without TinaCMS | `pnpm start`   |
| Build (production)  | `pnpm build`   |
| Type check          | `pnpm check`   |
| Preview build       | `pnpm preview` |


There are **no lint or test scripts** in package.json. ESLint is configured but has no npm script.

## Environment variables

Required (defined in `astro.config.mjs` env schema):

- `GITHUB_USERNAME` — public, used for GitHub API calls
- `GITHUB_TOKEN` — secret, used for GitHub API calls
- `CLOUDINARY_CLOUD_NAME` — public, for image loading
- `CLOUDINARY_API_KEY` — secret, for Cloudinary API
- `CLOUDINARY_API_SECRET` — secret, for Cloudinary API

**Dev quirk**: In development (`NODE_ENV=development`), GitHub API calls use mock data from `src/mock/` instead of hitting the real API.

## Content collections

Defined in `src/content.config.ts`. Blog uses glob loader from `src/content/blog/`. Other collections (`fotografia`, `diseno`, `about_images`, `portafolio`, `assets`) load from Cloudinary via `cldAssetsLoader`.

Blog post frontmatter schema requires: `title`, `description`, `pubDate`, `heroImage`, `category`, `tags`, `draft`.

**Categories** are hardcoded in `src/data/categories.ts`. If you add a new category, update both that file AND `tina/config.ts` (they must stay in sync).

## TinaCMS

- Config: `tina/config.ts`
- Admin UI: `http://localhost:4321/admin` (only available via `pnpm dev`, not `pnpm start`)
- Blog collection schema lives in both `tina/config.ts` and `src/content.config.ts` — keep them aligned

## Path aliases

TypeScript paths configured in `tsconfig.json`:

- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@assets/*` → `src/assets/*`
- `@src/*` → `src/*`
- `@layouts/*` → `src/layouts/*`
- `@utils/*` → `src/utils/*`
- `@hooks/*` → `src/hooks/*`
- `@styles/*` → `src/styles/*`
- `@constants/*` → `src/constants/*`
- `@cv` → `./cv.json`

## Key files

- `cv.json` — Source of truth for CV data (About page)
- `src/data/config.ts` — Site metadata (author, title, description, OG image, lang)
- `src/data/categories.ts` — Blog category definitions
- `src/styles/global.css` — Theme CSS variables (colors, fonts, custom Tailwind utilities)
- `src/lib/github.ts` — GitHub API integration with dev mocks
- `src/consts.ts` — Re-exports env vars and defines `MAX_POSTS = 5`
- `src/content.config.ts` — Astro content collection schemas

## Code style

- Prettier: tabs, single quotes, no semicolons, trailing comma none, 100 char width
- Prettier plugins: `prettier-plugin-astro`, `prettier-plugin-tailwindcss`
- Tailwind custom skin classes: `text-skin-hue`, `bg-skin-fill`, `text-skin-muted`, `border-skin-hue`

## Architecture notes

- Output is `static` (not SSR) — all pages are pre-rendered at build time
- `prefetch: true` enabled in Astro config
- Pagefind for client-side search (post-build index)
- Alpine.js used alongside Astro components for interactivity
- React components used for MDX content and some interactive sections
- Lock file (`pnpm-lock.yaml`) is gitignored — dependency resolution may vary per clone
- Site language is `es-DO` (Spanish, Dominican Republic)

