'use client';

import { useState } from 'react';
import type { Experience } from '@/data/experiences';

interface ExpandableExperienceCardProps {
	exp: Experience;
	index?: number;
}

export default function ExpandableExperienceCard({
	exp,
	index,
}: ExpandableExperienceCardProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	const getDuration = (start: string, end?: string | null) => {
		const startDate = new Date(start);
		const endDate = end ? new Date(end) : new Date();
		const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
		const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44));

		if (diffMonths < 12) return `${diffMonths} months`;
		const years = Math.floor(diffMonths / 12);
		const months = diffMonths % 12;
		if (months === 0) return `${years} year${years === 1 ? '' : 's'}`;
		return `${years} year${years === 1 ? '' : 's'} ${months} month${months === 1 ? '' : 's'}`;
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('es-DO', {
			month: 'short',
			year: 'numeric',
		});
	};

	return (
		<div
			className={`group relative bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 md:p-8 transition-all duration-300 overflow-hidden cursor-pointer ${
				isExpanded
					? 'shadow-xl ring-1 ring-blue-500/30'
					: 'hover:border-blue-500/50 hover:shadow-lg'
			}`}
			onClick={() => setIsExpanded(!isExpanded)}
		>
			{/* Animated background glow on hover */}
			<div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent" />

			<div className="relative z-10">
				{/* Header Section */}
				<div className="flex gap-4 md:gap-6 items-start mb-6">
					{/* Logo */}
					{exp.logo && (
						<div className="w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center shrink-0 bg-white/5 border border-slate-600 overflow-hidden flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
							<img
								src={exp.logo}
								alt={exp.company}
								className="w-12 h-12 md:w-14 md:h-14 object-contain"
							/>
						</div>
					)}

					{/* Content */}
					<div className="flex-1 min-w-0">
						<h3 className="text-xl md:text-2xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors truncate">
							{exp.position}
						</h3>
						<div className="flex flex-wrap items-center gap-2 text-slate-300 mb-3">
							<span className="font-semibold text-blue-400">{exp.company}</span>
							<span className="text-slate-500">•</span>
							<span className="text-slate-400">{exp.location}</span>
						</div>

						{/* Metadata */}
						<div className="flex flex-wrap gap-3 text-xs md:text-sm text-slate-400">
							<span className="flex items-center gap-1">
								📅 {formatDate(exp.startDate)}
								{exp.endDate
									? ` - ${formatDate(exp.endDate)}`
									: exp.isOngoing
										? ' - Present'
										: ''}
							</span>
							<span>•</span>
							<span className="bg-blue-500/20 text-blue-200 px-2 py-0.5 rounded-full text-xs font-medium">
								{exp.type}
							</span>
						</div>
					</div>

					{/* Expand Indicator */}
					<div
						className={`text-blue-400 transition-transform duration-300 flex-shrink-0 ${
							isExpanded ? 'rotate-180' : ''
						}`}
					>
						<svg
							className="w-5 h-5 md:w-6 md:h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 14l-7 7m0 0l-7-7m7 7V3"
							/>
						</svg>
					</div>
				</div>

				{/* Description */}
				<p className="text-slate-300 text-sm md:text-base leading-relaxed mb-4">
					{exp.description}
				</p>

				{/* Expanded Content */}
				{isExpanded && (
					<>
						{/* Separator */}
						<div className="my-4 border-t border-slate-700" />

						{/* Key Responsibilities */}
						{exp.responsibilities && exp.responsibilities.length > 0 && (
							<div className="mb-6">
								<h4 className="text-xs md:text-sm font-semibold text-slate-200 mb-3 uppercase tracking-wide flex items-center gap-2">
									<span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
									Key Responsibilities
								</h4>
								<ul className="space-y-2">
									{exp.responsibilities.map((resp, i) => (
										<li
											key={i}
											className="flex items-start gap-3 text-xs md:text-sm text-slate-400"
										>
											<span className="text-blue-400 mt-1 flex-shrink-0">→</span>
											<span>{resp}</span>
										</li>
									))}
								</ul>
							</div>
						)}

						{/* Technologies */}
						{exp.skills && exp.skills.length > 0 && (
							<div className="mb-6">
								<h4 className="text-xs md:text-sm font-semibold text-slate-200 mb-3 uppercase tracking-wide flex items-center gap-2">
									<span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
									Technologies
								</h4>
								<div className="flex flex-wrap gap-2">
									{exp.skills.map((skill, i) => (
										<span
											key={i}
											className="bg-slate-700/50 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-600 hover:border-blue-400 hover:bg-slate-700 transition-all duration-200"
										>
											{skill}
										</span>
									))}
								</div>
							</div>
						)}

						{/* Duration */}
						<div className="text-xs text-slate-400 pt-2 border-t border-slate-700">
							<span className="text-emerald-400 font-semibold">
								Total Duration: {getDuration(exp.startDate, exp.endDate)}
							</span>
						</div>

						{/* External Link */}
						{exp.externalLink && (
							<div className="mt-4 pt-4 border-t border-slate-700">
								<a
									href={Array.isArray(exp.externalLink) ? exp.externalLink[0] : exp.externalLink}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-xs md:text-sm font-medium transition-colors group/link"
									onClick={(e) => e.stopPropagation()}
								>
									Visit Company Website
									<svg
										className="w-4 h-4 group-hover/link:translate-x-1 transition-transform"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
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
					</>
				)}
			</div>
		</div>
	);
}
