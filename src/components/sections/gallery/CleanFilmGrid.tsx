'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, ChevronLeft, ChevronRight, Minimize2, LayoutGrid, StretchHorizontal } from 'lucide-react';

interface GalleryImage {
	id: string;
	src: string;
	alt: string;
	category?: string;
}

interface CleanFilmGridProps {
	images: GalleryImage[];
	columns?: 3 | 4;
}

type ViewMode = 'grid' | 'rows';
type FilterType = 'all' | 'fotografia' | 'diseno';

const cn = (...classes: (string | undefined | boolean)[]) => {
	return classes.filter(Boolean).join(' ');
};

export default function CleanFilmGrid({
	images,
	columns = 3,
}: CleanFilmGridProps) {
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [filter, setFilter] = useState<FilterType>('all');
	const [viewMode, setViewMode] = useState<ViewMode>('grid');
	const [isLightboxMaximized, setIsLightboxMaximized] = useState(false);
	const [visibleCount, setVisibleCount] = useState(12);
	const scrollContainerRef = useRef<Record<string, HTMLDivElement | null>>({});

	// Group items by category
	const groupedItems = useMemo(() => {
		let items = [...images];

		// Filter by category
		if (filter !== 'all') {
			items = items.filter(item => item.category === filter);
		}

		// Group by category
		const groups: Record<string, typeof items> = {};
		items.forEach(item => {
			const category = item.category || 'Uncategorized';
			if (!groups[category]) {
				groups[category] = [];
			}
			groups[category].push(item);
		});

		return groups;
	}, [filter, images]);

	const categories = Object.keys(groupedItems).sort();
	const flattenedFilteredItems = useMemo(() => {
		return categories.flatMap(cat => groupedItems[cat]);
	}, [categories, groupedItems]);

	const visibleItems = useMemo(() => {
		if (viewMode === 'rows') return [];
		return flattenedFilteredItems.slice(0, visibleCount);
	}, [flattenedFilteredItems, visibleCount, viewMode]);

	useEffect(() => {
		setVisibleCount(12);
	}, [filter]);

	const currentIndex = flattenedFilteredItems.findIndex(item => item.id === selectedId);

	// Lightbox Controls
	const openLightbox = (id: string) => {
		setSelectedId(id);
		setIsLightboxMaximized(false);
	};

	const closeLightbox = () => setSelectedId(null);

	const toggleMaximize = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsLightboxMaximized(prev => !prev);
	};

	const nextImage = (e: React.MouseEvent) => {
		e.stopPropagation();
		const next = (currentIndex + 1) % flattenedFilteredItems.length;
		setSelectedId(flattenedFilteredItems[next].id);
	};

	const prevImage = (e: React.MouseEvent) => {
		e.stopPropagation();
		const prev = (currentIndex - 1 + flattenedFilteredItems.length) % flattenedFilteredItems.length;
		setSelectedId(flattenedFilteredItems[prev].id);
	};

	// Scroll to Category
	const scrollToCategory = (category: string) => {
		const element = document.getElementById(`category-${category}`);
		if (element) {
			const y = element.getBoundingClientRect().top + window.pageYOffset - 100;
			window.scrollTo({ top: y, behavior: 'smooth' });
		}
	};

	// Horizontal Scroll Handler
	const scrollHorizontal = (category: string, direction: 'left' | 'right') => {
		const container = scrollContainerRef.current[category];
		if (container) {
			const scrollAmount = direction === 'left' ? -400 : 400;
			container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
		}
	};

	return (
		<>
			<section className="relative py-24 px-6 md:px-16 lg:px-24 min-h-screen bg-[#0a0a0a]">
				{/* Header & Controls */}
				<div className="relative z-10 max-w-7xl mx-auto mb-12 flex flex-col md:flex-row items-start md:items-end justify-between border-b border-[#2d2d2d] pb-6 gap-6">
					{/* Title */}
					<div className="flex-1">
						<span className="text-[11px] md:text-xs font-medium uppercase tracking-[0.3em] text-[#a8a29e] block mb-3">
							Exhibition Space
						</span>
						<h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight font-medium leading-tight">
							Selected Works
						</h2>
					</div>

					{/* Controls Area */}
					<div className="flex flex-wrap items-center gap-4 md:gap-8 w-full md:w-auto">
						{/* Filter Tabs */}
						<div className="flex items-center gap-1 bg-white/5 p-1 rounded-full backdrop-blur-md border border-white/10 shadow-inner">
							{(['all', 'fotografia', 'diseno'] as FilterType[]).map((f) => (
								<button
									key={f}
									onClick={() => setFilter(f)}
									className={cn(
										'px-5 py-2 rounded-full text-xs font-medium tracking-wide transition-all duration-300',
										filter === f
											? 'bg-white/20 text-white shadow-md'
											: 'text-[#a8a29e] hover:text-white hover:bg-white/10'
									)}
								>
									{f === 'all' ? 'All' : f === 'fotografia' ? 'Photography' : 'Design'}
								</button>
							))}
						</div>

						{/* Divider */}
						<div className="w-px h-8 bg-[#151515] hidden md:block" />

						{/* View Toggle */}
						<div className="flex items-center gap-1 bg-white/5 p-1 rounded-full backdrop-blur-md border border-white/10 shadow-inner">
							<button
								onClick={() => setViewMode('rows')}
								className={cn(
									'p-2.5 rounded-full transition-all duration-300',
									viewMode === 'rows'
										? 'bg-white/20 text-white shadow-md'
										: 'text-[#a8a29e] hover:text-white hover:bg-white/10'
								)}
								title="Rows View"
							>
								<StretchHorizontal className="w-4 h-4" />
							</button>
							<button
								onClick={() => setViewMode('grid')}
								className={cn(
									'p-2.5 rounded-full transition-all duration-300',
									viewMode === 'grid'
										? 'bg-white/20 text-white shadow-md'
										: 'text-[#a8a29e] hover:text-white hover:bg-white/10'
								)}
								title="Grid View"
							>
								<LayoutGrid className="w-4 h-4" />
							</button>
						</div>
					</div>
				</div>

				<div className="relative z-10 flex flex-col lg:flex-row max-w-7xl mx-auto gap-8">
					{/* Quick Index (Sticky Sidebar) - Only visible in Rows mode */}
					{viewMode === 'rows' && (
						<div className="hidden lg:block w-48 shrink-0 sticky top-32 h-fit">
							<div className="border-l border-[#2d2d2d] pl-6 py-2">
								<h3 className="text-xs font-mono uppercase tracking-widest text-[#a8a29e] mb-6 flex items-center gap-2">
									Collections
								</h3>
								<div className="flex flex-col gap-3">
									{categories.map((category, idx) => (
										<button
											key={category}
											onClick={() => scrollToCategory(category)}
											className="text-left text-sm text-[#a8a29e] hover:text-white hover:pl-2 transition-all duration-300 capitalize"
										>
											<span className="font-mono text-[10px] opacity-40 mr-2">
												{(idx + 1).toString().padStart(2, '0')}
											</span>
											{category}
										</button>
									))}
								</div>
							</div>
						</div>
					)}

					{/* Main Content Area */}
					<div className="flex-1 min-w-0 space-y-16">
						{/* Rows View */}
						{viewMode === 'rows' && categories.map((category) => (
							<div key={category} id={`category-${category}`} className="relative group/section">
								{/* Section Header */}
								<div className="flex items-center justify-between mb-6 px-1">
									<h3 className="text-xl md:text-2xl font-semibold text-white capitalize flex items-center gap-3">
										{category}
										<span className="text-xs font-mono text-[#a8a29e] bg-[#151515]/50 px-2 py-0.5 rounded-full">
											{groupedItems[category].length}
										</span>
									</h3>

									{/* Scroll Controls */}
									<div className="hidden md:flex items-center gap-2 opacity-0 group-hover/section:opacity-100 transition-opacity duration-300">
										<button
											onClick={() => scrollHorizontal(category, 'left')}
											className="p-2 rounded-full border border-[#2d2d2d] hover:bg-[#151515]/50 hover:border-[#2d2d2d] transition-all"
										>
											<ChevronLeft className="w-4 h-4 text-[#a8a29e]" />
										</button>
										<button
											onClick={() => scrollHorizontal(category, 'right')}
											className="p-2 rounded-full border border-[#2d2d2d] hover:bg-[#151515]/50 hover:border-[#2d2d2d] transition-all"
										>
											<ChevronRight className="w-4 h-4 text-[#a8a29e]" />
										</button>
									</div>
								</div>

								{/* Horizontal Scroll Container */}
								<div
									ref={el => {
										scrollContainerRef.current[category] = el;
									}}
									className="flex gap-4 overflow-x-auto pb-8 px-1"
									style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
								>
									{groupedItems[category].map((item, index) => (
										<motion.div
											key={item.id}
											initial={{ opacity: 0, x: 20 }}
											whileInView={{ opacity: 1, x: 0 }}
											viewport={{ once: true, margin: '0px -50px 0px 0px' }}
											transition={{ duration: 0.5, delay: index * 0.1 }}
											className="relative flex-none w-[85vw] md:w-[400px] aspect-video snap-center group/card cursor-pointer"
											onClick={() => openLightbox(item.id)}
										>
											<div className="relative w-full h-full overflow-hidden rounded-sm bg-[#151515]">
												<img
													src={item.src}
													alt={item.alt}
													className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
												/>

												{/* Hover Overlay */}
												<div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 transition-all duration-300 flex items-center justify-center z-10">
													<motion.div
														whileHover={{ scale: 1.1 }}
														className="border border-white/20 p-4 rounded-full bg-white/10 backdrop-blur-md"
													>
														<Maximize2 className="w-6 h-6 text-white" />
													</motion.div>
												</div>

												{/* Gradient Bottom for Text readability */}
												<div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent opacity-60 group-hover/card:opacity-90 transition-opacity duration-300" />

												{/* Info overlay */}
												<div className="absolute bottom-4 left-4 right-4 z-20 transform translate-y-2 group-hover/card:translate-y-0 transition-transform duration-300">
													<h4 className="text-white text-lg font-medium leading-tight truncate drop-shadow-md">
														{item.alt}
													</h4>
													<div className="flex items-center justify-between mt-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 delay-75">
														<span className="text-xs text-white/60 uppercase tracking-widest border border-white/20 px-2 py-0.5 rounded-full">
															View
														</span>
													</div>
												</div>
											</div>
										</motion.div>
									))}
								</div>
							</div>
						))}

						{/* Grid View */}
						{viewMode === 'grid' && (
							<div className="space-y-12">
								<div className="columns-1 md:columns-2 lg:columns-3 gap-3 space-y-3">
									{visibleItems.map((item, index) => (
										<motion.div
											key={item.id}
											initial={{ opacity: 0, y: 20 }}
											whileInView={{ opacity: 1, y: 0 }}
											viewport={{ once: true, margin: '-10%' }}
											transition={{ duration: 0.4, delay: index * 0.05 }}
											className="relative group break-inside-avoid cursor-pointer transition-all"
											onClick={() => openLightbox(item.id)}
										>
											<div className="relative overflow-hidden bg-[#151515] aspect-auto rounded-none group-hover:rounded-3xl transition-all duration-500 ease-out">
												<img
													src={item.src}
													alt={item.alt}
													className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
												/>

												{/* Hover Overlay */}
												<div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center z-10 p-4 text-center">
													<div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 mb-4">
														<Maximize2 className="w-5 h-5 text-white" />
													</div>
													<h3 className="text-sm font-bold uppercase tracking-wide text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 line-clamp-2">
														{item.alt}
													</h3>
													{item.category && (
														<p className="text-xs text-white/70 font-mono mt-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
															{item.category}
														</p>
													)}
												</div>
											</div>
										</motion.div>
									))}
								</div>

								{/* Load More Button */}
								{visibleCount < flattenedFilteredItems.length && (
									<div className="flex justify-center pt-8 pb-12">
										<button
											onClick={() => setVisibleCount(prev => prev + 12)}
											className="group flex flex-col items-center gap-4 py-4 px-8 relative mt-6"
										>
											<span className="text-[11px] font-mono uppercase tracking-[3px] font-bold text-white opacity-0 -translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out absolute top-[-10px] whitespace-nowrap">
												Load More
											</span>
											<div className="w-14 h-14 rounded-full border border-[#2d2d2d] flex items-center justify-center group-hover:bg-white group-hover:text-[#a8a29e] group-hover:scale-110 transition-all duration-500 ease-out z-10 shadow-sm group-hover:shadow-xl bg-[#151515]">
												<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
												</svg>
											</div>
										</button>
									</div>
								)}
							</div>
						)}

						{categories.length === 0 && (
							<div className="py-20 text-center">
								<p className="text-[#a8a29e] font-mono">No items found matching filter.</p>
							</div>
						)}
					</div>
				</div>
			</section>

			{/* Advanced Lightbox */}
			<AnimatePresence>
				{selectedId && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className={cn(
							'fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center transition-all duration-300',
							isLightboxMaximized ? 'bg-black' : ''
						)}
						onClick={closeLightbox}
					>
						{/* Toolbar */}
						<div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-[110]" onClick={(e) => e.stopPropagation()}>
							{/* Counter */}
							<div className="text-sm font-mono text-white/70">
								{currentIndex + 1} / {flattenedFilteredItems.length}
							</div>

							{/* Actions */}
							<div className="flex items-center gap-4">
								<button
									onClick={toggleMaximize}
									className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
									title={isLightboxMaximized ? 'Minimize' : 'Maximize'}
								>
									{isLightboxMaximized ? (
										<Minimize2 className="w-5 h-5 text-white" />
									) : (
										<Maximize2 className="w-5 h-5 text-white" />
									)}
								</button>
								<button
									onClick={closeLightbox}
									className="p-3 bg-white/5 hover:bg-red-500/10 hover:text-red-500 rounded-full transition-colors"
								>
									<X className="w-5 h-5" />
								</button>
							</div>
						</div>

						{/* Navigation Arrows */}
						<button onClick={prevImage} className="absolute left-6 top-1/2 -translate-y-1/2 p-4 border border-white/20 bg-black/50 hover:bg-black/80 text-white rounded-full transition-all z-[110] hidden md:block backdrop-blur-sm">
							<ChevronLeft className="w-8 h-8" />
						</button>

						<button onClick={nextImage} className="absolute right-6 top-1/2 -translate-y-1/2 p-4 border border-white/20 bg-black/50 hover:bg-black/80 text-white rounded-full transition-all z-[110] hidden md:block backdrop-blur-sm">
							<ChevronRight className="w-8 h-8" />
						</button>

						{/* Content Container */}
						<motion.div
							layout
							className={cn(
								'relative w-full transition-all duration-500',
								isLightboxMaximized ? 'h-screen w-screen px-0 py-0' : 'max-w-5xl px-6 h-[70vh] aspect-video'
							)}
							onClick={(e) => e.stopPropagation()}
						>
							<div className={cn('relative w-full h-full overflow-hidden flex items-center justify-center', isLightboxMaximized ? 'rounded-none' : 'rounded-sm')}>
								<img
									src={flattenedFilteredItems[currentIndex].src}
									alt={flattenedFilteredItems[currentIndex].alt}
									className="w-full h-full object-contain"
								/>
							</div>
						</motion.div>

						{/* Caption */}
						{!isLightboxMaximized && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								className="mt-8 text-center max-w-2xl px-6"
								onClick={(e) => e.stopPropagation()}
							>
								<h3 className="text-2xl font-medium text-white mb-2">
									{flattenedFilteredItems[currentIndex].alt}
								</h3>
								{flattenedFilteredItems[currentIndex].category && (
									<p className="text-sm text-[#a8a29e]">
										{flattenedFilteredItems[currentIndex].category}
									</p>
								)}
							</motion.div>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
