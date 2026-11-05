import type { Project, ProjectCategory } from '@src/types/project'

/**
 * Filters cover two kinds of entry on the portfolio: the tracked projects
 * (markdown, with a category from the schema) and the GitHub repositories that
 * the index also lists. A repository has no category of its own, so lumping it
 * under "Otros" produced a pill with 22 items and no meaning; it gets its own
 * bucket instead.
 */
export type WorkCategory = ProjectCategory | 'repo'

/**
 * Labels for the project filters. Keys match the schema enum in
 * src/data/categories.ts (PROJECT_CATEGORIES); the label is only the human
 * facing name.
 */
export const CATEGORY_LABELS: Record<WorkCategory, string> = {
	web: 'Web',
	mobile: 'Móvil',
	api: 'API',
	ai: 'IA',
	backend: 'Backend',
	devops: 'DevOps',
	frontend: 'Frontend',
	fullstack: 'Full Stack',
	other: 'Otros',
	repo: 'GitHub'
}

export interface CategoryCount {
	category: WorkCategory
	label: string
	count: number
}

/** The bucket a card belongs to, used both by the pill row and the card. */
export function categoryOf(project: Project): WorkCategory {
	if (project.source === 'github') return 'repo'
	return project.category ?? 'other'
}

/**
 * Filter pills are derived from the projects that actually exist: a pill with
 * nothing behind it empties the grid and looks like a bug. Ordered by how much
 * work each bucket holds, then alphabetically so the row is stable.
 */
export function countByCategory(projects: Project[]): CategoryCount[] {
	return Array.from(
		projects.reduce((counts, project) => {
			const key = categoryOf(project)
			counts.set(key, (counts.get(key) ?? 0) + 1)
			return counts
		}, new Map<WorkCategory, number>())
	)
		.map(([category, count]) => ({
			category,
			count,
			label: CATEGORY_LABELS[category] ?? category
		}))
		.sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
}
