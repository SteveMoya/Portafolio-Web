import React from 'react';
import { motion } from 'framer-motion';

interface HardSkillProps {
	name: string;
	level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
	icon?: string;
}

interface HardSkillsProps {
	skills: HardSkillProps[];
}

const levelConfig = {
	beginner: { width: 'w-1/4', color: 'bg-orange-500', label: 'Beginner' },
	intermediate: { width: 'w-1/2', color: 'bg-yellow-500', label: 'Intermediate' },
	advanced: { width: 'w-3/4', color: 'bg-blue-500', label: 'Advanced' },
	expert: { width: 'w-full', color: 'bg-green-500', label: 'Expert' },
};

export default function HardSkills({ skills }: HardSkillsProps) {
	const container = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const item = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.5 },
		},
	};

	return (
		<motion.div
			variants={container}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true }}
			className="w-full max-w-4xl mx-auto px-4 py-12"
		>
			<div className="space-y-8">
				{skills.map((skill, idx) => {
					const config = levelConfig[skill.level];
					return (
						<motion.div
							key={idx}
							variants={item}
							className="group"
						>
							<div className="flex items-center justify-between mb-3">
								<div className="flex items-center gap-2">
									{skill.icon && (
										<span className="text-2xl">
											{skill.icon}
										</span>
									)}
									<h3 className="font-semibold text-white text-lg">
										{skill.name}
									</h3>
								</div>
								<span className="text-xs font-mono text-slate-400 group-hover:text-blue-400 transition-colors">
									{config.label}
								</span>
							</div>

							<div className="h-2 bg-slate-700 rounded-full overflow-hidden">
								<motion.div
									initial={{ width: 0 }}
									whileInView={{ width: '100%' }}
									viewport={{ once: true }}
									transition={{
										duration: 0.8,
										delay: 0.1 * idx,
									}}
									className={`h-full ${config.color} rounded-full shadow-lg group-hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-shadow duration-300`}
								/>
							</div>
						</motion.div>
					);
				})}
			</div>
		</motion.div>
	);
}
