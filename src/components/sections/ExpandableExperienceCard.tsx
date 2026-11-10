'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { Experience } from '@/data/experiences'

interface ExpandableExperienceCardProps {
	exp: Experience
	index?: number
}

// Employment type is data (English enum) but reads as chrome on the card, so it
// gets a Spanish label here instead of leaking the raw value into the UI.
const TYPE_LABELS: Record<Experience['type'], string> = {
	internship: 'Pasantía',
	freelance: 'Freelance',
	contract: 'Contrato',
	'full-time': 'Tiempo completo',
	'part-time': 'Medio tiempo'
}

export default function ExpandableExperienceCard({
	exp,
	index = 0
}: ExpandableExperienceCardProps) {
	const [isExpanded, setIsExpanded] = useState(false)
	// A missing logo file must not leave a broken-image glyph in the card: it
	// falls back to the monogram the logo-less entries already use.
	const [logoFailed, setLogoFailed] = useState(false)
	// The <img> stays transparent until the file actually decodes, so a 404 never
	// paints a broken glyph — not even in the window before hydration.
	const [logoLoaded, setLogoLoaded] = useState(false)
	const logoRef = useRef<HTMLImageElement>(null)
	const panelId = useId()
	const shouldReduceMotion = useReducedMotion()

	// The image is server-rendered, so a 404 can fire before React hydrates and
	// the onError handler is never attached. Re-check the already-settled state
	// on mount instead of trusting onError alone.
	useEffect(() => {
		const img = logoRef.current
		if (!img || !img.complete) return
		if (img.naturalWidth === 0) setLogoFailed(true)
		else setLogoLoaded(true)
	}, [])

	const getDuration = (start: string, end?: string | null) => {
		const startDate = new Date(start)
		const endDate = end ? new Date(end) : new Date()
		const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
		const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44))

		if (diffMonths < 12) return `${diffMonths} months`
		const years = Math.floor(diffMonths / 12)
		const months = diffMonths % 12
		if (months === 0) return `${years} year${years === 1 ? '' : 's'}`
		return `${years} year${years === 1 ? '' : 's'} ${months} month${months === 1 ? '' : 's'}`
	}

	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		// `startDate` values are date-only strings, which JS parses as UTC
		// midnight. Formatting in local time (UTC-4) would shift them a month
		// back — 2024-01-01 rendered as "dic 2023" and disagreed with the
		// year rail. Pin the formatter to UTC.
		return date.toLocaleDateString('es-DO', {
			month: 'short',
			year: 'numeric',
			timeZone: 'UTC'
		})
	}

	const ordinal = String(index + 1).padStart(2, '0')

	const period = exp.endDate
		? `${formatDate(exp.startDate)} — ${formatDate(exp.endDate)}`
		: exp.isOngoing
			? `${formatDate(exp.startDate)} — Actual`
			: formatDate(exp.startDate)

	const externalUrl = Array.isArray(exp.externalLink) ? exp.externalLink[0] : exp.externalLink

	// Logo-less entries get a monogram so the text column keeps the same offset.
	const initials = exp.company
		.replace(/[^A-Za-z\u00C0-\u024F ]/g, '')
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((word) => word.charAt(0))
		.join('')
		.toUpperCase()

	// Aligns description and detail panel with the header's text column
	// (padding + 3rem/3.5rem logo tile + gap).
	const contentIndent = 'pl-[5.25rem] pr-5 md:pl-[6.75rem] md:pr-7'

	return (
		<article
			className={`hover-lift group relative overflow-hidden rounded-2xl border bg-white/5 ${
				isExpanded
					? 'border-[#c70039]/40 bg-white/[0.07]'
					: 'border-white/10 hover:border-[#c70039]/40'
			}`}
		>
			{/* Ambient accent wash, replaces the reference repo's slate/blue glow */}
			<div
				className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#c70039]/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
				aria-hidden="true"
			/>

			{/* Heading kept out of the button so the toggle keeps a short, readable name */}
			<h3 className="sr-only">{`${exp.position} — ${exp.company}`}</h3>

			<button
				type="button"
				aria-expanded={isExpanded}
				aria-controls={panelId}
				onClick={() => setIsExpanded((open) => !open)}
				className="tap relative z-10 flex w-full items-start gap-4 p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#c70039]/60 md:gap-6 md:p-7"
			>
				{/* Fixed logo column on every card so titles line up across the list.
				    The monogram is always painted underneath; the logo fades over it
				    only once it decodes, so a 404 leaves clean initials. */}
				<span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 font-poppins text-xs font-black uppercase text-white/40 transition-colors duration-300 group-hover:border-[#c70039]/40 md:h-14 md:w-14">
					<span aria-hidden="true">{initials}</span>
					{exp.logo && !logoFailed && (
						<img
							ref={logoRef}
							src={exp.logo}
							alt=""
							onError={() => setLogoFailed(true)}
							onLoad={() => setLogoLoaded(true)}
							className={`absolute inset-0 m-auto h-9 w-9 object-contain transition-opacity duration-300 md:h-10 md:w-10 ${
								logoLoaded ? 'opacity-100' : 'opacity-0'
							}`}
						/>
					)}
				</span>

				<span className="min-w-0 flex-1">
					<span className="block font-poppins text-lg font-black leading-tight text-white transition-colors duration-300 group-hover:text-[#c70039] md:text-xl">
						{exp.position}
					</span>

					<span className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/60 md:text-sm">
						<span className="font-semibold text-[#c70039]">{exp.company}</span>
						<span className="text-white/20" aria-hidden="true">
							•
						</span>
						<span>{exp.location}</span>
					</span>

					<span className="mt-3 flex flex-wrap items-center gap-2">
						<span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
							{period}
						</span>
						<span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/60">
							{TYPE_LABELS[exp.type]}
						</span>
					</span>
				</span>

				<span className="flex shrink-0 flex-col items-end gap-2">
					<span className="font-poppins text-[10px] font-black tracking-[0.2em] text-white/20">
						{ordinal}
					</span>
					<span
						className={`text-[#c70039] transition-transform duration-300 ${
							isExpanded ? 'rotate-180' : ''
						}`}
					>
						<svg
							className="h-5 w-5 md:h-6 md:w-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 14l-7 7m0 0l-7-7m7 7V3"
							/>
						</svg>
					</span>
				</span>
			</button>

			<p
				className={`relative z-10 pb-5 text-sm leading-relaxed text-white/60 md:pb-7 ${contentIndent}`}
			>
				{exp.description}
			</p>

			<AnimatePresence initial={false}>
				{isExpanded && (
					<motion.div
						key="details"
						id={panelId}
						role="region"
						aria-label={`Detalles de ${exp.position} en ${exp.company}`}
						initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
						animate={{ height: 'auto', opacity: 1 }}
						exit={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
						transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.35, ease: 'easeOut' }}
						className="relative z-10 overflow-hidden"
					>
						<div className={`pb-5 md:pb-7 ${contentIndent}`}>
							<div className="dotted-card relative rounded-xl border border-white/10 p-4 md:p-5">
								<span className="corner-tick corner-tick--tl" aria-hidden="true" />
								<span className="corner-tick corner-tick--br" aria-hidden="true" />

								{exp.responsibilities.length > 0 && (
									<div className="mb-5">
										<h4 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
											<span className="h-1 w-1 rounded-full bg-[#c70039]" aria-hidden="true" />
											Responsabilidades
										</h4>

										<ul className="mt-3 space-y-2">
											{exp.responsibilities.map((responsibility, i) => (
												<li
													key={i}
													className="flex items-start gap-3 text-xs leading-relaxed text-white/60 md:text-sm"
												>
													<span className="mt-0.5 shrink-0 text-[#c70039]" aria-hidden="true">
														→
													</span>
													<span>{responsibility}</span>
												</li>
											))}
										</ul>
									</div>
								)}

								{exp.skills.length > 0 && (
									<div className="mb-5">
										<h4 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
											<span className="h-1 w-1 rounded-full bg-[#c70039]" aria-hidden="true" />
											Tecnologías
										</h4>

										<div className="mt-3 flex flex-wrap gap-2">
											{exp.skills.map((skill, i) => (
												<span
													key={i}
													className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-white/60 transition-colors duration-200 hover:border-[#c70039]/40 hover:text-white"
												>
													{skill}
												</span>
											))}
										</div>
									</div>
								)}

								<div className="border-t border-white/10 pt-3">
									<p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
										Duración total
									</p>
									<p className="mt-1 text-sm font-semibold text-[#c70039]">
										{getDuration(exp.startDate, exp.endDate)}
									</p>
								</div>

								{externalUrl && (
									<div className="mt-5 border-t border-white/10 pt-4">
										<a
											href={externalUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="group/link inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#c70039] transition-[color,gap] duration-300 hover:gap-3 hover:text-white"
										>
											Ver sitio de la empresa
											<svg
												className="h-4 w-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												aria-hidden="true"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4m-4-6l6 6m0 0l-6 6m6-6H9"
												/>
											</svg>
										</a>
									</div>
								)}
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</article>
	)
}
