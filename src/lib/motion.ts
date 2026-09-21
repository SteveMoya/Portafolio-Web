import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

declare global {
	interface Window {
		gsap: typeof gsap
		ScrollTrigger: typeof ScrollTrigger
	}
}

/**
 * Motion foundation for the whole site: a singleton GSAP + ScrollTrigger + Lenis
 * setup. `initMotion()` is idempotent and safe to call from every page load
 * (including Astro view-transition swaps) since it only builds the context once.
 */

export const reducedMotion = () =>
	typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

interface MotionContext {
	gsap: typeof gsap
	ScrollTrigger: typeof ScrollTrigger
	lenis: Lenis | null
}

let ctx: MotionContext | null = null

export function refreshScrollTriggers() {
	if (typeof window === 'undefined') return
	requestAnimationFrame(() => {
		ScrollTrigger.sort()
		ScrollTrigger.refresh()
	})
}

export function initMotion(): MotionContext {
	if (ctx) return ctx

	gsap.registerPlugin(ScrollTrigger)

	let lenis: Lenis | null = null
	if (!reducedMotion()) {
		lenis = new Lenis({ autoRaf: false })
		lenis.on('scroll', ScrollTrigger.update)
		gsap.ticker.add((time) => lenis!.raf(time * 1000))
		gsap.ticker.lagSmoothing(0)
	}

	ctx = { gsap, ScrollTrigger, lenis }
	if (typeof window !== 'undefined') {
		window.ScrollTrigger = ScrollTrigger
		window.gsap = gsap

		window.addEventListener('load', refreshScrollTriggers)
		document.addEventListener('astro:page-load', refreshScrollTriggers)
		document.addEventListener('astro:after-swap', refreshScrollTriggers)
		refreshScrollTriggers()
	}
	return ctx
}

export const getLenis = () => ctx?.lenis ?? null
export const getScrollTrigger = () => ctx?.ScrollTrigger ?? null
