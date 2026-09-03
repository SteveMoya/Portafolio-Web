import { GITHUB_TOKEN, GITHUB_USERNAME } from '@src/consts'
import type { Project, Technology } from '@src/types/project'

import reposMock from '../mock/repost.json'
import languajesMock from '../mock/cervezamodeloMock.json'
import responseMDMock from '../mock/responseMDMock.json'

const EXCLUDED_REPOS = ['Portafolio-Web', 'SteveMoya', 'scripts', 'horas-trabajo', 'landing-horas-trabajo']

export interface GitHubRepo {
	name: string
	description: string | null
	html_url?: string
	homepage?: string | null
	pushed_at: string
	archived?: boolean
}

interface GitHubLanguage {
	name: string
	size: number
}

export async function getRepoLanguages(repo: string): Promise<GitHubLanguage[]> {
	try {
		if (process.env.NODE_ENV === 'development') {
			const languages = languajesMock
			return Object.entries(languages).map(([lang, size]) => ({ name: lang, size }))
		}
		const response = await fetch(
			`https://api.github.com/repos/${GITHUB_USERNAME}/${repo}/languages`,
			{
				headers: {
					Authorization: `token ${GITHUB_TOKEN}`
				}
			}
		)
		const languages = await response.json()
		return Object.entries(languages).map(([lang, size]) => ({
			name: lang,
			size: size as number
		}))
	} catch (error) {
		console.error('Error al obtener las tecnologias utilizadas', error)
		return []
	}
}

const BADGE_PATTERNS = [
	/img\.shields\.io/,
	/shields\/badge/,
	/static\/v1\?label=.*&message=.*badge/,
	/cdn\.buymeacoffee\.com/,
	/netlify\.com\/img\/deploy/,
	/paypal/
]

function isBadge(url: string): boolean {
	return BADGE_PATTERNS.some((pattern) => pattern.test(url))
}

function resolveReadmeImage(url: string, repo: string): string | null {
	// Salta los badges (shields.io, botones de donación, deploy, etc.)
	if (isBadge(url)) return null

	// Si ya es una URL absoluta, se usa tal cual
	if (/^https?:\/\//.test(url)) return url

	// Ruta relativa del README -> URL absoluta raw de GitHub (rama por defecto: main)
	const clean = url.replace(/^\//, '')
	return `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repo}/main/${clean}`
}

export async function fetchFirstImageFromReadme(repo: string): Promise<string | null> {
	try {
		if (process.env.NODE_ENV === 'development') {
			const responseMD = responseMDMock
			const readmeContent = await fetch(responseMD.download_url).then((res) => res.text())
			const extracted = extractReadmeImages(readmeContent, repo)
			return extracted.length > 0 ? extracted[0] : null
		}

		const response = await fetch(
			`https://api.github.com/repos/${GITHUB_USERNAME}/${repo}/contents/README.md`,
			{
				headers: {
					Authorization: `Bearer ${GITHUB_TOKEN}`
				}
			}
		)
		const data = await response.json()

		if (!data.download_url) {
			return null
		}

		const readmeContent = await fetch(data.download_url).then((res) => res.text())
		const images = extractReadmeImages(readmeContent, repo)
		return images.length > 0 ? images[0] : null
	} catch (error) {
		console.error('Error al buscar la imagen en el README.md', error)
		return null
	}
}

function extractReadmeImages(readmeContent: string, repo: string): string[] {
	const images: string[] = []

	// 1. Markdown: ![alt](url)
	const markdownRegex = /!\[[^\]]*\]\(([^)]+)\)/g
	for (const match of readmeContent.matchAll(markdownRegex)) {
		const resolved = resolveReadmeImage(match[1].trim(), repo)
		if (resolved) images.push(resolved)
	}

	// 2. HTML: <img src="...">
	const htmlRegex = /<img\b[^>]*?\bsrc=["']([^"']+)["']/gi
	for (const match of readmeContent.matchAll(htmlRegex)) {
		const resolved = resolveReadmeImage(match[1].trim(), repo)
		if (resolved) images.push(resolved)
	}

	return images
}

export async function getRepos(): Promise<GitHubRepo[]> {
	try {
		if (process.env.NODE_ENV === 'development') {
			const repos = reposMock as GitHubRepo[]
			return repos
		}
		const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos`, {
			headers: {
				Authorization: `token ${GITHUB_TOKEN}`
			}
		})
		const repos = (await response.json()) as GitHubRepo[]

		const reposWithDetails = await Promise.all(
			repos.map(async (repo: GitHubRepo) => {
				const [languages, firstImage] = await Promise.all([
					getRepoLanguages(repo.name),
					fetchFirstImageFromReadme(repo.name)
				])
				return {
					...repo,
					languages,
					firstImage
				}
			})
		)

		return reposWithDetails
	} catch (error) {
		console.error('Error al buscar los repositorios', error)
		return []
	}
}

export async function getGithubProjects(): Promise<Project[]> {
	const repos = await getRepos()

	const filteredRepos = repos.filter((repo) => !repo.archived && !EXCLUDED_REPOS.includes(repo.name))

	return Promise.all(
		filteredRepos.map(async (repo) => {
			const [languages, firstImage] = await Promise.all([
				getRepoLanguages(repo.name),
				fetchFirstImageFromReadme(repo.name)
			])

			const technologies: Technology[] = languages.map((lang) => ({
				name: lang.name,
				size: lang.size
			}))

			const badges: Project['badges'] = []
			if (!repo.homepage) {
				badges.push('open_source')
			}

			return {
				title: repo.name,
				description: repo.description || '',
				image: firstImage || '',
				demo: repo.homepage || undefined,
				repository: repo.html_url || undefined,
				technologies,
				updatedAt: new Date(repo.pushed_at),
				featured: false,
				order: 0,
				source: 'github' as const,
				private: false,
				status: 'active' as const,
				badges
			}
		})
	)
}
