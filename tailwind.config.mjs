import defaultTheme from 'tailwindcss/defaultTheme'
// importar tailwind typography,
import animations from "@midudev/tailwind-animations";
import { addDynamicIconSelectors } from '@iconify/tailwind';
// WEBSITE: https://tailwindcss-animations.vercel.app/
import scrollDrivenAnimations from "@adam.plesnik/tailwindcss-scroll-driven-animations"
// WEBSITE: https://scrolldriven.dev/

function withOpacity(variableName) {
	return ({ opacityValue }) => {
		if (opacityValue !== undefined) {
			return `rgba(var(${variableName}), ${opacityValue})`;
		}
		return `rgb(var(${variableName}))`;
	};
}

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
			textColor: {
				skin: {
					base: withOpacity("--color-text-base"),
					muted: withOpacity("--color-text-muted"),
					inverted: withOpacity("--color-text-inverted"),
				},
			},
			backgroundColor: {
				skin: {
					fill: withOpacity("--color-fill"),
					"button-accent": withOpacity("--color-button-accent"),
					"button-accent-hover": withOpacity("--color-button-accent-hover"),
					"button-muted": withOpacity("--color-button-muted"),
				},
			},
			colors: {
				skin: {
					hue: withOpacity("--color"),
					muted: withOpacity("--muted"),
				},
			},
			ringColor: {
				skin: {
					fill: withOpacity("--color-fill"),
				},
			},
			gradientColorStops: {
				skin: {
					hue: withOpacity("--color-fill"),
				},
			},
		},
	},
	plugins: [animations, addDynamicIconSelectors(), scrollDrivenAnimations, require('@tailwindcss/typography')],
}
