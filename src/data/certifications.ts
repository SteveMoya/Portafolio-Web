export interface Certification {
	name: string
	issuer: string
	date: string // ISO YYYY-MM
	credentialUrl?: string
	icon: string // astro-icon mdi: name
}

/**
 * Placeholder certifications, plausible for a Marketing Digital + Desarrollo
 * Web + IA/Datos profile. Replace with real credentials before shipping.
 */
export const certifications: Certification[] = [
	{
		name: 'Google Digital Marketing & E-commerce',
		issuer: 'Google',
		date: '2023-06',
		credentialUrl: 'https://www.credly.com/badges/example-google-digital-marketing',
		icon: 'mdi:bullhorn-outline'
	},
	{
		name: 'Meta Front-End Developer',
		issuer: 'Meta',
		date: '2024-02',
		credentialUrl: 'https://www.coursera.org/account/accomplishments/example-meta-frontend',
		icon: 'mdi:code-tags'
	},
	{
		name: 'Machine Learning for Everyone',
		issuer: 'freeCodeCamp',
		date: '2024-11',
		icon: 'mdi:robot-outline'
	}
]
