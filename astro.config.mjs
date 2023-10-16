import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import tailwind from "@astrojs/tailwind";


// https://astro.build/config
export default defineConfig({
  site: 'https://stevemoya.me',
  integrations: [mdx(), sitemap(), tailwind(), ],
  //Static is default
  output:"static"
});