import { CATEGORIES } from '@src/data/categories';
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { cldAssetsLoader } from 'astro-cloudinary/loaders';

const PROJECT_STATUSES = ['active', 'completed', 'in_progress', 'archived'] as const
const PROJECT_CATEGORIES = ['web', 'mobile', 'api', 'ai', 'backend', 'devops', 'frontend', 'fullstack', 'other'] as const
const PROJECT_BADGES = ['private', 'client', 'company', 'open_source', 'ai', 'devops', 'freelance', 'work', 'personal'] as const

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string().max(80),
			description: z.string(),
			pubDate: z.coerce.date(),
			updateDate: z.coerce.date().optional(),
			heroImage: image(),
			category: z.enum(CATEGORIES),
			tags: z.array(z.string()),
			draft: z.boolean().default(false),
			summary: z.string().optional()
		})
});

const assets = defineCollection({
	loader: cldAssetsLoader({
		folder: 'assets',
		limit: 200
	})
})

const fotografia = defineCollection({
	loader: cldAssetsLoader({
		folder: 'fotografia',
		limit: 80
	})
});

const diseno = defineCollection({
	loader: cldAssetsLoader({
		folder: 'diseño',
		limit: 80
	})
})


const about_images = defineCollection({
	loader: cldAssetsLoader({
		folder: 'about_images',
	})
});


const portafolio = defineCollection({
	loader: cldAssetsLoader({
		folder: 'portafolio',
	})
})


const projects = defineCollection({
	loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			image: image().optional(),
			imageUrl: z.string().optional(),
			draft: z.boolean().default(true),
			demo: z.string().url().optional(),
			repository: z.string().url().optional(),
			technologies: z.array(z.string()).default([]),
			featured: z.boolean().default(false),
			order: z.number().default(0),
			date: z.coerce.date(),
			company: z.string().optional(),
			client: z.string().optional(),
			role: z.string().optional(),
			status: z.enum(PROJECT_STATUSES).default('completed'),
			private: z.boolean().default(false),
			category: z.enum(PROJECT_CATEGORIES).default('other'),
			badges: z.array(z.enum(PROJECT_BADGES)).default([])
		})
});

export const collections = { blog, fotografia, diseno, about_images, portafolio, assets, projects };
