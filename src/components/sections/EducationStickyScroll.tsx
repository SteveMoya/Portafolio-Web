'use client'

import React from 'react'
import { GraduationCap, BookOpen, Binary, Sparkles, Clock } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface EducationItem {
	id: string
	institution: string
	degree: string
	major: string
	isOngoing: boolean
	gpa?: string
	activities?: string[]
	achievements?: string[]
	startDate: string
	endDate?: string
}

// Corner ticks mirror the .corner-tick utility used across the site: hairline
// white rules that turn brand red on hover.
const CornerAccents = ({ hoverClass }: { hoverClass: string }) => (
	<>
		<div
			className={cn(
				'pointer-events-none absolute -left-[1px] -top-[1px] z-20 h-4 w-4 border-l-2 border-t-2 border-white/30 transition-colors duration-500',
				hoverClass
			)}
		/>
		<div
			className={cn(
				'pointer-events-none absolute -right-[1px] -top-[1px] z-20 h-4 w-4 border-r-2 border-t-2 border-white/30 transition-colors duration-500',
				hoverClass
			)}
		/>
		<div
			className={cn(
				'pointer-events-none absolute -bottom-[1px] -left-[1px] z-20 h-4 w-4 border-b-2 border-l-2 border-white/30 transition-colors duration-500',
				hoverClass
			)}
		/>
		<div
			className={cn(
				'pointer-events-none absolute -bottom-[1px] -right-[1px] z-20 h-4 w-4 border-b-2 border-r-2 border-white/30 transition-colors duration-500',
				hoverClass
			)}
		/>
	</>
)

interface EducationCardProps {
	education: EducationItem
	variant: 'primary' | 'secondary' | 'tertiary'
	isLowPowerMode?: boolean
}

type VariantStyle = {
	hoverClass: string
	glowClass: string
	hoverEffect: string
	hoverTextClass: string
	icon: React.ReactNode
	accentIcon: React.ReactNode
	accentColor: string
	statusLabel: string
	delay: number
}

const getVariantStyle = (variant: 'primary' | 'secondary' | 'tertiary'): VariantStyle => {
	const styles = {
		primary: {
			hoverClass: 'group-hover:border-[#c70039]',
			glowClass: 'hover:shadow-[0_20px_40px_-15px_rgba(199,0,57,0.35)] hover:border-[#c70039]/50',
			hoverEffect: 'hover:scale-[1.015]',
			hoverTextClass: 'group-hover:text-[#c70039]',
			icon: <GraduationCap className="h-20 w-20 text-white drop-shadow-xl" />,
			accentIcon: <Binary className="absolute -right-2 -top-2 h-8 w-8 text-[#c70039] opacity-80" />,
			accentColor: 'text-[#c70039]',
			statusLabel: 'Higher Education',
			delay: 0
		},
		secondary: {
			hoverClass: 'group-hover:border-[#c70039]',
			glowClass: 'hover:shadow-[0_0_40px_-10px_rgba(199,0,57,0.35)] hover:border-[#c70039]/50',
			hoverEffect: 'hover:scale-[1.02] hover:z-10',
			hoverTextClass: 'group-hover:text-[#c70039]',
			icon: <BookOpen className="h-20 w-20 text-white drop-shadow-xl" />,
			accentIcon: <Sparkles className="absolute -bottom-2 -left-2 h-6 w-6 text-[#c70039]" />,
			accentColor: 'text-[#c70039]',
			statusLabel: 'Foundation',
			delay: 0.2
		},
		tertiary: {
			hoverClass: 'group-hover:border-[#c70039]',
			glowClass:
				'hover:border-[#c70039]/50 hover:shadow-[inset_0_0_30px_rgba(199,0,57,0.1),0_0_30px_-5px_rgba(199,0,57,0.3)]',
			hoverEffect: '',
			hoverTextClass: 'group-hover:text-[#c70039]',
			icon: (
				<Clock className="h-6 w-6 text-white/50 transition-colors group-hover:text-[#c70039] md:h-8 md:w-8" />
			),
			accentIcon: <Binary className="h-8 w-8 text-[#c70039]" />,
			accentColor: 'text-[#c70039]',
			statusLabel: 'Continuous Learning',
			delay: 0.4
		}
	}
	return styles[variant]
}

