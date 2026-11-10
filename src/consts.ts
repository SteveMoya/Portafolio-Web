import {
  GITHUB_USERNAME as GITHUB_USERNAME_ENV,
  GITHUB_TOKEN as GITHUB_TOKEN_ENV,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} from "astro:env/server";

// GitHub es opcional en build: sin token el sitio omite los repositorios
// remotos en vez de romper. Producción lo define en Vercel.
export const GITHUB_USERNAME = GITHUB_USERNAME_ENV ?? "SteveMoya";
export const GITHUB_TOKEN = GITHUB_TOKEN_ENV ?? "";

export { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET };

export const MAX_POSTS = 5
