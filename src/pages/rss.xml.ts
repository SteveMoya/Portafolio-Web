import rss from '@astrojs/rss'
import { siteConfig } from '../data/config.ts'
import type { APIRoute } from 'astro';
import { getPosts } from '@src/utils/post.ts';

export const GET: APIRoute = async (context) => {
	const posts = await getPosts()
	return rss({
		title: siteConfig.title,
		description: siteConfig.description,
		site: context.site ?? import.meta.env.SITE,
		customData: `
			<language>es-DO</language>
			<image>
				<url>${context.site ?? import.meta.env.SITE}${siteConfig.ogImage}</url>
				<title>${siteConfig.title}</title>
				<link>${context.site ?? import.meta.env.SITE}</link>
			</image>
		`,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			link: `/blog/${post.slug}/`,
			categories: [
				...(post.data.category ? [post.data.category] : []),
				...(post.data.tags ?? [])
			],
			customData: post.data.heroImage
				? `<enclosure url="${context.site ?? import.meta.env.SITE}${post.data.heroImage.src}" type="image/webp" length="0"/>`
				: ''
		}))
	})
}