const EducationCard: React.FC<EducationCardProps> = ({
	education,
	variant,
	isLowPowerMode = false
}) => {
	const style = getVariantStyle(variant)
	const isTertiary = variant === 'tertiary'

	// Honour prefers-reduced-motion: the same code path the prop exposes, so
	// the card renders in its final state instead of animating in. `initial`
	// is `false` (not `{}`) there so no opacity:0 survives in the SSR markup.
	const prefersReducedMotion = useReducedMotion()
	const lowPower = isLowPowerMode || prefersReducedMotion === true

	const displayStatus = education.isOngoing ? 'Current' : 'Completed'

	// framer-motion writes `transform` inline once the entry animation settles,
	// which outranks the .hover-lift CSS transform. Drive the same 1.02 scale
	// through a motion value so the lift still happens when motion is allowed.
	return (
		<motion.div
			// The card must be visible in the SSR markup: an `opacity: 0` initial
			// style survives the server render, so with `client:visible` the whole
			// academic timeline stays blank until the island hydrates — and stays
			// blank forever with JS disabled. The house entrance animation lives in
			// the `.reveal` utility; here only the hover lift is animated.
			initial={false}
			whileHover={lowPower ? undefined : { scale: 1.02 }}
			transition={{ duration: 0.5, delay: style.delay }}
			className={cn(
				isTertiary ? 'col-span-1 md:col-span-2' : 'col-span-1',
				'hover-lift group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5',
				'flex min-h-[450px] flex-col transition-all duration-500',
				style.glowClass,
				style.hoverEffect,
				isTertiary && 'items-center justify-between gap-8 p-8 md:flex-row md:p-12'
			)}
		>
			<CornerAccents hoverClass={style.hoverClass} />

			{/* Text Section */}
			<div
				className={cn(
					'relative z-10 transition-transform duration-500',
					isTertiary && 'max-w-xl',
					!isTertiary && 'p-8'
				)}
			>
				<div className="mb-4 flex items-center gap-2">
					<span
						className={cn(
							'text-xs font-bold uppercase tracking-widest text-white/40 transition-colors',
							style.hoverTextClass
						)}
					>
						{isTertiary ? (
							<>
								<Sparkles className="mr-2 inline-block h-4 w-4" />
								{style.statusLabel}
							</>
						) : (
							<>
								{style.statusLabel}
								{education.isOngoing && ' • ' + displayStatus}
							</>
						)}
					</span>
				</div>

				<h3
					className={cn(
						'mb-4 font-black text-white',
						isTertiary ? 'text-3xl group-hover:text-white md:text-4xl' : 'text-3xl'
					)}
				>
					{isTertiary ? 'Coming Soon' : education.institution}
				</h3>

				<p
					className={cn(
						'text-sm leading-relaxed text-white/60 md:text-base',
						isTertiary ? 'mb-0' : 'mb-4'
					)}
				>
					{isTertiary
						? 'Always eager to expand my horizons. Future academic pursuits, specialized certifications, and continuous growth to stay at the forefront of technology.'
						: education.major}
				</p>

				{!isTertiary && (
					<>
						{education.degree && (
							<p className="mb-3 mt-4 text-lg font-semibold text-[#c70039]">{education.degree}</p>
						)}
						{education.gpa && <p className="mb-3 text-sm text-white/60">GPA: {education.gpa}</p>}
						{(education.activities || education.achievements) && (
							<ul className="mt-4 space-y-2">
								{(education.activities || []).slice(0, 2).map((item, idx) => (
									<li key={idx} className="flex items-start gap-2 text-sm text-white/60">
										<span className="mt-1 text-[#c70039]">✓</span>
										<span>{item}</span>
									</li>
								))}
							</ul>
						)}
					</>
				)}
			</div>

			{/* Visual Section */}
			{!isTertiary ? (
				<div
					className="relative mt-auto flex flex-1 items-center justify-center overflow-hidden border-t border-white/10 p-8"
					style={{
						background: 'linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.04))'
					}}
				>
					<div className="pointer-events-none absolute inset-0 opacity-10">
						<div
							className="absolute inset-0"
							style={{
								backgroundImage:
									'linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)',
								backgroundSize: '24px 24px'
							}}
						></div>
					</div>

					<div className="relative z-10 flex flex-col items-center transition-transform duration-500 group-hover:scale-105">
						<div className="relative mb-6">
							{style.icon}
							{style.accentIcon}
						</div>

						<div className="mb-4 flex flex-wrap justify-center gap-2">
							{(education.activities || []).slice(0, 2).map((activity, idx) => (
								<span
									key={idx}
									className="rounded-full border border-white/15 bg-white/10 px-3 py-1 font-mono text-[10px] font-bold text-white shadow-lg backdrop-blur-md transition-colors group-hover:bg-[#c70039]/40"
								>
									{activity.split(' ')[0]}
								</span>
							))}
						</div>

						<p className="rounded border border-white/10 bg-white/5 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-white/80 backdrop-blur-sm">
							{variant === 'primary' ? 'Digital Innovation Hub' : 'Logical Foundation'}
						</p>
					</div>

					{!lowPower && (
						<div
							className="absolute left-0 top-0 z-20 h-[2px] w-full animate-pulse"
							style={{
								background:
									'linear-gradient(to right, transparent, rgba(199, 0, 57, 0.8), transparent)'
							}}
						/>
					)}
				</div>
			) : (
				<div className="relative z-10 mt-6 flex flex-wrap justify-center gap-4 md:mt-0 md:justify-end">
					<div className="relative flex h-14 w-14 items-center justify-center rounded-[0.5rem] border border-white/10 bg-white/5 shadow-sm backdrop-blur-md transition-all duration-300 group-hover:border-[#c70039]/30 group-hover:bg-[#c70039]/10 md:h-16 md:w-16">
						<div className="h-6 w-6 animate-[spin_3s_linear_infinite] rounded-full border-2 border-dashed border-[#c70039] motion-reduce:animate-none"></div>
					</div>
					<div className="relative flex h-14 w-14 items-center justify-center rounded-[0.5rem] border border-white/10 bg-white/5 shadow-sm backdrop-blur-md transition-all delay-75 duration-300 group-hover:border-[#c70039]/30 group-hover:bg-[#c70039]/10 md:h-16 md:w-16">
						{style.icon}
					</div>
					<div className="relative flex h-14 w-14 items-center justify-center rounded-[0.5rem] border border-white/10 bg-white/5 shadow-sm backdrop-blur-md transition-all delay-150 duration-300 group-hover:border-[#c70039]/30 group-hover:bg-[#c70039]/10 md:h-16 md:w-16">
						<div className="flex gap-1">
							<span
								className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#c70039] motion-reduce:animate-none"
								style={{ animationDelay: '0ms' }}
							></span>
							<span
								className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#c70039] motion-reduce:animate-none"
								style={{ animationDelay: '150ms' }}
							></span>
							<span
								className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#c70039] motion-reduce:animate-none"
								style={{ animationDelay: '300ms' }}
							></span>
						</div>
					</div>
				</div>
			)}
		</motion.div>
	)
}

