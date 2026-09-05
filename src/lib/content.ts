import { getCollection } from 'astro:content'
import type { Project, Technology } from '@src/types/project'

export async function getContentProjects(): Promise<Project[]> {
	const entries = await getCollection('projects')

	return entries
		.filter((entry) => !entry.data.draft)
		.map((entry) => {
			const { data } = entry

			const technologies: Technology[] = data.technologies.map((tech) => ({
				name: tech
			}))

			let image = ''
			if (data.image) {
				image = data.image.src
			} else if (data.imageUrl) {
				image = data.imageUrl
			}

			return {
				title: data.title,
				description: data.description,
				image,
				demo: data.demo,
				repository: data.repository,
				technologies,
				updatedAt: data.date,
				featured: data.featured,
				order: data.order,
				source: 'content' as const,
				company: data.company,
				client: data.client,
				role: data.role,
				private: data.private,
				status: data.status,
				category: data.category,
				badges: data.badges
			}
		})
}
