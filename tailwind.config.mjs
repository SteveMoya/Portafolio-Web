import defaultTheme from 'tailwindcss/defaultTheme'
// importar tailwind typography,
import { addDynamicIconSelectors } from '@iconify/tailwind';
// WEBSITE: https://tailwindcss-animations.vercel.app/

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				monoton : ['Monoton', 'cursive', defaultTheme.fontFamily.mono],
				poppins : ['Poppins', 'sans-serif', defaultTheme.fontFamily.sans],
				raleway : ['Raleway', 'sans-serif', defaultTheme.fontFamily.sans],
			},
		},
	},
	plugins: [addDynamicIconSelectors(),  require('@tailwindcss/typography')],
}
