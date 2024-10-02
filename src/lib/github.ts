import {GITHUB_TOKEN, GITHUB_USERNAME } from "@src/consts"

import reposMock from "../mock/repost.json"
import languajesMock from "../mock/cervezamodeloMock.json"
import responseMDMock from "../mock/responseMDMock.json"
import READMEMock from "../mock/READMEMock.md"


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
        return repos
        
    } catch (error) {
        console.error('Error al buscar los repositorios',error)
        return
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
        console.error("Error al obtener las tecnologias utilizadas",error)
        return   
    }
    
}

export async function fetchFirstImageFromReadme(repo :string) {
    try {
        if (process.env.NODE_ENV === 'development') {
            const responseMD = responseMDMock
            const readmeContent = await (await fetch(responseMD.download_url)).text()
            const regex = /!\[.*?\]\((.*?)\)/g
            const images = [...readmeContent.matchAll(regex)].map((match) => match[1])
            const firstImageURL = images.length > 0 ? images[0] : null
            return firstImageURL

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

            const readmeContent = await fetch(data.download_url).then((res) => res.text())
            const regex = /!\[.*?\]\((.*?)\)/g
            const images = [...readmeContent.matchAll(regex)].map((match) => match[1])
            const firstImageURL = images.length > 0 ? images[0] : null
            return firstImageURL
    } catch (error) {
        console.error('Error al buscar la imagen en el README.md', error)
        return
        
    }
    
}