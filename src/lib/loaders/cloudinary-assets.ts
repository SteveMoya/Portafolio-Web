import { readFile } from 'node:fs/promises'
import type { Loader } from 'astro/loaders'
import { cldAssetsLoader } from 'astro-cloudinary/loaders'

/**
 * Loader de Cloudinary con respaldo offline.
 *
 * `cldAssetsLoader` consulta la Admin API en build time: sin credenciales el
 * sitio no se reconstruye. Este wrapper conserva ese comportamiento cuando las
 * credenciales están presentes (contenido fresco, como siempre) y, cuando no lo
 * están, sirve un snapshot JSON versionado en `src/data/cloudinary/`.
 *
 * El snapshot es el mismo shape que devuelve la Admin API, limitado a los
 * campos que el sitio consume (`public_id`, `secure_url`, `uploaded_at`).
 * Regenerarlo con `bun run snapshot:cloudinary` cuando haya credenciales.
 */

/** Credenciales que exige `cldAssetsLoader` (no las del schema de `astro:env`). */
const REQUIRED_CREDENTIALS = [
	'PUBLIC_CLOUDINARY_CLOUD_NAME',
	'PUBLIC_CLOUDINARY_API_KEY',
	'CLOUDINARY_API_SECRET'
] as const

type CredentialName = (typeof REQUIRED_CREDENTIALS)[number]

export interface CloudinarySnapshotAsset extends Record<string, unknown> {
	public_id: string
	folder: string
	format: string
	resource_type: string
	type: string
	version: number
	secure_url: string
	uploaded_at?: string
	display_name?: string
}

interface CloudinarySnapshotFile {
	folder: string
	cloudName?: string
	generatedAt?: string
	generatedBy?: string
	assets: CloudinarySnapshotAsset[]
}

export interface CloudinaryAssetsOptions {
	/** Carpeta de Cloudinary que se lista. */
	folder: string
	/** Máximo de assets a cargar, igual que en `cldAssetsLoader`. */
	limit?: number
	/** Archivo dentro de `src/data/cloudinary/`. Por defecto, `<folder>.json`. */
	snapshot?: string
}

function envValue(key: CredentialName): string | undefined {
	const value = (import.meta.env as Record<string, string | undefined>)[key]
	return value && value.trim() !== '' ? value : undefined
}

function snapshotLoader(options: CloudinaryAssetsOptions): Loader {
	const fileName = options.snapshot ?? `${options.folder}.json`
	const snapshotUrl = new URL(`../../data/cloudinary/${fileName}`, import.meta.url)

	return {
		name: `cloudinary-snapshot:${options.folder}`,
		load: async ({ store, logger, generateDigest }) => {
			let parsed: CloudinarySnapshotFile

			try {
				parsed = JSON.parse(await readFile(snapshotUrl, 'utf8')) as CloudinarySnapshotFile
			} catch (error) {
				throw new Error(
					`No se pudo leer el snapshot de Cloudinary "${fileName}": ${(error as Error).message}`
				)
			}

			if (!parsed || !Array.isArray(parsed.assets)) {
				throw new Error(`El snapshot de Cloudinary "${fileName}" no tiene un array "assets".`)
			}

			const assets = options.limit ? parsed.assets.slice(0, options.limit) : parsed.assets

			assets.forEach((asset, index) => {
				if (!asset || typeof asset.public_id !== 'string' || typeof asset.secure_url !== 'string') {
					throw new Error(
						`El snapshot de Cloudinary "${fileName}" tiene un asset inválido en la posición ${index}: faltan public_id o secure_url.`
					)
				}

				store.set({
					id: asset.public_id,
					data: asset,
					digest: generateDigest(asset)
				})
			})

			logger.info(
				`Cloudinary "${options.folder}": ${assets.length} assets desde el snapshot local "${fileName}".`
			)
		}
	}
}

export function cloudinaryAssets(options: CloudinaryAssetsOptions): Loader {
	const missing = REQUIRED_CREDENTIALS.filter((key) => !envValue(key))

	if (missing.length === REQUIRED_CREDENTIALS.length) {
		return snapshotLoader(options)
	}

	if (missing.length > 0) {
		// Configuración a medias: fallar fuerte en vez de servir contenido viejo
		// en producción sin que nadie lo note.
		throw new Error(
			`Credenciales de Cloudinary incompletas: falta ${missing.join(', ')}. ` +
				'Definí las tres para traer contenido fresco, o ninguna para usar el snapshot local.'
		)
	}

	return cldAssetsLoader({ folder: options.folder, limit: options.limit })
}
