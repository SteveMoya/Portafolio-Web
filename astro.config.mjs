import { defineConfig, passthroughImageService } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import pagefind from "astro-pagefind";
import devtoolbarTailwind from "astro-devtoolbar-tailwind";
import lighthouse from 'astro-lighthouse';

import metaTags from "astro-meta-tags";

import metaTags from "astro-meta-tags";
import pageInsight from "astro-page-insight";

import devtoolbarTailwind from "astro-devtoolbar-tailwind";

// https://astro.build/config
export default defineConfig({
  site: 'https://stevemoya.me',
  experimental: {
    contentCollectionCache: true
  },
  image: {
    service: passthroughImageService()
  },
  integrations: [mdx(), sitemap(), tailwind(), icon(), pagefind(), 
  lighthouse(), metaTags(), pageInsight(), devtoolbarTailwind()],
  //Static is default
  output: "static"
});