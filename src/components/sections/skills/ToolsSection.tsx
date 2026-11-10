import React from 'react';
import { motion } from 'framer-motion';

interface ToolProps {
	name: string;
	icon?: string;
	category?: string;
}

interface ToolsSectionProps {
	tools: ToolProps[];
	title?: string;
}

export default function ToolsSection({
	tools,
	title = 'Tools & Technologies',
}: ToolsSectionProps) {
	const container = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.05,
			},
		},
	};

	const item = {
		hidden: { opacity: 0, scale: 0.8 },
		visible: {
			opacity: 1,
			scale: 1,
			transition: { duration: 0.3 },
		},
	};

	return (
		<motion.section
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.6 }}
			className="w-full max-w-6xl mx-auto px-4 py-16"
		>
			<h2 className="text-3xl md:text-4xl font-bold text-white mb-2 text-center">
				{title}
			</h2>
			<p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
				Technologies and tools I use to build modern, scalable
				applications
			</p>

			<motion.div
				variants={container}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true }}
				className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
			>
				{tools.map((tool, idx) => (
					<motion.div
						key={idx}
						variants={item}
						whileHover={{ scale: 1.1, y: -5 }}
						className="group relative"
					>
						<div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4 h-24 flex flex-col items-center justify-center hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]">
							{tool.icon && (
								<span className="text-3xl mb-2">
									{tool.icon}
								</span>
							)}
							<p className="text-xs font-semibold text-slate-300 text-center line-clamp-2">
								{tool.name}
							</p>
						</div>

						{tool.category && (
							<div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
								<span className="text-[10px] text-slate-400 font-mono">
									{tool.category}
								</span>
							</div>
						)}
					</motion.div>
				))}
			</motion.div>
		</motion.section>
	);
}
