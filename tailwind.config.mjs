import defaultTheme from 'tailwindcss/defaultTheme'
// importar tailwind typography,
import { addDynamicIconSelectors } from '@iconify/tailwind';
// WEBSITE: https://tailwindcss-animations.vercel.app/


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
				mono	: ["JetBrains Mono", "monospace", defaultTheme.fontFamily.mono],
				poppins : ['Poppins', 'sans-serif', defaultTheme.fontFamily.sans],
				raleway : ['Raleway', 'sans-serif', defaultTheme.fontFamily.sans],
			},
    colors: {
        'blue': '#5fafd7',
        'green': '#87d787',
        skin: {
          hue: withOpacity("--color"),
          muted: withOpacity("--muted"),
          base: withOpacity("--color-text-base"),
          inverted: withOpacity("--color-text-inverted"),
        }
      },
      textColor: {
        skin: {
          base: withOpacity("--color-text-base"),
          muted: withOpacity("--color-text-muted"),
          inverted: withOpacity("--color-text-inverted"),
          hue: withOpacity("--color"),
        },
      },
      backgroundColor: {
        skin: {
          fill: withOpacity("--color-fill"),
          "button-accent": withOpacity("--color-button-accent"),
          "button-accent-hover": withOpacity("--color-button-accent-hover"),
          "button-muted": withOpacity("--color-button-muted"),
          hue: withOpacity("--color"),
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
  plugins: [addDynamicIconSelectors(), require('@tailwindcss/typography')],
};
