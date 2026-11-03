'use client'

/**
 * "Technical Universe" — the stack words become rigid bodies.
 *
 * Ported from the reference `FallingText` effect (Arfazrll/PersonalBlog,
 * `src/components/effects/FallingText.tsx`): every word is measured, turned
 * into a `matter-js` rectangle with restitution 0.8 and set in motion inside
 * four invisible walls, so it falls, collides, bounces and can be dragged.
 *
 * Deliberate differences from the reference:
 * - matter-js is imported inside the effect, so the engine never enters the
 *   island's initial bundle and is only fetched when the stage is about to be
 *   seen.
 * - The runner pauses when the stage leaves the viewport and resumes when it
 *   comes back. The original keeps a rAF and a runner alive for the rest of
 *   the page.
 * - `ResizeObserver` rebuilds the world with fresh measurements; the original
 *   keeps the bodies and walls of the first layout.
 * - Drag is only wired for fine pointers. `matter-js` listens to `touchmove`
 *   with `passive: false` and calls `preventDefault`, which would hijack the
 *   vertical scroll on a phone. Coarse pointers get an explicit "Sacudir"
 *   button instead — which is also the keyboard path the original lacks.
 * - `prefers-reduced-motion: reduce` never instantiates the engine. The words
 *   stay as a static, readable stack.
 * - The words are server-rendered as real text in normal flow: without JS the
 *   section reads as a tag cloud, never as a blank stage waiting for hydration.
 */

import { useCallback, useEffect, useRef, useState } from 'react'

type MatterApi = typeof import('matter-js')
type PhysicsBody = ReturnType<MatterApi['Bodies']['rectangle']>
type PhysicsEngine = ReturnType<MatterApi['Engine']['create']>
type PhysicsRunner = ReturnType<MatterApi['Runner']['create']>
type PhysicsMouse = ReturnType<MatterApi['Mouse']['create']>

interface WordBody {
	element: HTMLSpanElement
	body: PhysicsBody
}

interface Physics {
	pause: () => void
	resume: () => void
	impulse: () => void
	destroy: () => void
}

interface TechUniversePhysicsProps {
	/** Technology names rendered as bodies. Server-rendered as text. */
	words: string[]
	/** Words painted with the site accent instead of white. */
	highlightWords: string[]
	/** `engine.gravity.y`, exposed so the page can tune the fall speed. */
	gravity?: number
}

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const FINE_POINTER_QUERY = '(pointer: fine)'
const WALL_THICKNESS = 200
const WALL_INSET = 12

