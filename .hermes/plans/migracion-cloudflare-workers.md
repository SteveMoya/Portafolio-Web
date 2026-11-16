# Migración de Portafolio-Web a Cloudflare Workers

**Objetivo:** servir el sitio desde Cloudflare Workers (Static Assets) en lugar de Vercel, sin cambiar contenido ni diseño.

## Contexto verificado

- `astro.config.mjs`: `output: "static"` + `adapter: vercel()`. No hay SSR, ni `src/pages/api`, ni middleware.
- Las únicas rutas "dinámicas" (`robots.txt.ts`, `rss.xml.ts`, `llms.txt.ts`) se prerenderizan en build.
- `dist/` pesa 29 MB (límite de Workers Static Assets: 20.000 archivos, 25 MiB por archivo; hay que contar archivos, ver Paso 6).
- Cloudinary: el build usa snapshots versionados (`src/data/cloudinary/`); CI ya construye sin secretos. Las imágenes se sirven desde el CDN de Cloudinary, no desde Vercel.
- GitHub API (`src/lib/github.ts`): solo en build; `GITHUB_TOKEN` es opcional.
- Pagefind: índice post-build dentro de `dist/pagefind/` (lo sirven los assets estáticos).
- TinaCMS: solo dev (`/admin` en `public/admin`). Revisar que no se publique `public/admin` en producción (ya es así hoy).
- No hay `vercel.json`; `.vercel/` es solo artefacto local. No hay analytics de Vercel en `src/`.
- `site` apunta al alias de Vercel porque `stevemoya.me` está sin pagar (`SITE_URL` controla canonical, sitemap, RSS, robots).

## Decisión clave: Worker sin código

Como el sitio es 100% estático, **no hace falta `@astrojs/cloudflare` ni un script de Worker**. Basta `wrangler.jsonc` con `assets.directory = ./dist`. Ventajas: menos dependencias, sin riesgo de incompatibilidad de runtime (`node:*`, `sharp`), build idéntico al actual. Desventaja: si más adelante quieres SSR/endpoints, se añade el adapter entonces (cambio pequeño).

## Pasos

### 1. Preparación (sin tocar producción)
- Rama `feat/cloudflare-workers`.
- Verificar `wrangler` autenticado (`bunx wrangler whoami`) y la cuenta correcta. Confirmar que Steve autoriza el uso de esa cuenta.

### 2. Config de Wrangler
- Crear `wrangler.jsonc`:
  ```jsonc
  {
    "name": "portafolio-web",
    "compatibility_date": "2026-11-12",
    "assets": {
      "directory": "./dist",
      "not_found_handling": "404-page",
      "html_handling": "auto-trailing-slash"
    }
  }
  ```
- `bun add -d wrangler`; scripts nuevos: `"deploy": "bun run build && wrangler deploy"`, `"preview:cf": "wrangler dev"`.

### 3. Quitar Vercel del build
- `astro.config.mjs`: eliminar `import vercel` y `adapter: vercel()`.
- `bun remove @astrojs/vercel`; regenerar `bun.lock` (no tocar `pnpm-lock.yaml`).
- Cambiar el fallback de `site` al nuevo `*.workers.dev` (o dejarlo vía `SITE_URL` en el entorno de build).

### 4. Redirects y headers
- Las 3 `redirects` de Astro sin adapter generan HTML con meta-refresh (200, no 301). Para 301 reales: crear `public/_redirects`:
  ```
  /portafolio/diseno /gallery 301
  /portafolio/fotografia /gallery 301
  /portafolio/marketing /blog/category/marketing/1 301
  ```
  y quitar el bloque `redirects` de `astro.config.mjs` (evita duplicado).
- `public/_headers`: cache inmutable para `/_astro/*` y `/pagefind/*`; cache corto para HTML; cabeceras de seguridad básicas (verificar que no rompan Spline/Cloudinary/jsDelivr si hay CSP).

