import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SkillProps {
	name: string;
	level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
	icon?: string;
	category: string;
}

interface HardSkillsNewProps {
	aiSkills: SkillProps[];
	softwareSkills: SkillProps[];
	additionalSkills: SkillProps[];
}

const levelConfig = {
	beginner: {
		color: 'bg-blue-500',
		bgColor: 'bg-blue-500/10',
		borderColor: 'border-blue-500/20',
		textColor: 'text-blue-400',
		label: 'Beginner',
		width: 40,
	},
	intermediate: {
		color: 'bg-emerald-500',
		bgColor: 'bg-emerald-500/10',
		borderColor: 'border-emerald-500/20',
		textColor: 'text-emerald-400',
		label: 'Intermediate',
		width: 60,
	},
	advanced: {
		color: 'bg-amber-500',
		bgColor: 'bg-amber-500/10',
		borderColor: 'border-amber-500/20',
		textColor: 'text-amber-400',
		label: 'Advanced',
		width: 80,
	},
	expert: {
		color: 'bg-indigo-500',
		bgColor: 'bg-indigo-500/10',
		borderColor: 'border-indigo-500/20',
		textColor: 'text-indigo-400',
		label: 'Expert',
		width: 95,
	},
};

const SkillCard = ({ skill, delay }: { skill: SkillProps; delay: number }) => {
	const config = levelConfig[skill.level];

	return (
		<motion.div
			layout
			initial={{ opacity: 0, scale: 0.95, y: 10 }}
			animate={{ opacity: 1, scale: 1, y: 0 }}
			exit={{ opacity: 0, scale: 0.95, y: -10 }}
			transition={{ duration: 0.3, delay }}
			className="shrink-0 p-5 md:p-6 bg-slate-800/50 border border-slate-700 hover:border-slate-600 rounded-2xl transition-all duration-300 group shadow-sm hover:shadow-lg flex flex-col justify-start w-full relative overflow-hidden"
		>
			<div className="mb-4 relative z-10">
				<div className="flex flex-wrap justify-between items-start mb-4 gap-2">
					<div className="flex items-center gap-2 flex-1">
						{skill.icon && <span className="text-2xl">{skill.icon}</span>}
						<h5 className="font-semibold text-base tracking-tight text-slate-100 group-hover:text-blue-400 transition-colors">
							{skill.name}
						</h5>
					</div>
					<span
						className={`text-[10px] font-mono font-bold px-2 py-1 rounded-full uppercase tracking-wider whitespace-nowrap transition-all duration-300 border ${config.bgColor} ${config.textColor} ${config.borderColor}`}
					>
						{config.label}
					</span>
				</div>

				{/* Animated Progress Bar */}
				<div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden mt-2">
					<motion.div
						initial={{ width: 0 }}
						whileInView={{ width: `${config.width}%` }}
						viewport={{ once: true }}
						transition={{ duration: 1.5, ease: 'circOut', delay: 0.2 }}
						className={`h-full rounded-full ${config.color}`}
					/>
				</div>
			</div>
		</motion.div>
	);
};

export default function HardSkillsNew({
	aiSkills,
	softwareSkills,
	additionalSkills,
}: HardSkillsNewProps) {
	const [expanded, setExpanded] = useState<Record<string, boolean>>({
		ai: false,
		software: false,
		additional: false,
	});

	const toggleExpand = (category: string) => {
		setExpanded((prev) => ({ ...prev, [category]: !prev[category] }));
	};

	const SkillColumn = ({
		title,
		skills: skillsList,
		categoryKey,
		delay,
	}: {
		title: string;
		skills: SkillProps[];
		categoryKey: string;
		delay: number;
	}) => {
		const isExpanded = expanded[categoryKey];
		const displayedSkills = isExpanded ? skillsList : skillsList.slice(0, 3);
		const hasMore = skillsList.length > 3;

		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ delay }}
				className="flex flex-col bg-slate-800/30 border border-slate-700 rounded-2xl p-6 h-full"
			>
				<h3 className="text-xl font-bold text-white mb-6">{title}</h3>

				<div className="flex flex-col gap-4 flex-grow min-h-0 pb-4">
					<AnimatePresence>
						{displayedSkills.map((skill, idx) => (
							<SkillCard key={skill.name} skill={skill} delay={idx * 0.05} />
						))}
					</AnimatePresence>
				</div>

				{hasMore && (
					<button
						onClick={() => toggleExpand(categoryKey)}
						className="w-full py-3 flex items-center justify-center gap-2 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 hover:text-slate-100 font-medium text-sm transition-all duration-300 border border-slate-600"
					>
						{isExpanded ? (
							<>
								<span>View Less</span>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
								</svg>
							</>
						) : (
							<>
								<span>View More ({skillsList.length - 3})</span>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
								</svg>
							</>
						)}
					</button>
				)}
			</motion.div>
		);
	};

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full">
			<SkillColumn title="Applied AI" skills={aiSkills} categoryKey="ai" delay={0.1} />
			<SkillColumn
				title="Software Engineering"
				skills={softwareSkills}
				categoryKey="software"
				delay={0.2}
			/>
			<SkillColumn
				title="Additional Skills"
				skills={additionalSkills}
				categoryKey="additional"
				delay={0.3}
			/>
		</div>
	);
}
