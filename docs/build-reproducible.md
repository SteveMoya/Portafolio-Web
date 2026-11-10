# Build reproducible sin secretos

El sitio se construye con Astro y despliega en Vercel. Hasta ahora, un clone
limpio no podía reconstruirse: cinco colecciones de contenido (`assets`,
`fotografia`, `diseno`, `about_images`, `portafolio`) se cargaban con
`cldAssetsLoader`, que consulta la Admin API de Cloudinary en build time. Sin
`PUBLIC_CLOUDINARY_CLOUD_NAME`, `PUBLIC_CLOUDINARY_API_KEY` y
`CLOUDINARY_API_SECRET`, el build aborta con:

```text
[AstroUserError] Missing PUBLIC_CLOUDINARY_CLOUD_NAME. Please set it as an environment variable inside of your .env.
```

Y el único chequeo era el build de Vercel, que corre después del merge y con
secretos: un cambio que rompía la reproducibilidad no se veía antes de llegar a
`main`.

## Cómo funciona

`src/lib/loaders/cloudinary-assets.ts` envuelve al loader original:

- **Con las tres credenciales** → usa `cldAssetsLoader`, exactamente como antes.
  Producción sigue trayendo contenido fresco desde Cloudinary.
- **Sin credenciales** → carga el snapshot JSON versionado en
  `src/data/cloudinary/<colección>.json`. El build no se rompe.
- **Con credenciales incompletas** → falla con un mensaje explícito. Servir el
  snapshot en producción por una variable olvidada sería peor que fallar: el
  contenido quedaría viejo sin que nadie lo note.

El snapshot tiene el mismo shape que devuelve la Admin API, limitado a los campos
que el sitio consume: `public_id`, `secure_url`, `uploaded_at`, `folder`,
`format`, `version`, `resource_type`, `type`. El `id` de cada entrada es el
`public_id`, igual que en el loader real.

Las variables de entorno del schema (`astro.config.mjs`) pasaron a ser
opcionales: sin ellas el sitio degrada a contenido local en vez de fallar. En
Vercel se siguen inyectando igual que siempre.

## Regenerar los snapshots

Con credenciales en el entorno (o en `.env`):

```bash
bun run snapshot:cloudinary
```

El script lee el `folder_mode` de la cuenta y lista cada carpeta con paginación,
así que el snapshot refleja el contenido real. Escribe un archivo por colección.

Sin credenciales, la validación estructural corre igual y no toca la red:

```bash
bun run snapshot:cloudinary --check
```

Verifica que cada archivo exista, que `assets` sea un array, que no haya
`public_id` duplicados, que cada `public_id` viva en su carpeta y que
`secure_url` sea HTTPS.

## Qué prueba el CI

`.github/workflows/ci.yml` corre en cada push a `main` y en cada pull request:

1. Verifica que ninguna variable de Cloudinary esté definida en el job.
2. Valida los snapshots con `bun run snapshot:cloudinary --check`.
3. Corre `bun run check` (typecheck de Astro).
4. Corre `bun run build`.

Si el build vuelve a depender de la Admin API, el paso 4 falla y el PR no puede
mergearse en verde. Esa es la prueba viva de la reproducibilidad.

## Límites conocidos

- **GitHub.** Sin `GITHUB_TOKEN` el sitio omite los repositorios remotos en ese
  build (el bloque de GitHub queda vacío). No rompe el build, pero el HTML de CI
  no es idéntico al de producción. El contenido de GitHub no se snapshotea
  porque cambia con frecuencia y no es parte del contenido editorial del sitio.
- **Frescura.** El snapshot es una foto: si se agrega contenido en Cloudinary y
  no se regenera, un build sin credenciales muestra la foto anterior. Producción
  no tiene ese problema porque siempre usa la Admin API.
- **Seed inicial.** El snapshot actual de `fotografia` y `diseno` se capturó del
  build publicado de `/gallery` (los props serializados del componente), porque
  este entorno no tiene credenciales. `uploaded_at` se deriva del timestamp de
  versión de Cloudinary. Conviene regenerarlo con `bun run snapshot:cloudinary`
  la primera vez que haya credenciales a mano.
- **Colecciones sin uso.** `assets`, `about_images` y `portafolio` están
  definidas pero no las renderiza ninguna página. Sus snapshots están vacíos a
  propósito.
