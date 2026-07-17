import { defineConfig, envField } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import pagefind from "astro-pagefind";
import devtoolbarTailwind from "astro-devtoolbar-tailwind";

import vercel from "@astrojs/vercel";
import metaTags from "astro-meta-tags";

import pageInsight from "astro-page-insight";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: 'https://stevemoya.me',
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
  adapter: vercel(),
  prefetch: true,

  env: {
    schema: {
      GITHUB_USERNAME: envField.string({ context: "server", access: "public" }),
      GITHUB_TOKEN: envField.string({ context: "server", access: "secret" }),
      CLOUDINARY_CLOUD_NAME: envField.string({ context: "server", access: "public" }),
      CLOUDINARY_API_KEY: envField.string({ context: "server", access: "secret" }),
      CLOUDINARY_API_SECRET: envField.string({ context: "server", access: "secret" }),
    },
  },
});