import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";
import partytown from "@astrojs/partytown";
import icon from "astro-icon";
import robotsTxt from "astro-robots-txt";

// import devtoolbarTailwind from "astro-devtoolbar-tailwind";
// import lighthouse from 'astro-lighthouse';

// import metaTags from "astro-meta-tags";

// https://astro.build/config
export default defineConfig({
  site: 'https://stevemoya.me',
  integrations: [mdx(), sitemap(), tailwind(), partytown(), icon(), robotsTxt(),
  // devtoolbarTailwind(), 
  // lighthouse(),
  //  metaTags()
],
  //Static is default
  output: "static"
});