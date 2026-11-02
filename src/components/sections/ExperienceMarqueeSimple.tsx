import React from 'react';

interface ExperienceMarqueeProps {
	logos: string[];
}

export default function ExperienceMarquee({ logos }: ExperienceMarqueeProps) {
	if (!logos || logos.length === 0) {
		return null;
	}

	const doubledLogos = [...logos, ...logos];

	return (
		<section className="py-8 md:py-16 bg-slate-900 relative z-10 overflow-hidden">
			<div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-slate-900 via-slate-900/80 to-transparent z-20 pointer-events-none" />
			<div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent z-20 pointer-events-none" />

			<div className="overflow-hidden">
				<style>{`
					@keyframes marquee {
						0% { transform: translateX(0); }
						100% { transform: translateX(-50%); }
					}
					.marquee-container {
						display: flex;
						animation: marquee 30s linear infinite;
						width: 200%;
					}
					.marquee-container:hover {
						animation-play-state: paused;
					}
				`}</style>

				<div className="marquee-container">
					{doubledLogos.map((logo, idx) => (
						<div
							key={idx}
							className="flex items-center justify-center flex-shrink-0 w-40 h-24 md:w-52 md:h-32 px-4"
						>
							<img
								src={logo}
								alt="Company logo"
								className="h-16 md:h-20 object-contain grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
							/>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
