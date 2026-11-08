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

/**
 * Second axis of the index filters. A tracked engagement is "en curso" only
 * when its own status says so; a GitHub repository carries `status: 'active'`
 * merely because it is not archived, so it gets its own bucket instead of
 * claiming work in progress nobody is doing.
 */
export type WorkStatus = 'en-curso' | 'entregado' | 'repo'

export const STATUS_LABELS: Record<WorkStatus, string> = {
	'en-curso': 'En curso',
	entregado: 'Entregados',
	repo: 'Repositorios'
}

/** Fixed order: the reader scans progress before finished work. */
const STATUS_ORDER: WorkStatus[] = ['en-curso', 'entregado', 'repo']

export interface StatusCount {
	status: WorkStatus
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

/** The status bucket a card belongs to, mirrored by `data-status` on the card. */
export function statusOf(project: Project): WorkStatus {
	if (project.source === 'github') return 'repo'
	return project.status === 'active' || project.status === 'in_progress' ? 'en-curso' : 'entregado'
}

/**
 * Same rule as `countByCategory`: a status pill only exists when there is work
 * behind it, because an empty pill empties the grid and looks like a bug.
 */
export function countByStatus(projects: Project[]): StatusCount[] {
	const counts = projects.reduce((totals, project) => {
		const key = statusOf(project)
		totals.set(key, (totals.get(key) ?? 0) + 1)
		return totals
	}, new Map<WorkStatus, number>())

	return STATUS_ORDER.filter((status) => counts.has(status)).map((status) => ({
		status,
		label: STATUS_LABELS[status],
		count: counts.get(status) ?? 0
	}))
}

/** Lowercase and accent-free, so "diseno" finds "Diseño" and "ia" finds "IA". */
export function normalizeText(value: string): string {
	return value
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
}

/**
 * Everything a visitor can type to find this project, flattened into one
 * normalized string and rendered once as `data-search`, so the client never
 * walks the DOM per keystroke.
 */
export function searchTextOf(project: Project): string {
	const fields = [
		project.title,
		project.description,
		project.client,
		project.company,
		project.role,
		...project.technologies.map((technology) => technology.name)
	].filter((value): value is string => Boolean(value))

	return normalizeText(fields.join(' '))
}