const buildWorld = (
	matter: MatterApi,
	stage: HTMLElement,
	track: HTMLElement,
	gravity: number
): Physics | null => {
	const stageRect = stage.getBoundingClientRect()
	const width = Math.round(stageRect.width)
	const height = Math.round(stageRect.height)
	if (width < 80 || height < 80) return null

	const spans = Array.from(track.querySelectorAll<HTMLSpanElement>('[data-word]'))
	if (!spans.length) return null

	const engine: PhysicsEngine = matter.Engine.create()
	engine.gravity.y = gravity

	const wordBodies: WordBody[] = spans.map((element) => {
		const rect = element.getBoundingClientRect()

		const body = matter.Bodies.rectangle(
			rect.left - stageRect.left + rect.width / 2,
			rect.top - stageRect.top + rect.height / 2,
			Math.max(rect.width, 12),
			Math.max(rect.height, 12),
			{ restitution: 0.8, frictionAir: 0.01, friction: 0.2, render: { visible: false } }
		)

		// The reference's opening kick: a small horizontal scatter plus a hint of
		// spin, so the block breaks apart instead of dropping as one line.
		matter.Body.setVelocity(body, { x: (Math.random() - 0.5) * 5, y: 0 })
		matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.05)

		element.style.position = 'absolute'
		element.style.left = '0'
		element.style.top = '0'

		return { element, body }
	})

	// Walls sit outside the visible box, thick enough that a fast word cannot
	// tunnel through between two engine steps. The floor and the sides are
	// inset by `WALL_INSET` so a resting word never clips against the border.
	const wallOptions = { isStatic: true, render: { visible: false } }
	const walls = [
		matter.Bodies.rectangle(
			width / 2,
			height - WALL_INSET + WALL_THICKNESS / 2,
			width + WALL_THICKNESS * 2,
			WALL_THICKNESS,
			wallOptions
		),
		matter.Bodies.rectangle(
			width / 2,
			WALL_INSET - WALL_THICKNESS / 2,
			width + WALL_THICKNESS * 2,
			WALL_THICKNESS,
			wallOptions
		),
		matter.Bodies.rectangle(
			WALL_INSET - WALL_THICKNESS / 2,
			height / 2,
			WALL_THICKNESS,
			height + WALL_THICKNESS * 2,
			wallOptions
		),
		matter.Bodies.rectangle(
			width - WALL_INSET + WALL_THICKNESS / 2,
			height / 2,
			WALL_THICKNESS,
			height + WALL_THICKNESS * 2,
			wallOptions
		)
	]

	// Dragging is desktop-only by design: see the header note about touch.
	let mouse: PhysicsMouse | null = null
	let mouseConstraint: ReturnType<MatterApi['MouseConstraint']['create']> | null = null
	let blockTouch: ((event: Event) => void) | null = null

	if (window.matchMedia(FINE_POINTER_QUERY).matches) {
		mouse = matter.Mouse.create(stage)
		mouseConstraint = matter.MouseConstraint.create(engine, {
			mouse,
			constraint: { stiffness: 0.2, render: { visible: false } }
		})

		// `Mouse.create` binds `touchmove` with `passive: false` on every device,
		// not only on touch-only ones. On a hybrid laptop that is enough to
		// swallow a vertical scroll started over the stage, so touch events are
		// stopped before they reach it. Drag stays a mouse gesture; a finger has
		// the "Sacudir" button.
		blockTouch = (event: Event) => event.stopImmediatePropagation()
		for (const type of ['touchstart', 'touchmove', 'touchend']) {
			stage.addEventListener(type, blockTouch, { capture: true, passive: true })
		}
	}

	matter.World.add(engine.world, [
		...walls,
		...(mouseConstraint ? [mouseConstraint] : []),
		...wordBodies.map(({ body }) => body)
	])

	const runner: PhysicsRunner = matter.Runner.create()
	let frame = 0
	let running = false

	// One rAF for all words, writing `transform` only: no layout is read back
	// inside the loop, so it never thrashes.
	const paint = () => {
		for (const { element, body } of wordBodies) {
			element.style.transform =
				`translate3d(${body.position.x}px, ${body.position.y}px, 0) ` +
				`translate(-50%, -50%) rotate(${body.angle}rad)`
		}
		frame = requestAnimationFrame(paint)
	}

	const pause = () => {
		if (!running) return
		running = false
		matter.Runner.stop(runner)
		cancelAnimationFrame(frame)
	}

	const resume = () => {
		if (running) return
		running = true
		matter.Runner.run(runner, engine)
		paint()
	}

	const impulse = () => {
		for (const { body } of wordBodies) {
			matter.Body.setVelocity(body, {
				x: (Math.random() - 0.5) * 14,
				y: -5 - Math.random() * 7
			})
			matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.3)
		}
	}

	const destroy = () => {
		running = false
		cancelAnimationFrame(frame)
		matter.Runner.stop(runner)
		if (blockTouch) {
			for (const type of ['touchstart', 'touchmove', 'touchend']) {
				stage.removeEventListener(type, blockTouch, { capture: true })
			}
		}
		if (mouse) matter.Mouse.clearSourceEvents(mouse)
		matter.World.clear(engine.world, false)
		matter.Engine.clear(engine)

		for (const { element } of wordBodies) {
			element.style.position = ''
			element.style.left = ''
			element.style.top = ''
			element.style.transform = ''
		}
	}

	return { pause, resume, impulse, destroy }
}

