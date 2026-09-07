/**
 * Lightweight 3D card tilt & spotlight glare effect
 * Uses CSS custom properties (--rx, --ry, --gx, --gy, --glare-opacity)
 * Hardware-accelerated with requestAnimationFrame
 */
export function initTiltCards(selector = '[data-tilt-card]', maxRotation = 7): () => void {
	if (typeof window === 'undefined') return () => {}

	// Honor accessibility preference and device input capability
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
	const isFinePointer = window.matchMedia('(pointer: fine)').matches
	if (prefersReducedMotion || !isFinePointer) return () => {}

	const cards = document.querySelectorAll<HTMLElement>(selector)
	const cleanups: Array<() => void> = []

	cards.forEach((card) => {
		// Avoid attaching duplicate listeners if re-run
		if (card.dataset.tiltInitialized === 'true') return
		card.dataset.tiltInitialized = 'true'

		let rafId: number | null = null
		let bounds: DOMRect | null = null

		const onPointerEnter = () => {
			bounds = card.getBoundingClientRect()
			card.style.transition = 'box-shadow 0.3s ease, border-color 0.3s ease'
			card.style.setProperty('--glare-opacity', '1')
		}

		const onPointerMove = (e: PointerEvent) => {
			if (!bounds) bounds = card.getBoundingClientRect()

			if (rafId !== null) cancelAnimationFrame(rafId)

			rafId = requestAnimationFrame(() => {
				if (!bounds) return
				// Normalized coordinates: 0 (top-left) to 1 (bottom-right)
				const x = Math.max(0, Math.min(1, (e.clientX - bounds.left) / bounds.width))
				const y = Math.max(0, Math.min(1, (e.clientY - bounds.top) / bounds.height))

				const limit = parseFloat(card.dataset.tiltMax || '') || maxRotation
				// Invert Y for rotateX: looking up should tilt up
				const rx = ((y - 0.5) * -limit).toFixed(2)
				const ry = ((x - 0.5) * limit).toFixed(2)

				const gx = (x * 100).toFixed(1)
				const gy = (y * 100).toFixed(1)

				card.style.setProperty('--rx', `${rx}deg`)
				card.style.setProperty('--ry', `${ry}deg`)
				card.style.setProperty('--gx', `${gx}%`)
				card.style.setProperty('--gy', `${gy}%`)
			})
		}

		const onPointerLeave = () => {
			if (rafId !== null) cancelAnimationFrame(rafId)
			bounds = null
			card.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.5s ease, border-color 0.5s ease'
			card.style.setProperty('--rx', '0deg')
			card.style.setProperty('--ry', '0deg')
			card.style.setProperty('--glare-opacity', '0')
		}

		card.addEventListener('pointerenter', onPointerEnter)
		card.addEventListener('pointermove', onPointerMove)
		card.addEventListener('pointerleave', onPointerLeave)

		cleanups.push(() => {
			card.removeEventListener('pointerenter', onPointerEnter)
			card.removeEventListener('pointermove', onPointerMove)
			card.removeEventListener('pointerleave', onPointerLeave)
			delete card.dataset.tiltInitialized
		})
	})

	return () => {
		cleanups.forEach((cleanup) => cleanup())
	}
}
