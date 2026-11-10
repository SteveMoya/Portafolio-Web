// List of categories for blog posts
export const CATEGORIES = [
	'Caso de Estudio',
	'Tecnologia',
	'Programación',
	'Marketing',
	'Diseño',
	'Productividad',
	'Fotografia',
	'Otros'
] as const

// List of statuses/categories/badges for portfolio projects.
// Shared between src/content.config.ts (Astro schema) and tina/config.ts
// (Tina admin UI) so both stay in sync.
export const PROJECT_STATUSES = ['active', 'completed', 'in_progress', 'archived'] as const
export const PROJECT_CATEGORIES = [
	'web',
	'mobile',
	'api',
	'ai',
	'backend',
	'devops',
	'frontend',
	'fullstack',
	'other'
] as const
export const PROJECT_BADGES = [
	'private',
	'client',
	'company',
	'open_source',
	'ai',
	'devops',
	'freelance',
	'work',
	'personal'
] as const
