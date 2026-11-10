import type { GitHubRepo } from '@src/lib/github'

/**
 * Editorial "why it matters" overrides for a handful of repos. This is
 * placeholder/example content (same spirit as the certifications data
 * coming in a later slice) — most repos simply fall back to their real
 * GitHub `description` via `getRepoNote`.
 */
const repoNotes: Record<string, string> = {
	'acortador-de-links': 'Servicio de acortamiento de URLs con foco en simplicidad y despliegue rápido.',
	'AppTodo-Back-y-Front': 'Aplicación full-stack de gestión de tareas, con backend y frontend propios.',
	'Calculadora-Javascript': 'Ejercicio de lógica y UI resuelto con JavaScript puro, sin dependencias externas.'
}

/**
 * Looks up the editorial note for a repo by name. Falls back to the repo's
 * real `description` when there's no curated entry, and finally to an empty
 * string if neither is available.
 */
export function getRepoNote(repo: Pick<GitHubRepo, 'name' | 'description'>): string {
	return repoNotes[repo.name] ?? repo.description ?? ''
}
