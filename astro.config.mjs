import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import pagefind from "astro-pagefind";
import devtoolbarTailwind from "astro-devtoolbar-tailwind";

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
});