import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import { siteConfig } from '../data/config.ts'
import type { APIRoute } from 'astro';


export const GET: APIRoute = async () => {
	const posts = await getCollection('blog')
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
