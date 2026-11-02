import { motion, useReducedMotion } from 'framer-motion'

interface ToolProps {
	name: string
	/** Optional glyph. The page no longer passes emoji, so the initial is used. */
	icon?: string
	category?: string
}

interface ToolsSectionNewProps {
	tools: ToolProps[]
}

const container = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.05
		}
	}
}

// Opacity is deliberately left at 1 in the hidden state: the server-rendered
// cards must stay legible if hydration ever fails.
const item = {
	hidden: { scale: 0.94, y: 20 },
	visible: {
		scale: 1,
		y: 0,
		transition: { duration: 0.4 }
	}
}

export default function ToolsSectionNew({ tools }: ToolsSectionNewProps) {
	const reduce = useReducedMotion() ?? false

	return (
		<motion.div
			variants={reduce ? undefined : container}
			initial={reduce ? false : 'hidden'}
			whileInView={reduce ? undefined : 'visible'}
			viewport={{ once: true, margin: '-50px' }}
			className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"
		>
			{tools.map((tool) => (
				<motion.div
					key={tool.name}
					variants={reduce ? undefined : item}
					whileHover={reduce ? undefined : { y: -4 }}
					transition={{ duration: reduce ? 0 : 0.25 }}
					className="group relative"
				>
					<div className="hover-lift relative flex h-32 flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-center transition-colors duration-300 hover:border-[#c70039]/40">
						<span className="corner-tick corner-tick--tl" aria-hidden="true" />
						<span className="corner-tick corner-tick--br" aria-hidden="true" />

						<span className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 font-poppins text-sm font-black uppercase text-[#c70039] transition-colors duration-300 group-hover:border-[#c70039]/40">
							{tool.icon ?? tool.name.charAt(0)}
						</span>

						<p className="line-clamp-2 text-xs font-semibold leading-snug text-white">
							{tool.name}
						</p>

						{tool.category && (
							<p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
								{tool.category}
							</p>
						)}
					</div>
				</motion.div>
			))}
		</motion.div>
	)
}
