import { CATEGORIES } from '@src/data/categories';
import { defineCollection, z } from 'astro:content';

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

const fotografia = defineCollection({
	schema: ({ image }) => {
		image: image(),
	};
})

const diseno = defineCollection({
	schema: ({ image }) => {
		image: image(),
	};
})



export const collections = { blog, fotografia, diseno };
