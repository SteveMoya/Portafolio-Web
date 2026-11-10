#!/usr/bin/env node
/**
 * Snapshot local de las colecciones de Cloudinary.
 *
 * El sitio carga cinco colecciones desde la Admin API de Cloudinary en build
 * time. Sin credenciales el build no se reproduce, así que cada colección tiene
 * un snapshot versionado en `src/data/cloudinary/<colección>.json` que el
 * loader usa como respaldo.
 *
 * Uso:
 *   bun run snapshot:cloudinary           # regenera los snapshots (requiere credenciales)
 *   bun run snapshot:cloudinary --check   # valida los snapshots, sin red ni credenciales
 *
 * Credenciales: PUBLIC_CLOUDINARY_CLOUD_NAME (o CLOUDINARY_CLOUD_NAME),
 * PUBLIC_CLOUDINARY_API_KEY (o CLOUDINARY_API_KEY) y CLOUDINARY_API_SECRET.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const COLLECTIONS = [
	{ folder: 'assets', limit: 200 },
	{ folder: 'fotografia', limit: 80 },
	{ folder: 'diseno', limit: 80 },
	{ folder: 'about_images' },
	{ folder: 'portafolio' }
]

const SNAPSHOT_DIR = fileURLToPath(new URL('../src/data/cloudinary/', import.meta.url))
const PAGE_SIZE = 100

function snapshotPath(folder) {
	return path.join(SNAPSHOT_DIR, `${folder}.json`)
}

function credentials() {
	return {
		cloudName: process.env.PUBLIC_CLOUDINARY_CLOUD_NAME ?? process.env.CLOUDINARY_CLOUD_NAME,
		apiKey: process.env.PUBLIC_CLOUDINARY_API_KEY ?? process.env.CLOUDINARY_API_KEY,
		apiSecret: process.env.CLOUDINARY_API_SECRET
	}
}

function authHeader({ apiKey, apiSecret }) {
	return `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`
}

async function adminRequest(cloudName, auth, endpoint, params) {
	const query = new URLSearchParams(params)
	const response = await fetch(
		`https://api.cloudinary.com/v1_1/${cloudName}${endpoint}?${query}`,
		{
			headers: {
				Authorization: auth,
				'User-Agent': 'portafolio-cloudinary-snapshot/1.0'
			}
		}
	)

	if (!response.ok) {
		throw new Error(`${endpoint} respondió ${response.status} ${response.statusText}`)
	}

	return response.json()
}

async function folderMode(cloudName, auth) {
	const data = await adminRequest(cloudName, auth, '/config', { settings: 'true' })
	const mode = data?.settings?.folder_mode

	if (mode !== 'dynamic' && mode !== 'fixed') {
		throw new Error(`Modo de carpetas de Cloudinary desconocido: ${String(mode)}`)
	}

	return mode
}

function toAsset(resource, folder) {
	return {
		public_id: resource.public_id,
		folder: resource.asset_folder ?? resource.folder ?? folder,
		format: resource.format,
		resource_type: resource.resource_type,
		type: resource.type,
		version: resource.version,
		secure_url: resource.secure_url,
		uploaded_at: resource.uploaded_at ?? resource.created_at
	}
}

async function listResources({ cloudName, auth, mode, folder, limit = PAGE_SIZE }) {
	const assets = []
	let cursor

	do {
		const params = {
			type: 'upload',
			max_results: String(Math.min(PAGE_SIZE, limit - assets.length))
		}

		if (cursor) params.next_cursor = cursor

		let endpoint
		if (mode === 'dynamic') {
			endpoint = '/resources/by_asset_folder'
			params.asset_folder = folder
		} else {
			endpoint = '/resources/image'
			params.prefix = folder
		}

		const page = await adminRequest(cloudName, auth, endpoint, params)
		const resources = Array.isArray(page.resources) ? page.resources : []
		assets.push(...resources.map((resource) => toAsset(resource, folder)))
		cursor = page.next_cursor
	} while (cursor && assets.length < limit)

	return assets.slice(0, limit)
}

async function refresh() {
	const { cloudName, apiKey, apiSecret } = credentials()
	const missing = [
		['PUBLIC_CLOUDINARY_CLOUD_NAME', cloudName],
		['PUBLIC_CLOUDINARY_API_KEY', apiKey],
		['CLOUDINARY_API_SECRET', apiSecret]
	]
		.filter(([, value]) => !value)
		.map(([name]) => name)

	if (missing.length > 0) {
		throw new Error(
			`Faltan credenciales para regenerar los snapshots: ${missing.join(', ')}. ` +
				'Usá `--check` para validar los snapshots existentes sin credenciales.'
		)
	}

	const auth = authHeader({ apiKey, apiSecret })
	const mode = await folderMode(cloudName, auth)
	await mkdir(SNAPSHOT_DIR, { recursive: true })

	for (const collection of COLLECTIONS) {
		const assets = await listResources({
			cloudName,
			auth,
			mode,
			folder: collection.folder,
			limit: collection.limit ?? PAGE_SIZE
		})

		const snapshot = {
			folder: collection.folder,
			cloudName,
			generatedAt: new Date().toISOString(),
			generatedBy: 'scripts/snapshot-cloudinary.mjs',
			uploadedAtSource: 'cloudinary-admin-api',
			assets
		}

		await writeFile(snapshotPath(collection.folder), `${JSON.stringify(snapshot, null, '\t')}\n`)
		console.log(`${collection.folder}: ${assets.length} assets`)
	}
}

function foldAccents(value) {
	return value.normalize('NFD').replace(/\p{Diacritic}/gu, '')
}

async function check() {
	const problems = []

	for (const collection of COLLECTIONS) {
		const file = snapshotPath(collection.folder)
		let snapshot

		try {
			snapshot = JSON.parse(await readFile(file, 'utf8'))
		} catch (error) {
			problems.push(`${collection.folder}: no se pudo leer ${file} (${error.message})`)
			continue
		}

		if (!Array.isArray(snapshot.assets)) {
			problems.push(`${collection.folder}: falta el array "assets"`)
			continue
		}

		if (collection.limit && snapshot.assets.length > collection.limit) {
			problems.push(
				`${collection.folder}: ${snapshot.assets.length} assets superan el límite ${collection.limit}`
			)
		}

		const prefix = foldAccents(collection.folder)
		const ids = new Set()

		snapshot.assets.forEach((asset, index) => {
			const where = `${collection.folder}[${index}]`

			if (typeof asset?.public_id !== 'string' || asset.public_id === '') {
				problems.push(`${where}: falta public_id`)
				return
			}

			if (!foldAccents(asset.public_id).startsWith(`${prefix}/`)) {
				problems.push(`${where}: public_id "${asset.public_id}" no vive en la carpeta ${collection.folder}`)
			}

			if (typeof asset.secure_url !== 'string' || !asset.secure_url.startsWith('https://')) {
				problems.push(`${where}: secure_url ausente o sin https`)
			}

			if (ids.has(asset.public_id)) {
				problems.push(`${where}: public_id duplicado "${asset.public_id}"`)
			}
			ids.add(asset.public_id)
		})
	}

	if (problems.length > 0) {
		console.error(`Snapshots inválidos (${problems.length}):`)
		problems.forEach((problem) => console.error(`- ${problem}`))
		process.exitCode = 1
		return
	}

	const total = COLLECTIONS.length
	console.log(`Snapshots válidos: ${total} colecciones.`)
}

const isCheck = process.argv.includes('--check')

try {
	await (isCheck ? check() : refresh())
} catch (error) {
	console.error(error.message)
	process.exitCode = 1
}
