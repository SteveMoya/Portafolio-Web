/**
 * Configuración de Cloudinary para construir URLs de imágenes en build time.
 *
 * El nombre de la nube es público y ya viaja en cada `secure_url` del sitio.
 * Se usa como respaldo para que un clone sin `.env` pueda construir las
 * imágenes con `CldImage`; si la variable está definida, manda la variable.
 */
const FALLBACK_CLOUD_NAME = 'dxji4alip'

export const cloudinaryCloudName: string =
	import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME ?? FALLBACK_CLOUD_NAME

export const cloudinaryConfig = { cloud: { cloudName: cloudinaryCloudName } }
