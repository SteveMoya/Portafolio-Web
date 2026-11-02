import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

export default function CleanFilmGrid({
	images,
	columns = 3,
}: CleanFilmGridProps) {
	const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

	const colsClass =
		columns === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3';

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
		hidden: { opacity: 0, scale: 0.8 },
		visible: {
			opacity: 1,
			scale: 1,
			transition: { duration: 0.4 },
		},
	};

	return (
		<>
			<motion.div
				variants={container}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true }}
				className={`grid grid-cols-1 sm:grid-cols-2 ${colsClass} gap-4 w-full max-w-6xl mx-auto px-4 py-12`}
			>
				{images.map((img) => (
					<motion.div
						key={img.id}
						variants={item}
						layoutId={`image-${img.id}`}
						onClick={() => setSelectedImage(img)}
						className="group relative overflow-hidden rounded-lg aspect-square bg-slate-800 border border-slate-700 cursor-pointer hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]"
					>
						<img
							src={img.src}
							alt={img.alt}
							className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
						/>

						<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
							<div className="text-white">
								<p className="font-semibold text-sm">
									{img.alt}
								</p>
								{img.category && (
									<p className="text-xs text-slate-300 mt-1">
										{img.category}
									</p>
								)}
							</div>
						</div>

						<div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
							<div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
								<span className="text-sm">+</span>
							</div>
						</div>
					</motion.div>
				))}
			</motion.div>

			<AnimatePresence>
				{selectedImage && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setSelectedImage(null)}
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
					>
						<motion.div
							layoutId={`image-${selectedImage.id}`}
							className="relative max-w-3xl w-full aspect-auto rounded-xl overflow-hidden"
							onClick={(e) => e.stopPropagation()}
						>
							<img
								src={selectedImage.src}
								alt={selectedImage.alt}
								className="w-full h-auto object-contain"
							/>

							<button
								onClick={() => setSelectedImage(null)}
								className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors duration-300 backdrop-blur-sm"
							>
								<span className="text-xl">×</span>
							</button>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
