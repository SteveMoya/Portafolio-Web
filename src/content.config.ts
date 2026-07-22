import { CATEGORIES } from '@src/data/categories';
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { cldAssetsLoader } from 'astro-cloudinary/loaders';

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


export const collections = { blog, fotografia, diseno, about_images, portafolio, assets };