interface EducationStickyScrollProps {
	education: EducationItem[]
	isLowPowerMode?: boolean
}

export default function EducationStickyScroll({
	education,
	isLowPowerMode = false
}: EducationStickyScrollProps) {
	// Separate education items by type
	const primaryEdu = education.find(
		(e) =>
			e.degree.toLowerCase().includes('licenciatura') || e.degree.toLowerCase().includes('bachelor')
	)
	const secondaryEdu = education.find(
		(e) =>
			e.degree.toLowerCase().includes('diplomado') || e.degree.toLowerCase().includes('high school')
	)

	return (
		<div className="mx-auto w-full max-w-6xl p-4 md:p-8">
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				{/* Primary Education (University) */}
				{primaryEdu && (
					<EducationCard education={primaryEdu} variant="primary" isLowPowerMode={isLowPowerMode} />
				)}

				{/* Secondary Education */}
				{secondaryEdu && (
					<EducationCard
						education={secondaryEdu}
						variant="secondary"
						isLowPowerMode={isLowPowerMode}
					/>
				)}

				{/* Coming Soon / Certifications */}
				<EducationCard
					education={{
						id: 'coming-soon',
						institution: 'Coming Soon',
						degree: 'Continuous Learning',
						major: 'Future certifications and specializations',
						isOngoing: true,
						achievements: [],
						activities: [],
						startDate: new Date().toISOString()
					}}
					variant="tertiary"
					isLowPowerMode={isLowPowerMode}
				/>

				{/* Other Education Items */}
				{education
					.filter(
						(e) =>
							e !== primaryEdu &&
							e !== secondaryEdu &&
							!e.degree.toLowerCase().includes('licenciatura') &&
							!e.degree.toLowerCase().includes('bachelor') &&
							!e.degree.toLowerCase().includes('diplomado') &&
							!e.degree.toLowerCase().includes('high school')
					)
					.map((edu) => (
						<EducationCard
							key={edu.id}
							education={edu}
							variant="primary"
							isLowPowerMode={isLowPowerMode}
						/>
					))}
			</div>
		</div>
	)
}
