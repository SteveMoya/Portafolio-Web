import { motion } from 'framer-motion';

interface ToolProps {
	name: string;
	icon?: string;
	category?: string;
}

interface ToolsSectionNewProps {
	tools: ToolProps[];
}

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
	hidden: { opacity: 0, scale: 0.8, y: 20 },
	visible: {
		opacity: 1,
		scale: 1,
		y: 0,
		transition: { duration: 0.4 },
	},
};

export default function ToolsSectionNew({ tools }: ToolsSectionNewProps) {
	return (
		<motion.section
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.6 }}
			className="w-full"
		>
			{/* Header */}
			<div className="text-center mb-16">
				<span className="text-xs font-bold uppercase tracking-[0.4em] text-blue-400 bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20 inline-block mb-6">
					Workflow & Infrastructure
				</span>
				<h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
					Professional Tooling
				</h2>
				<p className="text-slate-400 max-w-2xl mx-auto">
					Leveraging modern platforms for development, design, and deployment to ensure rapid and reliable delivery.
				</p>
			</div>

			{/* Tools Grid */}
			<motion.div
				variants={container}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, margin: '-50px' }}
				className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
			>
				{tools.map((tool, idx) => (
					<motion.div
						key={idx}
						variants={item}
						whileHover={{ scale: 1.05, y: -5 }}
						className="group relative"
					>
						<div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:border-blue-500/50 rounded-xl p-4 h-28 flex flex-col items-center justify-center transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]">
							{tool.icon && (
								<span className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
									{tool.icon}
								</span>
							)}
							<p className="text-xs font-semibold text-slate-300 text-center line-clamp-2 group-hover:text-slate-100 transition-colors">
								{tool.name}
							</p>
						</div>

						{tool.category && (
							<div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
								<span className="text-[10px] text-slate-500 font-mono">{tool.category}</span>
							</div>
						)}
					</motion.div>
				))}
			</motion.div>
		</motion.section>
	);
}
