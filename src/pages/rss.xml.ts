import rss from '@astrojs/rss'
import { siteConfig } from '../data/config.ts'
import type { APIRoute } from 'astro';
import { getPosts } from '@src/utils/post.ts';

export const GET: APIRoute = async () => {
	const posts = await getPosts()
	return rss({
		title: siteConfig.title,
		description: siteConfig.description,
		site: import.meta.env.SITE,
		items: posts.map((post) => ({
			...post.data,
			link: `/blog/${post.slug}`
		}))
	})
}