### 5. CI / Deploy
- `.github/workflows/ci.yml` se mantiene (build sin secretos).
- Nuevo job `deploy` (solo `push` a `main`): `bunx wrangler deploy`, con secretos de repo `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID`. Steve debe crearlos; yo no los toco.
- Alternativa: Workers Builds (integración Git de Cloudflare) en vez de GitHub Actions. Menos YAML, pero el build corre en Cloudflare y hay que configurar allí Node 22 y `bun`.
- Variables de build (`GITHUB_USERNAME`, `GITHUB_TOKEN`, Cloudinary): opcionales; solo hace falta `SITE_URL` y, si se quiere datos reales de GitHub, el token como secreto.

### 6. Verificación local (antes de desplegar)
- `bun run lint && bun run check && bun run build`.
- Contar archivos: `find dist -type f | wc -l` (< 20.000) y archivo mayor (< 25 MiB).
- `bunx wrangler dev` y recorrer: `/`, `/blog`, un post, `/gallery`, `/about`, `/404`, búsqueda Pagefind, `/rss.xml`, `/robots.txt`, `/llms.txt`, `/sitemap-index.xml`, y los 3 redirects (`curl -I` → 301).

### 7. Despliegue de prueba
- `bunx wrangler deploy` → `https://portafolio-web.<subdominio>.workers.dev`.
- Repetir el recorrido anterior en la URL real; revisar consola del navegador (CSP, fuentes, imágenes Cloudinary, Spline/3D).
- Lighthouse comparado contra la versión de Vercel.

### 8. Cutover
- Hoy el dominio `stevemoya.me` está vencido: **no hay dominio que mover**. Mientras tanto la URL pública es `workers.dev`.
- Si se renueva el dominio: añadir Custom Domain al Worker (Cloudflare gestiona el DNS), poner `SITE_URL=https://stevemoya.me`, redeploy.
- Mantener Vercel vivo 1–2 semanas como rollback; luego desconectar el proyecto de Vercel.

### 9. Documentación y limpieza
- Actualizar `AGENTS.md` ("Static site deployed to Vercel" → Cloudflare Workers), `README.md`, comentario de `astro.config.mjs` sobre el alias de Vercel y `tina/config.ts` (`VERCEL_GIT_COMMIT_REF` → solo `HEAD`/`main`).
- Quitar `.vercel/` de trabajo local si ya no se usa.

## Archivos que cambian

`astro.config.mjs`, `package.json`, `bun.lock`, `wrangler.jsonc` (nuevo), `public/_redirects` (nuevo), `public/_headers` (nuevo), `.github/workflows/ci.yml` (o nuevo `deploy.yml`), `AGENTS.md`, `README.md`, `tina/config.ts`.

## Riesgos y tradeoffs

| Riesgo | Mitigación |
|---|---|
| Redirects pasan de meta-refresh/Vercel a `_redirects` | Probar con `curl -I` en `wrangler dev` |
| Trailing slash distinto al de Vercel (URLs canonical, Pagefind) | `html_handling` + comparar `sitemap` antes/después |
| Falla el deploy por límite de archivos/tamaño | Medir en Paso 6 |
| Pierdo el rollback si borro Vercel pronto | Mantenerlo 1–2 semanas |
| Dominio vencido: el SEO sigue apuntando a `*.workers.dev` | Decisión de Steve; no afecta la migración técnica |
| Token de Cloudflare en CI | Scope mínimo "Edit Workers"; solo secreto de repo |

**Riesgo global (Task Size):** ítem 5 (delivery/entorno: CI, deploy, dependencias). Se justifica una verificación independiente al cierre.

## Preguntas abiertas (necesito tu decisión)

1. ¿Deploy desde GitHub Actions o Workers Builds (integración Git de Cloudflare)? Recomiendo Actions: ya tienes CI y el build queda reproducible y controlado.
2. ¿Vas a renovar `stevemoya.me`, o la URL pública seguirá siendo `workers.dev` por ahora?
3. ¿Cuenta de Cloudflare a usar y quién crea el API token?

## Estimación

~1 sesión: 10 archivos, <150 líneas cambiadas. Sin delegación a subagentes.