export default function TechUniversePhysics({
	words,
	highlightWords,
	gravity = 0.8
}: TechUniversePhysicsProps) {
	const stageRef = useRef<HTMLDivElement>(null)
	const trackRef = useRef<HTMLParagraphElement>(null)
	const physicsRef = useRef<Physics | null>(null)
	const bootRef = useRef<(() => Promise<Physics | null>) | null>(null)

	// `null` until measured: the server cannot know the pointer media query, so
	// the hint stays generic until the client says which device it is.
	const [coarsePointer, setCoarsePointer] = useState<boolean | null>(null)

	useEffect(() => {
		const stage = stageRef.current
		const track = trackRef.current
		if (!stage || !track) return

		setCoarsePointer(!window.matchMedia(FINE_POINTER_QUERY).matches)

		// No engine at all under reduced motion: the markup already is the
		// readable, static version of this section.
		if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return

		let disposed = false
		let inView = false
		let booting: Promise<Physics | null> | null = null

		const boot = (): Promise<Physics | null> => {
			if (physicsRef.current) return Promise.resolve(physicsRef.current)
			if (booting) return booting

			booting = (async () => {
				const module = await import('matter-js')
				const matter = (module.default ?? module) as unknown as MatterApi

				// Bodies are measured from the rendered spans: measuring before the
				// webfont settles would size them for the fallback font.
				if (document.fonts) await document.fonts.ready
				if (disposed) return null

				const physics = buildWorld(matter, stage, track, gravity)
				physicsRef.current = physics
				// A stage with no size yet (hidden tab, display:none) resolves null:
				// drop the cached promise so the next entry into view retries.
				if (!physics) booting = null
				return physics
			})()

			return booting
		}

		bootRef.current = boot

		const show = () => {
			void boot().then((physics) => {
				if (!disposed && inView) physics?.resume()
			})
		}

		const observer = new IntersectionObserver(
			(entries) => {
				inView = entries[0].isIntersecting
				if (inView) show()
				else physicsRef.current?.pause()
			},
			{ threshold: 0.15 }
		)
		observer.observe(stage)

		// Width changes invalidate every body and every wall: rebuild from fresh
		// measurements instead of scaling a stale world. Heights are fixed by CSS.
		let resizeFrame = 0
		const resizeObserver = new ResizeObserver(() => {
			cancelAnimationFrame(resizeFrame)
			resizeFrame = requestAnimationFrame(() => {
				if (!physicsRef.current) return
				physicsRef.current.destroy()
				physicsRef.current = null
				booting = null
				if (inView) show()
			})
		})
		resizeObserver.observe(stage)

		return () => {
			disposed = true
			cancelAnimationFrame(resizeFrame)
			observer.disconnect()
			resizeObserver.disconnect()
			physicsRef.current?.destroy()
			physicsRef.current = null
			bootRef.current = null
		}
	}, [gravity])

	const handleShake = useCallback(async () => {
		const boot = bootRef.current
		if (!boot) return
		const physics = await boot()
		physics?.impulse()
		physics?.resume()
	}, [])

	const isHighlighted = (word: string) =>
		highlightWords.some((highlight) => highlight.toLowerCase() === word.toLowerCase())

	return (
		<div className="relative">
			{/* The visual layer is decorative; the technologies are announced once,
			    as a list, instead of as a pile of stray spans. */}
			<p className="sr-only">Tecnologías: {words.join(', ')}.</p>

			<div
				ref={stageRef}
				aria-hidden="true"
				className="dotted-card relative h-[320px] overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] sm:h-[420px]"
				style={{ touchAction: 'pan-y' }}
			>
				<span className="corner-tick corner-tick--tl" />
				<span className="corner-tick corner-tick--br" />

				<p
					ref={trackRef}
					className="flex h-full flex-wrap content-center items-center justify-center gap-x-4 gap-y-3 px-6 text-center font-poppins text-xl font-black uppercase leading-none tracking-tight text-white/85 sm:text-2xl"
				>
					{words.map((word) => (
						<span
							key={word}
							data-word
							className={
								isHighlighted(word)
									? 'cursor-grab select-none text-[#c70039] active:cursor-grabbing'
									: 'cursor-grab select-none text-white/85 active:cursor-grabbing'
							}
							style={{ willChange: 'transform' }}
						>
							{word}
						</span>
					))}
				</p>
			</div>

			<div className="mt-5 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
				<p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 motion-safe:hidden">
					Versión estática: tenés activado «reducir movimiento».
				</p>

				<p className="hidden text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 motion-safe:block">
					{coarsePointer === false
						? 'Arrastrá una palabra y tirala: caen, chocan y rebotan'
						: 'Las palabras caen, chocan y rebotan — sacudí el campo'}
				</p>

				<button
					type="button"
					onClick={handleShake}
					className="tap inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2 text-[10px] font-bold uppercase tracking-[0.3em] text-white/70 transition-colors duration-150 hover:border-[#c70039]/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c70039] motion-reduce:hidden"
				>
					Sacudir
					<svg
						viewBox="0 0 24 24"
						aria-hidden="true"
						className="h-3.5 w-3.5 text-[#c70039]"
						fill="none"
						stroke="currentColor"
						strokeWidth="2.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M21 12a9 9 0 1 1-3-6.7" />
						<path d="M21 3v5h-5" />
					</svg>
				</button>
			</div>
		</div>
	)
}
