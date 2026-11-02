'use client';

import React from 'react';
import {
	GraduationCap,
	BookOpen,
	Binary,
	Sparkles,
	Clock,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';

interface EducationItem {
	id: string;
	institution: string;
	degree: string;
	major: string;
	isOngoing: boolean;
	gpa?: string;
	activities?: string[];
	achievements?: string[];
	startDate: string;
	endDate?: string;
}

const CornerAccents = ({ hoverClass }: { hoverClass: string }) => (
	<>
		<div
			className={cn(
				'absolute -top-[1px] -left-[1px] w-4 h-4 border-t-2 border-l-2 border-black/40 dark:border-white/40 z-20 pointer-events-none transition-colors duration-500',
				hoverClass
			)}
		/>
		<div
			className={cn(
				'absolute -top-[1px] -right-[1px] w-4 h-4 border-t-2 border-r-2 border-black/40 dark:border-white/40 z-20 pointer-events-none transition-colors duration-500',
				hoverClass
			)}
		/>
		<div
			className={cn(
				'absolute -bottom-[1px] -left-[1px] w-4 h-4 border-b-2 border-l-2 border-black/40 dark:border-white/40 z-20 pointer-events-none transition-colors duration-500',
				hoverClass
			)}
		/>
		<div
			className={cn(
				'absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b-2 border-r-2 border-black/40 dark:border-white/40 z-20 pointer-events-none transition-colors duration-500',
				hoverClass
			)}
		/>
	</>
);

interface EducationCardProps {
	education: EducationItem;
	variant: 'primary' | 'secondary' | 'tertiary';
	isLowPowerMode?: boolean;
}

type VariantStyle = {
	hoverClass: string;
	glowClass: string;
	hoverEffect: string;
	hoverTextClass: string;
	icon: React.ReactNode;
	accentIcon: React.ReactNode;
	accentColor: string;
	statusLabel: string;
	delay: number;
};

const getVariantStyle = (variant: 'primary' | 'secondary' | 'tertiary'): VariantStyle => {
	const styles = {
		primary: {
			hoverClass: 'group-hover:border-blue-500 dark:group-hover:border-blue-400',
			glowClass: 'hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.3)] hover:border-blue-500/50',
			hoverEffect: 'hover:-translate-y-2',
			hoverTextClass: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
			icon: <GraduationCap className="w-20 h-20 text-white drop-shadow-xl" />,
			accentIcon: <Binary className="w-8 h-8 text-blue-400 absolute -top-2 -right-2 opacity-80" />,
			accentColor: 'text-blue-400',
			statusLabel: 'Higher Education',
			delay: 0,
		},
		secondary: {
			hoverClass: 'group-hover:border-orange-500 dark:group-hover:border-orange-400',
			glowClass: 'hover:shadow-[0_0_40px_-10px_rgba(249,115,22,0.3)] hover:border-orange-500/50',
			hoverEffect: 'hover:scale-[1.02] hover:z-10',
			hoverTextClass: 'group-hover:text-orange-600 dark:group-hover:text-orange-400',
			icon: <BookOpen className="w-20 h-20 text-white drop-shadow-xl" />,
			accentIcon: <Sparkles className="w-6 h-6 text-yellow-400 absolute -bottom-2 -left-2" />,
			accentColor: 'text-yellow-400',
			statusLabel: 'Foundation',
			delay: 0.2,
		},
		tertiary: {
			hoverClass: 'group-hover:border-cyan-500 dark:group-hover:border-cyan-400',
			glowClass: 'hover:border-cyan-500/50 hover:shadow-[inset_0_0_30px_rgba(6,182,212,0.1),0_0_30px_-5px_rgba(6,182,212,0.3)]',
			hoverEffect: '',
			hoverTextClass: 'group-hover:text-cyan-600 dark:group-hover:text-cyan-400',
			icon: <Clock className="w-6 h-6 md:w-8 md:h-8 text-neutral-500 dark:text-neutral-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors" />,
			accentIcon: <Binary className="w-8 h-8 text-cyan-400" />,
			accentColor: 'text-cyan-400',
			statusLabel: 'Continuous Learning',
			delay: 0.4,
		},
	};
	return styles[variant];
};

const EducationCard: React.FC<EducationCardProps> = ({
	education,
	variant,
	isLowPowerMode = false,
}) => {
	const style = getVariantStyle(variant);
	const isTertiary = variant === 'tertiary';

	const displayStatus = education.isOngoing ? 'Current' : 'Completed';

	return (
		<motion.div
			initial={isLowPowerMode ? {} : { opacity: 0, y: 20 }}
			whileInView={isLowPowerMode ? {} : { opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.5, delay: style.delay }}
			className={cn(
				isTertiary ? 'col-span-1 md:col-span-2' : 'col-span-1',
				'border border-black/10 dark:border-white/10 bg-neutral-100 dark:bg-[#0a0a0a] overflow-hidden relative group',
				'flex flex-col min-h-[450px] transition-all duration-500',
				style.glowClass,
				style.hoverEffect,
				isTertiary && 'p-8 md:p-12 md:flex-row items-center justify-between gap-8'
			)}
		>
			<CornerAccents hoverClass={style.hoverClass} />

			{/* Text Section */}
			<div
				className={cn(
					'relative z-10 transition-transform duration-500',
					isTertiary && 'max-w-xl',
					!isTertiary && 'p-8 group-hover:translate-x-1'
				)}
			>
				<div className="flex items-center gap-2 mb-4">
					<span
						className={cn(
							'text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 transition-colors',
							style.hoverTextClass
						)}
					>
						{isTertiary ? (
							<>
								<Sparkles className="w-4 h-4 inline-block mr-2" />
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
						'font-black text-neutral-900 dark:text-white mb-4',
						isTertiary
							? 'text-3xl md:text-4xl group-hover:text-cyan-950 dark:group-hover:text-cyan-50'
							: 'text-3xl'
					)}
				>
					{isTertiary ? 'Coming Soon' : education.institution}
				</h3>

				<p
					className={cn(
						'text-sm md:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed',
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
							<p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-3 mt-4">
								{education.degree}
							</p>
						)}
						{education.gpa && (
							<p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
								GPA: {education.gpa}
							</p>
						)}
						{(education.activities || education.achievements) && (
							<ul className="space-y-2 mt-4">
								{(education.activities || [])
									.slice(0, 2)
									.map((item, idx) => (
										<li
											key={idx}
											className="text-sm text-neutral-600 dark:text-neutral-400 flex items-start gap-2"
										>
											<span className="text-blue-500 mt-1">✓</span>
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
				<div className="flex-1 flex items-center justify-center relative p-8 mt-auto border-t border-black/10 dark:border-white/10 bg-gradient-to-b from-transparent to-black/5 dark:to-white/5 overflow-hidden">
					<div className="absolute inset-0 opacity-10 pointer-events-none">
						<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
					</div>

					<div className="relative z-10 flex flex-col items-center transition-transform duration-500 group-hover:scale-105">
						<div className="relative mb-6">
							{style.icon}
							{style.accentIcon}
						</div>

						<div className="flex flex-wrap gap-2 justify-center mb-4">
							{(education.activities || []).slice(0, 2).map((activity, idx) => (
								<span
									key={idx}
									className="px-3 py-1 rounded-full text-[10px] bg-black/40 dark:bg-white/10 text-white border border-white/20 font-mono font-bold backdrop-blur-md shadow-lg group-hover:bg-blue-600/50 transition-colors"
								>
									{activity.split(' ')[0]}
								</span>
							))}
						</div>

						<p className="text-[10px] font-mono text-white/90 uppercase tracking-widest bg-black/50 px-2 py-1 rounded backdrop-blur-sm border border-white/10">
							{variant === 'primary'
								? 'Digital Innovation Hub'
								: 'Logical Foundation'}
						</p>
					</div>

					{!isLowPowerMode && (
						<div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-400/80 to-transparent animate-pulse z-20" />
					)}
				</div>
			) : (
				<div className="relative z-10 flex flex-wrap justify-center md:justify-end gap-4 mt-6 md:mt-0">
					<div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-[0.5rem] bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition-all duration-300 shadow-sm relative">
						<div className="w-6 h-6 rounded-full border-2 border-dashed border-cyan-500 dark:border-cyan-400 animate-[spin_3s_linear_infinite]"></div>
					</div>
					<div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-[0.5rem] bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md group-hover:-translate-y-1 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition-all duration-300 delay-75 shadow-sm relative">
						{style.icon}
					</div>
					<div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-[0.5rem] bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md group-hover:-translate-y-2 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition-all duration-300 delay-150 shadow-sm relative">
						<div className="flex gap-1">
							<span
								className="w-1.5 h-1.5 rounded-full bg-cyan-600 dark:bg-cyan-400 animate-bounce"
								style={{ animationDelay: '0ms' }}
							></span>
							<span
								className="w-1.5 h-1.5 rounded-full bg-cyan-600 dark:bg-cyan-400 animate-bounce"
								style={{ animationDelay: '150ms' }}
							></span>
							<span
								className="w-1.5 h-1.5 rounded-full bg-cyan-600 dark:bg-cyan-400 animate-bounce"
								style={{ animationDelay: '300ms' }}
							></span>
						</div>
					</div>
				</div>
			)}
		</motion.div>
	);
};

interface EducationStickyScrollProps {
	education: EducationItem[];
	isLowPowerMode?: boolean;
}

export default function EducationStickyScroll({
	education,
	isLowPowerMode = false,
}: EducationStickyScrollProps) {
	// Separate education items by type
	const primaryEdu = education.find(
		(e) =>
			e.degree.toLowerCase().includes('licenciatura') ||
			e.degree.toLowerCase().includes('bachelor')
	);
	const secondaryEdu = education.find(
		(e) =>
			e.degree.toLowerCase().includes('diplomado') ||
			e.degree.toLowerCase().includes('high school')
	);

	return (
		<div className="w-full max-w-6xl mx-auto p-4 md:p-8">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Primary Education (University) */}
				{primaryEdu && (
					<EducationCard
						education={primaryEdu}
						variant="primary"
						isLowPowerMode={isLowPowerMode}
					/>
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
						startDate: new Date().toISOString(),
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
	);
}
