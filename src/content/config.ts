import { CATEGORIES } from '@src/data/categories';
import { defineCollection, z } from 'astro:content';
import { cldAssetsLoader } from 'astro-cloudinary/loaders';

const blog = defineCollection({
	// Type-check frontmatter using a schema
	type: "content",
	schema: ({ image }) =>
		z.object({
			title: z.string().max(80),
			description: z.string(),
			pubDate: z
				.string()
				.or(z.date())
				.transform((val) => new Date(val)),
			updateDate: z.string().or(z.date())
				.transform((val) => new Date(val)).optional(),
			heroImage: image(),
			category: z.enum(CATEGORIES),
			tags: z.array(z.string()),
			draft: z.boolean().default(false)
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
