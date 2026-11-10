import React from 'react';
import { motion } from 'framer-motion';
import { Binary } from 'lucide-react';

interface EducationItemProps {
	institution: string;
	degree: string;
	major: string;
	logo?: string;
	status: string;
	highlights: string[];
	icon: React.ReactNode;
	iconColor: string;
	hoverColor: string;
	glowColor: string;
	isLowPowerMode?: boolean;
}

const CornerAccents = ({ hoverClass }: { hoverClass: string }) => (
	<>
		<div
			className={`absolute -top-[1px] -left-[1px] w-4 h-4 border-t-2 border-l-2 border-black/40 dark:border-white/40 z-20 pointer-events-none transition-colors duration-500 ${hoverClass}`}
		/>
		<div
			className={`absolute -top-[1px] -right-[1px] w-4 h-4 border-t-2 border-r-2 border-black/40 dark:border-white/40 z-20 pointer-events-none transition-colors duration-500 ${hoverClass}`}
		/>
		<div
			className={`absolute -bottom-[1px] -left-[1px] w-4 h-4 border-b-2 border-l-2 border-black/40 dark:border-white/40 z-20 pointer-events-none transition-colors duration-500 ${hoverClass}`}
		/>
		<div
			className={`absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b-2 border-r-2 border-black/40 dark:border-white/40 z-20 pointer-events-none transition-colors duration-500 ${hoverClass}`}
		/>
	</>
);

function EducationCard({
	institution,
	degree,
	major,
	status,
	highlights,
	icon,
	hoverColor,
	glowColor,
	isLowPowerMode = false,
}: EducationItemProps) {
	return (
		<motion.div
			initial={isLowPowerMode ? {} : { opacity: 0, y: 20 }}
			whileInView={isLowPowerMode ? {} : { opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.5 }}
			className={`col-span-1 border border-black/10 dark:border-white/10 bg-neutral-100 dark:bg-[#0a0a0a] overflow-hidden relative group flex flex-col min-h-[400px] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_${glowColor}] hover:${hoverColor}`}
		>
			<CornerAccents
				hoverClass={`group-hover:border-blue-500 dark:group-hover:border-blue-400`}
			/>

			{/* Text Section */}
			<div className="p-8 relative z-10 transition-transform duration-500 group-hover:translate-x-1">
				<div className="flex items-center gap-2 mb-4">
					<span className="text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
						{status}
					</span>
				</div>
				<h3 className="text-3xl font-black text-neutral-900 dark:text-white mb-2">
					{institution}
				</h3>
				<p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-3">
					{degree}
				</p>
				<p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
					{major}
				</p>
				<ul className="space-y-2">
					{highlights.map((highlight, idx) => (
						<li
							key={idx}
							className="text-sm text-neutral-600 dark:text-neutral-400 flex items-start gap-2"
						>
							<span className="text-blue-500 mt-1">✓</span>
							<span>{highlight}</span>
						</li>
					))}
				</ul>
			</div>

			{/* Visual Section */}
			<div className="flex-1 flex items-center justify-center relative p-8 mt-auto border-t border-black/10 dark:border-white/10 bg-gradient-to-b from-transparent to-black/5 dark:to-white/5 overflow-hidden">
				<div className="absolute inset-0 opacity-10 pointer-events-none">
					<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
				</div>

				<div className="relative z-10 flex flex-col items-center transition-transform duration-500 group-hover:scale-105">
					<div className="relative mb-6">
						<div className="w-20 h-20 text-white drop-shadow-xl flex items-center justify-center">
							{icon}
						</div>
						<Binary className="w-8 h-8 text-blue-400 absolute -top-2 -right-2 opacity-80" />
					</div>

					<div className="flex flex-wrap gap-2 justify-center mb-4">
						{highlights.slice(0, 2).map((h, idx) => (
							<span
								key={idx}
								className="px-3 py-1 rounded-full text-[10px] bg-black/40 dark:bg-white/10 text-white border border-white/20 font-mono font-bold backdrop-blur-md shadow-lg group-hover:bg-blue-600/50 transition-colors"
							>
								{h.split(' ')[0]}
							</span>
						))}
					</div>
				</div>

				{!isLowPowerMode && (
					<div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-400/80 to-transparent animate-pulse z-20" />
				)}
			</div>
		</motion.div>
	);
}

interface ExperienceStickyScrollProps {
	education: EducationItemProps[];
	isLowPowerMode?: boolean;
}

export default function ExperienceStickyScroll({
	education,
	isLowPowerMode = false,
}: ExperienceStickyScrollProps) {
	return (
		<div className="w-full max-w-6xl mx-auto p-4 md:p-8">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{education.map((edu, idx) => (
					<EducationCard
						key={idx}
						{...edu}
						isLowPowerMode={isLowPowerMode}
					/>
				))}
			</div>
		</div>
	);
}
