import { CATEGORIES, PROJECT_BADGES, PROJECT_CATEGORIES, PROJECT_STATUSES } from '@src/data/categories';
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { cloudinaryAssets } from './lib/loaders/cloudinary-assets';

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

/**
 * Las cinco colecciones de Cloudinary usan `cloudinaryAssets`: con credenciales
 * consultan la Admin API como siempre; sin credenciales leen el snapshot local
 * de `src/data/cloudinary/`, así el build se reproduce en cualquier clone.
 */
const assets = defineCollection({
	loader: cloudinaryAssets({
		folder: 'assets',
		limit: 200
	})
})

const fotografia = defineCollection({
	loader: cloudinaryAssets({
		folder: 'fotografia',
		limit: 80
	})
});

const diseno = defineCollection({
	loader: cloudinaryAssets({
		folder: 'diseno',
		limit: 80
	})
})


const about_images = defineCollection({
	loader: cloudinaryAssets({
		folder: 'about_images'
	})
});


const portafolio = defineCollection({
	loader: cloudinaryAssets({
		folder: 'portafolio'
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
