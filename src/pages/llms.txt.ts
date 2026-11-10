import type { APIRoute } from 'astro'

// Generated from `site` (astro.config) instead of a static file: the absolute
// URLs must follow the same host as the canonical tags, or they rot the moment
// the domain moves.
const base = import.meta.env.SITE.replace(/\/$/, '')

const body = `# Steve Moya

> Portafolio personal de Steve Moya, Digital Marketing Specialist y desarrollador web con base en Santo Domingo, República Dominicana. Especializado en campañas de marketing digital, desarrollo web (HTML, CSS, JavaScript, TypeScript, Astro) y optimización de sitios (rendimiento, SEO).

Steve Moya trabaja actualmente como Junior WebMaster en el Departamento de Marketing de International Contact Center (ICC), diseñando y desarrollando sitios web para clientes y gestionando campañas de marketing digital.

## Páginas principales

- [Inicio](${base}/): Presentación y resumen profesional.
- [Sobre mí](${base}/about): CV, experiencia laboral, educación y habilidades.
- [Portafolio](${base}/portafolio): Proyectos de desarrollo web, diseño y fotografía.
- [Blog](${base}/blog): Artículos sobre marketing digital y tecnología.

## Contacto

- LinkedIn: https://www.linkedin.com/in/steve-moya-cepeda/
- GitHub: https://github.com/stevemoya
`

export const GET: APIRoute = () => {
	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8'
		}
	})
}
