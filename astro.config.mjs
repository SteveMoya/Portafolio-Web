import { defineConfig, envField } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import pagefind from "astro-pagefind";
import devtoolbarTailwind from "astro-devtoolbar-tailwind";

import metaTags from "astro-meta-tags";

import pageInsight from "astro-page-insight";
import react from "@astrojs/react";

// Canonical host for canonical tags, sitemap, RSS and robots.txt.
// `stevemoya.me` is unpaid and parked at the registrar: its nameservers point
// to parking, so every canonical and sitemap URL published while it is dead
// points at a host that does not resolve. Until the domain is back, publish
// the workers.dev URL. Set SITE_URL (any build environment) once the
// domain serves the site again -- no code change needed.
const site = process.env.SITE_URL ?? 'https://portafolio-web.workers.dev'

// https://astro.build/config
export default defineConfig({
  site,
  integrations: [
    mdx(),
    sitemap(),
    tailwind(),
    icon(),
    pagefind(),
    metaTags(),
    pageInsight(),
    devtoolbarTailwind(),
    react()
  ],

  output: "static",
  prefetch: true,
  // Los enlaces internos no llevan barra final; canonical y sitemap deben coincidir.
  trailingSlash: 'never',

  // Redirects 301: ver public/_redirects (Cloudflare Workers Static Assets).

  vite: {
    css: {
      lightningcss: {
        errorRecovery: true,
      },
    },
  },

  // Todas las variables externas son opcionales: el sitio degrada a contenido
  // local (snapshot de Cloudinary y repos de GitHub omitidos) en vez de romper
  // el build. Cloudflare las inyecta como variables de build.
  env: {
    schema: {
      GITHUB_USERNAME: envField.string({ context: "server", access: "public", optional: true }),
      GITHUB_TOKEN: envField.string({ context: "server", access: "secret", optional: true }),
      CLOUDINARY_CLOUD_NAME: envField.string({ context: "server", access: "public", optional: true }),
      CLOUDINARY_API_KEY: envField.string({ context: "server", access: "secret", optional: true }),
      CLOUDINARY_API_SECRET: envField.string({ context: "server", access: "secret", optional: true }),
    },
  },
});