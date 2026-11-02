import { useState, type CSSProperties } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

interface SkillProps {
	name: string
	level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
	/** Kept for API parity with the data file; emoji are not rendered. */
	icon?: string
	category: string
}

interface HardSkillsNewProps {
	aiSkills: SkillProps[]
	softwareSkills: SkillProps[]
	additionalSkills: SkillProps[]
}

/**
 * Levels map onto the brand ramp: one accent (#c70039) stepped by opacity, so
 * proficiency reads as intensity instead of a rainbow of unrelated hues.
 */
const levelConfig = {
	beginner: {
		fill: 'bg-[#c70039]/40',
		label: 'Inicial',
		width: 40
	},
	intermediate: {
		fill: 'bg-[#c70039]/60',
		label: 'Intermedio',
		width: 60
	},
	advanced: {
		fill: 'bg-[#c70039]/80',
		label: 'Avanzado',
		width: 80
	},
	expert: {
		fill: 'bg-[#c70039]',
		label: 'Experto',
		width: 95
	}
}

const SkillCard = ({
	skill,
	delay,
	reduce
}: {
	skill: SkillProps
	delay: number
	reduce: boolean
}) => {
	const config = levelConfig[skill.level]

	return (
		<motion.div
			layout={!reduce}
			// Entrance animates position and scale only: opacity is never zeroed, so
			// the server-rendered card stays legible even if hydration never runs.
			initial={reduce ? false : { scale: 0.96, y: 10 }}
			animate={{ opacity: 1, scale: 1, y: 0 }}
			exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -10 }}
			transition={{ duration: reduce ? 0 : 0.3, delay: reduce ? 0 : delay }}
			className="w-full shrink-0"
		>
			{/* The hover lift lives on an inner element: framer-motion owns the
			    wrapper's inline transform, so a CSS scale on the same node would be
			    overridden once the entrance animation settles. */}
			<div className="dotted-card hover-lift group relative flex w-full flex-col justify-start rounded-2xl border border-white/10 p-5 transition-colors duration-300 hover:border-[#c70039]/40 md:p-6">
				<span className="corner-tick corner-tick--tl" aria-hidden="true" />
				<span className="corner-tick corner-tick--br" aria-hidden="true" />

				<div className="relative z-10">
					<div className="mb-4 flex flex-wrap items-start justify-between gap-2">
						<div className="flex flex-1 items-center gap-2.5">
							<span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 font-poppins text-[10px] font-black uppercase text-[#c70039] transition-colors duration-300 group-hover:border-[#c70039]/40">
								{skill.name.charAt(0)}
							</span>
							<h5 className="font-poppins text-sm font-bold tracking-tight text-white">
								{skill.name}
							</h5>
						</div>
						<span className="whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white/60">
							{config.label}
						</span>
					</div>

					{/* Proficiency bar: .bar-grow fills the track as the card enters the
					    viewport or immediately at its final width where a CSS scroll
					    timeline is unavailable. Still correct without JS. */}
					<div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
						<div
							style={{ '--bar-w': `${config.width}%` } as CSSProperties}
							className={`bar-grow h-full rounded-full ${config.fill}`}
						/>
					</div>
				</div>
			</div>
		</motion.div>
	)
}

export default function HardSkillsNew({
	aiSkills,
	softwareSkills,
	additionalSkills
}: HardSkillsNewProps) {
	const reduce = useReducedMotion() ?? false
	const [expanded, setExpanded] = useState<Record<string, boolean>>({
		ai: false,
		software: false,
		additional: false
	})

	const toggleExpand = (category: string) => {
		setExpanded((prev) => ({ ...prev, [category]: !prev[category] }))
	}

	const SkillColumn = ({
		title,
		skills: skillsList,
		categoryKey,
		delay
	}: {
		title: string
		skills: SkillProps[]
		categoryKey: string
		delay: number
	}) => {
		const isExpanded = expanded[categoryKey]
		const displayedSkills = isExpanded ? skillsList : skillsList.slice(0, 3)
		const hasMore = skillsList.length > 3

		return (
			<motion.div
				initial={reduce ? false : { y: 20 }}
				whileInView={{ y: 0 }}
				viewport={{ once: true }}
				transition={{ delay: reduce ? 0 : delay }}
				className="dotted-card relative flex h-full flex-col rounded-2xl border border-white/10 p-6"
			>
				<span className="corner-tick corner-tick--tl" aria-hidden="true" />
				<span className="corner-tick corner-tick--br" aria-hidden="true" />

				<div className="mb-6 flex items-center gap-3">
					<h3 className="font-poppins text-xs font-black uppercase tracking-[0.3em] text-white">
						{title}
					</h3>
					<span className="h-px flex-1 bg-white/10" />
					<span className="font-mono text-[10px] font-bold text-white/40">
						{String(skillsList.length).padStart(2, '0')}
					</span>
				</div>

				<div className="flex min-h-0 flex-grow flex-col gap-4 pb-4">
					<AnimatePresence>
						{displayedSkills.map((skill, idx) => (
							<SkillCard key={skill.name} skill={skill} delay={idx * 0.05} reduce={reduce} />
						))}
					</AnimatePresence>
				</div>

				{hasMore && (
					<button
						type="button"
						onClick={() => toggleExpand(categoryKey)}
						aria-expanded={isExpanded}
						className="tap flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-xs font-bold uppercase tracking-widest text-white/60 transition-colors duration-300 hover:border-[#c70039]/40 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c70039]"
					>
						{isExpanded ? (
							<>
								<span>Ver menos</span>
								<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M5 15l7-7 7 7"
									/>
								</svg>
							</>
						) : (
							<>
								<span>Ver más ({skillsList.length - 3})</span>
								<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M19 14l-7 7m0 0l-7-7m7 7V3"
									/>
								</svg>
							</>
						)}
					</button>
				)}
			</motion.div>
		)
	}

	return (
		<div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
			<SkillColumn title="IA aplicada" skills={aiSkills} categoryKey="ai" delay={0.1} />
			<SkillColumn
				title="Ingeniería de software"
				skills={softwareSkills}
				categoryKey="software"
				delay={0.2}
			/>
			<SkillColumn
				title="Habilidades adicionales"
				skills={additionalSkills}
				categoryKey="additional"
				delay={0.3}
			/>
		</div>
	)
}
