export type ProjectSource = 'github' | 'content'

export type ProjectStatus = 'active' | 'completed' | 'in_progress' | 'archived'

export type ProjectCategory =
	| 'web'
	| 'mobile'
	| 'api'
	| 'ai'
	| 'backend'
	| 'devops'
	| 'frontend'
	| 'fullstack'
	| 'other'

export type ProjectBadge =
	| 'private'
	| 'client'
	| 'company'
	| 'open_source'
	| 'ai'
	| 'devops'
	| 'freelance'
	| 'work'
	| 'personal'

export interface Technology {
	name: string
	size?: number
}

export interface Project {
	title: string
	description: string
	image: string
	demo?: string
	repository?: string
	technologies: Technology[]
	updatedAt: Date
	featured: boolean
	order: number
	source: ProjectSource
	company?: string
	client?: string
	role?: string
	private?: boolean
	status?: ProjectStatus
	category?: ProjectCategory
	badges?: ProjectBadge[]
}
