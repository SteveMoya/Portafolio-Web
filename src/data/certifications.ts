import { certificates as cvCertificates } from '@cv'

export interface Certification {
	name: string
	issuer: string
	date: string // ISO YYYY-MM
	credentialUrl?: string
	icon: string // astro-icon mdi: name
}

/**
 * Presentation data for the "Certificaciones y logros" section, derived from
 * the canonical certificates list in cv.json (the same list shown under
 * Certificates on /about). Adding or removing a certificate in cv.json updates
 * this section automatically. Icons are a presentation concern, so they live
 * here keyed by certificate name; new certificates without a key fall back to
 * a generic icon.
 */
const ICON_BY_NAME: Record<string, string> = {
	'Digitaliza tu negocio paso a paso con las herramientas de Google': 'mdi:google',
	'Fundamentos de Marketing Digital': 'mdi:bullhorn-outline',
	'Protege tu negocio: ciberseguridad en el trabajo remoto': 'mdi:shield-lock-outline',
	'Habilidades digitales para profesionales': 'mdi:laptop',
	'Certificado Inbound': 'mdi:chart-line',
	'Diseño Web Adaptable (Responsive)': 'mdi:responsive'
}

const FALLBACK_ICON = 'mdi:certificate-outline'

export const certifications: Certification[] = cvCertificates.map((cert) => ({
	name: cert.name,
	issuer: cert.issuer,
	date: cert.date.slice(0, 7),
	credentialUrl: cert.url || undefined,
	icon: ICON_BY_NAME[cert.name] ?? FALLBACK_ICON
}))
