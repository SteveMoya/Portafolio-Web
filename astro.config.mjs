import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import icon from "astro-icon";
import pagefind from "astro-pagefind";
import devtoolbarTailwind from "astro-devtoolbar-tailwind";
import lighthouse from 'astro-lighthouse';

import metaTags from "astro-meta-tags";

import pageInsight from "astro-page-insight";


import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: 'https://stevemoya.me',

  integrations: [
    mdx(),
    sitemap(),
    icon(),
    pagefind(),
    lighthouse(),
    metaTags(),
    pageInsight(),
    devtoolbarTailwind(),
    react()
  ],

  output: "static",

  vite: {
    plugins: [tailwindcss()],
  },
});