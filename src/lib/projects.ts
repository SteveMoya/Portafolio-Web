import type { Project } from '@src/types/project'
import { getContentProjects } from '@src/lib/content'
import { getGithubProjects } from '@src/lib/github'

export async function getAllProjects(): Promise<Project[]> {
	const [contentProjects, githubProjects] = await Promise.all([
		getContentProjects(),
		getGithubProjects()
	])

	const sortedContent = contentProjects
		.sort((a, b) => {
			if (a.featured !== b.featured) return a.featured ? -1 : 1
			return a.order - b.order
		})

	const sortedGithub = githubProjects
		.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())

	return [...sortedContent, ...sortedGithub]
}
