/**
 * Editorial content for the capability sections of /skills and /about-style
 * surfaces. Everything here is *authored copy* (how Steve describes his way of
 * working), not factual claims: no employers, dates, awards or metrics are
 * invented. Figures shown next to this copy always come from the data files
 * (src/data/skills.ts, src/data/experiences.ts, cv.json).
 */

export interface SoftSkill {
	name: string
	description: string
	/** astro-icon name, mdi or logos set. */
	icon: string
}

export interface Principle {
	number: string
	title: string
	description: string
}

/** Competencias transversales, derived from the actual responsibilities held. */
export const softSkills: SoftSkill[] = [
	{
		name: 'Comunicación con clientes',
		description:
			'Traducir un pedido ambiguo en requerimientos concretos y devolver avances que se entiendan sin saber programar.',
		icon: 'mdi:forum-outline'
	},
	{
		name: 'Diagnóstico y análisis',
		description:
			'Leer datos, campañas y código para encontrar la causa antes de tocar una línea.',
		icon: 'mdi:magnify-scan'
	},
	{
		name: 'Aprendizaje continuo',
		description:
			'Cada proyecto deja una herramienta nueva; lo que aprendo termina documentado en el blog.',
		icon: 'mdi:book-open-page-variant-outline'
	},
	{
		name: 'Organización',
		description:
			'Priorizar por impacto y no por urgencia, entregando en partes que se puedan revisar.',
		icon: 'mdi:clipboard-check-outline'
	},
	{
		name: 'Adaptabilidad',
		description:
			'Del mantenimiento en WordPress a los modelos de datos: cambiar de stack sin perder el hilo del negocio.',
		icon: 'mdi:swap-horizontal'
	},
	{
		name: 'Trabajo con equipos no técnicos',
		description:
			'Marketing, ventas y dirección necesitan la misma información contada de tres formas distintas.',
		icon: 'mdi:account-group-outline'
	}
]

/** Cómo trabajo: cuatro principios, en el mismo orden en toda la web. */
export const principles: Principle[] = [
	{
		number: '01',
		title: 'Entender antes de construir',
		description:
			'Antes de elegir stack pregunto qué tiene que pasar para que el proyecto sea un éxito. La herramienta es la última decisión, no la primera.'
	},
	{
		number: '02',
		title: 'Medir antes de opinar',
		description:
			'Campañas, páginas y modelos: si no hay una métrica que pueda moverse, no hay forma de saber si el cambio sirvió.'
	},
	{
		number: '03',
		title: 'Escribir para quien viene después',
		description:
			'Código legible, nombres honestos y documentación mínima pero real. Lo que no se entiende en seis meses está roto.'
	},
	{
		number: '04',
		title: 'Entregar en partes',
		description:
			'Bloques pequeños y verificables en lugar de una entrega final. Se detecta antes lo que no funciona y se corrige barato.'
	}
]
