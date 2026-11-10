'use client'

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
	X,
	Maximize2,
	ChevronLeft,
	ChevronRight,
	Minimize2,
	LayoutGrid,
	StretchHorizontal
} from 'lucide-react'

interface GalleryImage {
	id: string
	src: string
	alt: string
	category?: string
}

interface CleanFilmGridProps {
	images: GalleryImage[]
	columns?: 3 | 4
}

type ViewMode = 'grid' | 'rows'
type FilterType = 'all' | 'fotografia' | 'diseno'

const cn = (...classes: (string | undefined | boolean)[]) => {
	return classes.filter(Boolean).join(' ')
}

// Keyboard focus treatment shared by every interactive element in the grid.
const FOCUS_RING =
	'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c70039] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]'

// Lightbox navigation wraps at both ends, so -1 lands on the last image.
const wrapIndex = (index: number, total: number) => {
	if (total <= 0) return -1
	return ((index % total) + total) % total
}

const FILTER_LABELS: Record<FilterType, string> = {
	all: 'Todo',
	fotografia: 'Fotografía',
	diseno: 'Diseño'
}

export default function CleanFilmGrid({ images, columns = 3 }: CleanFilmGridProps) {
	const [selectedId, setSelectedId] = useState<string | null>(null)
	const [filter, setFilter] = useState<FilterType>('all')
	const [viewMode, setViewMode] = useState<ViewMode>('grid')
	const [isLightboxMaximized, setIsLightboxMaximized] = useState(false)
	const [visibleCount, setVisibleCount] = useState(12)
	const scrollContainerRef = useRef<Record<string, HTMLDivElement | null>>({})
	// Thumbnails by image id, so closing the dialog can hand focus back.
	const thumbRefs = useRef<Record<string, HTMLButtonElement | null>>({})
	const lastTriggerRef = useRef<string | null>(null)
	const wasOpenRef = useRef(false)
	const shouldReduceMotion = useReducedMotion()

	// Group items by category
	const groupedItems = useMemo(() => {
		let items = [...images]

		// Filter by category
		if (filter !== 'all') {
			items = items.filter((item) => item.category === filter)
		}

		// Group by category
		const groups: Record<string, typeof items> = {}
		items.forEach((item) => {
			const category = item.category || 'Sin categoría'
			if (!groups[category]) {
				groups[category] = []
			}
			groups[category].push(item)
		})

		return groups
	}, [filter, images])

	const categories = Object.keys(groupedItems).sort()
	const flattenedFilteredItems = useMemo(() => {
		return categories.flatMap((cat) => groupedItems[cat])
	}, [categories, groupedItems])

	const visibleItems = useMemo(() => {
		if (viewMode === 'rows') return []
		return flattenedFilteredItems.slice(0, visibleCount)
	}, [flattenedFilteredItems, visibleCount, viewMode])

	useEffect(() => {
		setVisibleCount(12)
	}, [filter])

	const currentIndex = flattenedFilteredItems.findIndex((item) => item.id === selectedId)

	// Lightbox stills the page behind it. Static build: `document` is only
	// touched from the client, never during SSR.
	useEffect(() => {
		if (!selectedId || typeof document === 'undefined') return

		const previousOverflow = document.body.style.overflow
		document.body.style.overflow = 'hidden'

		return () => {
			document.body.style.overflow = previousOverflow
		}
	}, [selectedId])

	const goToIndex = useCallback(
		(index: number) => {
			const bounded = wrapIndex(index, flattenedFilteredItems.length)
			if (bounded === -1) return
			const target = flattenedFilteredItems[bounded]
			if (target) setSelectedId(target.id)
		},
		[flattenedFilteredItems]
	)

	// Keyboard navigation while the dialog is open: arrows step, Home/End jump,
	// Escape closes. `window`/`document` guards keep this inert during SSR.
	useEffect(() => {
		if (!selectedId || typeof window === 'undefined' || typeof document === 'undefined') return

		const handleKeyDown = (event: KeyboardEvent) => {
			const { key } = event
			if (
				key !== 'Escape' &&
				key !== 'ArrowLeft' &&
				key !== 'ArrowRight' &&
				key !== 'Home' &&
				key !== 'End'
			) {
				return
			}

			// The lightbox owns the arrow keys: stop the page from scrolling.
			event.preventDefault()

			if (key === 'Escape') setSelectedId(null)
			else if (key === 'Home') goToIndex(0)
			else if (key === 'End') goToIndex(flattenedFilteredItems.length - 1)
			else goToIndex(currentIndex + (key === 'ArrowRight' ? 1 : -1))
		}

		document.addEventListener('keydown', handleKeyDown)

		return () => {
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [selectedId, currentIndex, flattenedFilteredItems.length, goToIndex])

	// Wherever the dialog was closed from (button, backdrop, Escape), focus goes
	// back to the thumbnail that opened it.
	useEffect(() => {
		if (selectedId) {
			wasOpenRef.current = true
			return
		}

		if (!wasOpenRef.current) return
		wasOpenRef.current = false

		const triggerId = lastTriggerRef.current
		if (!triggerId) return
		thumbRefs.current[triggerId]?.focus()
	}, [selectedId])

	// Lightbox Controls
	const openLightbox = (id: string) => {
		lastTriggerRef.current = id
		setSelectedId(id)
		setIsLightboxMaximized(false)
	}

	const closeLightbox = () => setSelectedId(null)

	const toggleMaximize = (e: React.MouseEvent) => {
		e.stopPropagation()
		setIsLightboxMaximized((prev) => !prev)
	}

	const nextImage = (e: React.MouseEvent) => {
		e.stopPropagation()
		goToIndex(currentIndex + 1)
	}

	const prevImage = (e: React.MouseEvent) => {
		e.stopPropagation()
		goToIndex(currentIndex - 1)
	}

	// Scroll to Category
	const scrollToCategory = (category: string) => {
		// Static build: document is only touched from the client.
		if (typeof document === 'undefined' || typeof window === 'undefined') return
		const element = document.getElementById(`category-${category}`)
		if (element) {
			const y = element.getBoundingClientRect().top + window.pageYOffset - 100
			window.scrollTo({ top: y, behavior: 'smooth' })
		}
	}

	// Horizontal Scroll Handler
	const scrollHorizontal = (category: string, direction: 'left' | 'right') => {
		const container = scrollContainerRef.current[category]
		if (container) {
			const scrollAmount = direction === 'left' ? -400 : 400
			container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
		}
	}

	return (
		<>
			<section className="relative min-h-screen bg-[#0a0a0a] px-6 pb-24 md:px-16 lg:px-24">
				{/* Controls bar — the section title is rendered by the page above. */}
				<div className="relative z-10 mx-auto mb-12 flex max-w-7xl flex-col items-start justify-between gap-6 border-b border-white/10 pb-6 md:flex-row md:items-end">
					<p
						className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40"
						aria-live="polite"
					>
						{flattenedFilteredItems.length} obras
					</p>

					{/* Controls Area */}
					<div className="flex w-full flex-wrap items-center gap-4 md:w-auto md:gap-8">
						{/* Filter Tabs */}
						<div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 shadow-inner backdrop-blur-md">
							{(['all', 'fotografia', 'diseno'] as FilterType[]).map((f) => (
								<button
									key={f}
									type="button"
									onClick={() => setFilter(f)}
									aria-pressed={filter === f}
									className={cn(
										'rounded-full px-5 py-2 text-xs font-medium tracking-wide transition-all duration-300',
										filter === f
											? 'bg-[#c70039] text-white shadow-md'
											: 'text-white/60 hover:bg-white/10 hover:text-white',
										FOCUS_RING
									)}
								>
									{FILTER_LABELS[f]}
								</button>
							))}
						</div>

						{/* Divider */}
						<div className="hidden h-8 w-px bg-white/10 md:block" />

						{/* View Toggle */}
						<div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 shadow-inner backdrop-blur-md">
							<button
								type="button"
								onClick={() => setViewMode('rows')}
								aria-pressed={viewMode === 'rows'}
								aria-label="Vista por filas"
								className={cn(
									'tap rounded-full p-2.5 transition-all duration-300',
									viewMode === 'rows'
										? 'bg-[#c70039] text-white shadow-md'
										: 'text-white/60 hover:bg-white/10 hover:text-white',
									FOCUS_RING
								)}
							>
								<StretchHorizontal className="h-4 w-4" />
							</button>
							<button
								type="button"
								onClick={() => setViewMode('grid')}
								aria-pressed={viewMode === 'grid'}
								aria-label="Vista de cuadrícula"
								className={cn(
									'tap rounded-full p-2.5 transition-all duration-300',
									viewMode === 'grid'
										? 'bg-[#c70039] text-white shadow-md'
										: 'text-white/60 hover:bg-white/10 hover:text-white',
									FOCUS_RING
								)}
							>
								<LayoutGrid className="h-4 w-4" />
							</button>
						</div>
					</div>
				</div>

				<div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row">
					{/* Quick Index (Sticky Sidebar) - Only visible in Rows mode */}
					{viewMode === 'rows' && (
						<div className="sticky top-32 hidden h-fit w-48 shrink-0 lg:block">
							<div className="border-l border-white/10 py-2 pl-6">
								<h3 className="mb-6 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/60">
									Colecciones
								</h3>
								<div className="flex flex-col gap-3">
									{categories.map((category, idx) => (
										<button
											key={category}
											type="button"
											onClick={() => scrollToCategory(category)}
											className={cn(
												'text-left text-sm capitalize text-white/60 transition-all duration-300 hover:pl-2 hover:text-white',
												FOCUS_RING
											)}
										>
											<span className="mr-2 font-mono text-[10px] opacity-40">
												{(idx + 1).toString().padStart(2, '0')}
											</span>
											{category}
										</button>
									))}
								</div>
							</div>
						</div>
					)}

					{/* Main Content Area */}
					<div className="min-w-0 flex-1 space-y-16">
						{/* Rows View */}
						{viewMode === 'rows' &&
							categories.map((category) => (
								<div key={category} id={`category-${category}`} className="group/section relative">
									{/* Section Header */}
									<div className="mb-6 flex items-center justify-between px-1">
										<h3 className="flex items-center gap-3 text-xl font-semibold capitalize text-white md:text-2xl">
											{category}
											<span className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-xs text-white/60">
												{groupedItems[category].length}
											</span>
										</h3>

										{/* Scroll Controls */}
										<div className="hidden items-center gap-2 opacity-0 transition-opacity duration-300 focus-within:opacity-100 group-hover/section:opacity-100 md:flex">
											<button
												type="button"
												onClick={() => scrollHorizontal(category, 'left')}
												aria-label={`Desplazar ${category} hacia la izquierda`}
												className={cn(
													'rounded-full border border-white/10 p-2 text-white/60 transition-all hover:border-white/20 hover:bg-white/5 hover:text-white',
													FOCUS_RING
												)}
											>
												<ChevronLeft className="h-4 w-4" />
											</button>
											<button
												type="button"
												onClick={() => scrollHorizontal(category, 'right')}
												aria-label={`Desplazar ${category} hacia la derecha`}
												className={cn(
													'rounded-full border border-white/10 p-2 text-white/60 transition-all hover:border-white/20 hover:bg-white/5 hover:text-white',
													FOCUS_RING
												)}
											>
												<ChevronRight className="h-4 w-4" />
											</button>
										</div>
									</div>

									{/* Horizontal Scroll Container */}
									<div
										ref={(el) => {
											scrollContainerRef.current[category] = el
										}}
										className="flex gap-4 overflow-x-auto px-1 pb-8"
										style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
									>
										{groupedItems[category].map((item, index) => (
											<motion.button
												key={item.id}
												ref={(el) => {
													thumbRefs.current[item.id] = el
												}}
												type="button"
												aria-label={`Ampliar imagen: ${item.alt}`}
												initial={shouldReduceMotion ? false : { scale: 0.96 }}
												whileInView={{ scale: 1 }}
												viewport={{ once: true, margin: '0px -50px 0px 0px' }}
												transition={
													shouldReduceMotion
														? { duration: 0 }
														: { duration: 0.5, delay: index * 0.1 }
												}
												onClick={() => openLightbox(item.id)}
												className={cn(
													'group/card relative aspect-video w-[85vw] flex-none cursor-pointer snap-center text-left md:w-[400px]',
													FOCUS_RING
												)}
											>
												<div className="relative h-full w-full overflow-hidden rounded-sm bg-white/5">
													<img
														src={item.src}
														alt={item.alt}
														className="h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-110"
													/>

													{/* Hover Overlay */}
													<div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 opacity-0 transition-all duration-300 group-hover/card:opacity-100">
														<motion.div
															whileHover={{ scale: 1.1 }}
															className="rounded-full border border-white/20 bg-white/10 p-4 backdrop-blur-md"
														>
															<Maximize2 className="h-6 w-6 text-white" />
														</motion.div>
													</div>

													{/* Gradient Bottom for Text readability */}
													<div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent opacity-60 transition-opacity duration-300 group-hover/card:opacity-90" />

													{/* Info overlay */}
													<div className="absolute bottom-2 left-4 right-4 z-20 transition-all duration-300 group-hover/card:bottom-4">
														<h4 className="truncate text-lg font-medium leading-tight text-white drop-shadow-md">
															{item.alt}
														</h4>
														<div className="mt-2 flex items-center justify-between opacity-0 transition-opacity delay-75 duration-300 group-hover/card:opacity-100">
															<span className="rounded-full border border-white/20 px-2 py-0.5 text-xs uppercase tracking-widest text-white/60">
																Ver
															</span>
														</div>
													</div>
												</div>
											</motion.button>
										))}
									</div>
								</div>
							))}

						{/* Grid View */}
						{viewMode === 'grid' && (
							<div className="space-y-12">
								<div
									className={`columns-1 gap-3 space-y-3 md:columns-2 ${columns === 4 ? 'lg:columns-4' : 'lg:columns-3'}`}
								>
									{visibleItems.map((item, index) => (
										<motion.button
											key={item.id}
											ref={(el) => {
												thumbRefs.current[item.id] = el
											}}
											type="button"
											aria-label={`Ampliar imagen: ${item.alt}`}
											initial={shouldReduceMotion ? false : { scale: 0.97 }}
											whileInView={{ scale: 1 }}
											viewport={{ once: true, margin: '-10%' }}
											transition={
												shouldReduceMotion
													? { duration: 0 }
													: { duration: 0.4, delay: index * 0.05 }
											}
											onClick={() => openLightbox(item.id)}
											className={cn(
												'group relative block w-full cursor-pointer break-inside-avoid text-left transition-all',
												FOCUS_RING
											)}
										>
											<div className="relative aspect-auto overflow-hidden rounded-none bg-white/5 transition-all duration-500 ease-out group-hover:rounded-2xl">
												<img
													src={item.src}
													alt={item.alt}
													className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-105"
												/>

												{/* Hover Overlay */}
												<div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 p-4 text-center opacity-0 transition-all duration-300 group-hover:opacity-100">
													<div className="mb-4 mt-4 rounded-full border border-white/20 bg-white/10 p-3 backdrop-blur-md transition-all duration-300 group-hover:mt-0">
														<Maximize2 className="h-5 w-5 text-white" />
													</div>
													<h3 className="mt-4 line-clamp-2 text-sm font-bold uppercase tracking-wide text-white transition-all delay-75 duration-300 group-hover:mt-0">
														{item.alt}
													</h3>
													{item.category && (
														<p className="mt-6 font-mono text-xs text-white/70 transition-all delay-100 duration-300 group-hover:mt-2">
															{item.category}
														</p>
													)}
												</div>
											</div>
										</motion.button>
									))}
								</div>

								{/* Load More Button */}
								{visibleCount < flattenedFilteredItems.length && (
									<div className="flex justify-center pb-12 pt-8">
										<button
											type="button"
											onClick={() => setVisibleCount((prev) => prev + 12)}
											className={cn(
												'group relative mt-6 flex flex-col items-center gap-4 px-8 py-4',
												FOCUS_RING
											)}
										>
											<span className="absolute top-[-10px] whitespace-nowrap font-mono text-[11px] font-bold uppercase tracking-[3px] text-white opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100">
												Cargar más
											</span>
											<div className="z-10 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 shadow-sm transition-all duration-500 ease-out group-hover:scale-110 group-hover:bg-white group-hover:text-[#0a0a0a] group-hover:shadow-xl">
												<svg
													className="h-5 w-5"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
													/>
												</svg>
											</div>
										</button>
									</div>
								)}
							</div>
						)}

						{categories.length === 0 && (
							<div className="py-20 text-center">
								<p className="font-mono text-white/60">No hay obras para este filtro.</p>
							</div>
						)}
					</div>
				</div>
			</section>

			{/* Advanced Lightbox */}
			<AnimatePresence>
				{selectedId && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						role="dialog"
						aria-modal="true"
						aria-label={`Vista ampliada: ${flattenedFilteredItems[currentIndex]?.alt ?? ''}`}
						className={cn(
							'fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 transition-all duration-300',
							isLightboxMaximized ? 'bg-black' : ''
						)}
						onClick={closeLightbox}
					>
						{/* Toolbar */}
						<div
							className="absolute left-0 top-0 z-[110] flex w-full items-center justify-between p-6"
							onClick={(e) => e.stopPropagation()}
						>
							{/* Current collection, mirroring the archive's filing language */}
							<div className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/40">
								{flattenedFilteredItems[currentIndex]?.category ?? ''}
							</div>

							{/* Actions */}
							<div className="flex items-center gap-4">
								<span
									className="font-mono text-sm tabular-nums text-white/70"
									aria-live="polite"
									aria-atomic="true"
								>
									{currentIndex + 1} / {flattenedFilteredItems.length}
								</span>
								<button
									type="button"
									onClick={toggleMaximize}
									aria-label={isLightboxMaximized ? 'Restaurar tamaño' : 'Maximizar'}
									className={cn(
										'rounded-full bg-white/5 p-3 text-white transition-colors hover:bg-white/10',
										FOCUS_RING
									)}
								>
									{isLightboxMaximized ? (
										<Minimize2 className="h-5 w-5 text-white" />
									) : (
										<Maximize2 className="h-5 w-5 text-white" />
									)}
								</button>
								<button
									type="button"
									onClick={closeLightbox}
									aria-label="Cerrar"
									className={cn(
										'rounded-full bg-white/5 p-3 text-white transition-colors hover:bg-[#c70039]/20 hover:text-[#c70039]',
										FOCUS_RING
									)}
								>
									<X className="h-5 w-5" />
								</button>
							</div>
						</div>

						{/* Navigation Arrows */}
						<button
							type="button"
							onClick={prevImage}
							aria-label="Imagen anterior"
							className={cn(
								'tap absolute left-3 top-[calc(50%-2rem)] z-[110] rounded-full border border-white/20 bg-black/50 p-3 text-white backdrop-blur-sm transition-all hover:bg-black/80 md:left-6 md:p-4',
								FOCUS_RING
							)}
						>
							<ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
						</button>

						<button
							type="button"
							onClick={nextImage}
							aria-label="Imagen siguiente"
							className={cn(
								'tap absolute right-3 top-[calc(50%-2rem)] z-[110] rounded-full border border-white/20 bg-black/50 p-3 text-white backdrop-blur-sm transition-all hover:bg-black/80 md:right-6 md:p-4',
								FOCUS_RING
							)}
						>
							<ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
						</button>

						{/* Content Container */}
						<motion.div
							layout
							className={cn(
								'relative w-full transition-all duration-500',
								isLightboxMaximized
									? 'h-screen w-screen px-0 py-0'
									: 'aspect-video h-[70vh] max-w-5xl px-6'
							)}
							onClick={(e) => e.stopPropagation()}
						>
							<div
								className={cn(
									'relative flex h-full w-full items-center justify-center overflow-hidden',
									isLightboxMaximized ? 'rounded-none' : 'rounded-sm'
								)}
							>
								<img
									src={flattenedFilteredItems[currentIndex].src}
									alt={flattenedFilteredItems[currentIndex].alt}
									className="h-full w-full object-contain"
								/>
							</div>
						</motion.div>

						{/* Caption */}
						{!isLightboxMaximized && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								className="mt-8 max-w-2xl px-6 text-center"
								onClick={(e) => e.stopPropagation()}
							>
								<h3 className="mb-2 text-2xl font-medium text-white">
									{flattenedFilteredItems[currentIndex].alt}
								</h3>
								{flattenedFilteredItems[currentIndex].category && (
									<p className="text-sm text-white/60">
										{flattenedFilteredItems[currentIndex].category}
									</p>
								)}
							</motion.div>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</>
	)
}
