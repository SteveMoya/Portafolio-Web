import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
	motion,
	useScroll,
	useSpring,
	useTransform,
	useMotionValue,
	useVelocity,
	useAnimationFrame,
} from 'framer-motion';

interface ParallexProps {
	children: React.ReactNode;
	baseVelocity: number;
	isLowPowerMode?: boolean;
}

function ParallaxText({
	children,
	baseVelocity = 100,
	isLowPowerMode = false,
}: ParallexProps) {
	const baseX = useMotionValue(0);
	const contentRef = useRef<HTMLDivElement>(null);
	const [contentWidth, setContentWidth] = useState(0);

	const { scrollY } = useScroll();
	const scrollVelocity = useVelocity(scrollY);
	const smoothVelocity = useSpring(scrollVelocity, {
		damping: 50,
		stiffness: 400,
	});

	const velocityFactor = useTransform(smoothVelocity, (latest) => {
		return (Math.abs(latest) / 1000) * 5;
	});

	const measure = useCallback(() => {
		if (contentRef.current) {
			setContentWidth(contentRef.current.scrollWidth);
		}
	}, []);

	useEffect(() => {
		measure();
		window.addEventListener('resize', measure);
		const t1 = setTimeout(measure, 300);
		const t2 = setTimeout(measure, 1000);
		return () => {
			window.removeEventListener('resize', measure);
			clearTimeout(t1);
			clearTimeout(t2);
		};
	}, [measure]);

	const x = useTransform(baseX, (v) => {
		if (contentWidth <= 0) return '0px';
		const mod = ((v % contentWidth) + contentWidth) % contentWidth;

		if (baseVelocity > 0) {
			return `${-contentWidth + mod}px`;
		} else {
			return `${-mod}px`;
		}
	});

	const isHovered = useRef(false);

	useAnimationFrame((_t, delta) => {
		if (isHovered.current || isLowPowerMode) return;

		const clampedDelta = Math.min(delta, 50);

		let moveBy = Math.abs(baseVelocity) * (clampedDelta / 1000);

		const vf = velocityFactor.get();
		if (vf > 0) {
			moveBy += moveBy * vf;
		}

		baseX.set(baseX.get() + moveBy);
	});

	if (isLowPowerMode) {
		return (
			<div className="overflow-hidden whitespace-nowrap w-full py-1">
				<div
					className={
						baseVelocity > 0
							? 'animate-marquee-reverse'
							: 'animate-marquee'
					}
				>
					<div className="flex gap-4 shrink-0 pr-4">{children}</div>
					<div className="flex gap-4 shrink-0 pr-4">{children}</div>
					<div className="flex gap-4 shrink-0 pr-4">{children}</div>
				</div>
			</div>
		);
	}

	return (
		<div
			className="overflow-hidden whitespace-nowrap w-full py-1"
			onMouseEnter={() => (isHovered.current = true)}
			onMouseLeave={() => (isHovered.current = false)}
		>
			<motion.div
				className="flex"
				style={{ x, willChange: 'transform' }}
			>
				<div ref={contentRef} className="flex gap-4 shrink-0 pr-4">
					{children}
				</div>
				<div className="flex gap-4 shrink-0 pr-4">{children}</div>
				<div className="flex gap-4 shrink-0 pr-4">{children}</div>
			</motion.div>
		</div>
	);
}

interface GalleryItemProps {
	logoSrc: string;
	altText?: string;
}

function GalleryItem({ logoSrc, altText }: GalleryItemProps) {
	const needsInvertInDarkMode =
		logoSrc.includes('McKinsey') ||
		logoSrc.includes('TelkomUniversity') ||
		logoSrc.includes('softagelogo') ||
		logoSrc.includes('dinas-pangan');

	const needsWhiteBgRemovalInDarkMode =
		logoSrc.includes('logobei') || logoSrc.includes('birulangit');

	const needsInvertInLightMode =
		logoSrc.includes('flyrank') || logoSrc.includes('FlyRank');

	let specificClasses = '';
	if (needsInvertInDarkMode) specificClasses = 'dark:invert';
	if (needsWhiteBgRemovalInDarkMode)
		specificClasses = 'dark:invert dark:hue-rotate-180';
	if (needsInvertInLightMode) specificClasses = 'invert dark:invert-0';

	return (
		<div className="relative shrink-0 w-[clamp(140px,30vw,200px)] h-[clamp(80px,15vw,120px)] md:w-[280px] md:h-[160px] flex items-center justify-center group cursor-pointer transition-all duration-300 hover:scale-105">
			<img
				src={logoSrc}
				alt={altText || 'Partner Logo'}
				className={`w-full h-full object-contain grayscale hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-300 scale-90 md:scale-100 ${specificClasses}`}
			/>
		</div>
	);
}

interface ExperienceMarqueeProps {
	logos: string[];
	isLowPowerMode?: boolean;
}

export default function ExperienceMarquee({
	logos,
	isLowPowerMode = false,
}: ExperienceMarqueeProps) {
	const ensureLength = (items: string[]) => {
		let repeated = [...items];
		while (repeated.length < 12) {
			repeated = [...repeated, ...items];
		}
		return repeated;
	};

	const row1 = logos.slice(0, Math.ceil(logos.length / 2));
	const row2 = logos.slice(Math.ceil(logos.length / 2));

	return (
		<section className="py-2 md:py-8 bg-background relative z-10 overflow-hidden">
			<div className="absolute top-0 left-0 w-full h-16 md:h-32 bg-gradient-to-b from-background via-background/80 to-transparent z-20 pointer-events-none" />
			<div className="absolute bottom-0 left-0 w-full h-16 md:h-32 bg-gradient-to-t from-background via-background/80 to-transparent z-20 pointer-events-none" />

			<div className="flex flex-col gap-2">
				<ParallaxText baseVelocity={40} isLowPowerMode={isLowPowerMode}>
					{ensureLength(row1).map((logo, idx) => (
						<GalleryItem key={`r1-${idx}`} logoSrc={logo} />
					))}
				</ParallaxText>

				<ParallaxText
					baseVelocity={-40}
					isLowPowerMode={isLowPowerMode}
				>
					{ensureLength(row2).map((logo, idx) => (
						<GalleryItem key={`r2-${idx}`} logoSrc={logo} />
					))}
				</ParallaxText>
			</div>
		</section>
	);
}
