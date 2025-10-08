import { GITHUB_TOKEN, GITHUB_USERNAME } from "@src/consts"

import reposMock from "../mock/repost.json"
import languajesMock from "../mock/cervezamodeloMock.json"
import responseMDMock from "../mock/responseMDMock.json"

export async function getRepos() {
    try {
        if (process.env.NODE_ENV === 'development') {
            const repos = reposMock
            return repos
        }
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos`, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`
            }
        })
        const repos = await response.json()

        // Obtener los lenguajes y las imágenes en paralelo para todos los repos
        const reposWithDetails = await Promise.all(
            repos.map(async (repo) => {
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

export async function getRepoLanguages(repo: string) {
    try {
        if (process.env.NODE_ENV === 'development') {
            const languages = languajesMock
            return Object.entries(languages).map(([lang, size]) => ({ name: lang, size }))
        }
        const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${repo}/languages`, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`
            }
        })
        const languages = await response.json()
        return Object.entries(languages).map(([lang, size]) => ({ name: lang, size }))
    } catch (error) {
        console.error("Error al obtener las tecnologias utilizadas", error)
        return []
    }
}

export async function fetchFirstImageFromReadme(repo: string) {
    try {
        if (process.env.NODE_ENV === 'development') {
            const responseMD = responseMDMock
            const readmeContent = await fetch(responseMD.download_url).then(res => res.text())
            const regex = /!\[.*?\]\((.*?)\)/g
            const images = [...readmeContent.matchAll(regex)].map((match) => match[1])
            return images.length > 0 ? images[0] : null
        }

        const response = await fetch(
            `https://api.github.com/repos/${GITHUB_USERNAME}/${repo}/contents/README.md`,
            {
                headers: {
                    Authorization: `token ${GITHUB_TOKEN}`
                }
            }
        )
        const data = await response.json()

        if (!data.download_url) {
            console.error('No se encontró el archivo README.md en el repositorio.')
            return null
        }

        const readmeContent = await fetch(data.download_url).then(res => res.text())
        const regex = /!\[.*?\]\((.*?)\)/g
        const images = [...readmeContent.matchAll(regex)].map((match) => match[1])
        return images.length > 0 ? images[0] : null
    } catch (error) {
        console.error('Error al buscar la imagen en el README.md', error)
        return null
    }
}