// src/components/layout/ParallaxHero.tsx
import type { ReactNode } from "react";
import { useEffect, useRef, useState, useMemo } from "react";
import {
	motion,
	AnimatePresence,
	useScroll,
	useTransform,
} from "framer-motion";

export type HeroMediaType = "movie" | "tv" | "person" | "season" | "episode";

export interface HeroSlide {
	id: number | string;
	backdropUrl: string | null;
	posterUrl?: string | null;
	title?: string;
	year?: string;
	overview?: string;
	score?: number | null;
	mediaType?: HeroMediaType;
	link?: string;
	extra?: unknown;
}

interface ParallaxHeroProps {
	slides: HeroSlide[];
	heightClass?: string;
	autoAdvanceMs?: number;
	children: (args: { slide: HeroSlide; isMulti: boolean }) => ReactNode;
}

export default function ParallaxHero({
	slides,
	heightClass = "h-[260px] sm:h-[320px] lg:h-[420px]",
	autoAdvanceMs = 5000,
	children,
}: ParallaxHeroProps) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const glassRef = useRef<HTMLDivElement | null>(null);

	/* ------------------------------------------------------------------
	   SLIDES PRE-PROCESSING
	   - Backdrops only
	   - Max 5 slides
	   - Poster fallback (blurred)
	------------------------------------------------------------------ */
	const processedSlides = useMemo(() => {
		if (!slides || slides.length === 0) return [];

		// FILTER: only keep valid backdrops
		let filtered = slides.filter((s) => !!s.backdropUrl);

		// If no backdrops, fallback to poster (zoom/blur will be applied later)
		if (filtered.length === 0) {
			filtered = slides.map((s) => ({
				...s,
				backdropUrl: s.posterUrl ?? "/no-image.png",
			}));
		}

		// Limit to top 5 backdrops
		return filtered.slice(0, 5);
	}, [slides]);

	const hasSlides = processedSlides.length > 0;
	const isMulti = processedSlides.length > 1;

	const [activeIndex, setActiveIndex] = useState(0);
	const [isHovered, setIsHovered] = useState(false);

	const activeSlide = hasSlides ? processedSlides[activeIndex] : undefined;

	/* ------------------------------------------------------------------
	   PARALLAX
	------------------------------------------------------------------ */
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start start", "end start"],
	});
	const y = useTransform(scrollYProgress, [0, 1], [0, 80]);

	/* ------------------------------------------------------------------
	   AUTO-ADVANCE
	------------------------------------------------------------------ */
	useEffect(() => {
		if (!isMulti) return;
		if (isHovered) return;
		if (document.hidden) return;

		const id = window.setInterval(
			() => setActiveIndex((p) => (p + 1) % processedSlides.length),
			autoAdvanceMs
		);

		return () => clearInterval(id);
	}, [isMulti, isHovered, autoAdvanceMs, processedSlides.length]);

	if (!hasSlides || !activeSlide) return null;

	const bgUrl =
		activeSlide.backdropUrl || activeSlide.posterUrl || "/no-image.png";

	return (
		<div
			ref={containerRef}
			className={`relative w-full overflow-hidden ${heightClass}`}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{/* BACKGROUND */}
			<AnimatePresence mode="wait">
				<motion.div
					key={activeSlide.id}
					className="absolute inset-0 bg-cover bg-center"
					style={{
						y,
						backgroundImage: `url(${bgUrl})`,
						filter:
							activeSlide.posterUrl && !activeSlide.backdropUrl
								? "blur(6px) brightness(0.9)"
								: "none",
						transform:
							activeSlide.posterUrl && !activeSlide.backdropUrl
								? "scale(1.15)"
								: "none",
					}}
					initial={{ opacity: 0, scale: 1.02 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 1.02 }}
					transition={{ duration: 0.8, ease: "easeOut" }}
				/>
			</AnimatePresence>

			{/* CINEMATIC OVERLAYS */}
			<div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
			<div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-background/10" />

			{/* TEXT GLASS PANEL */}
			<div className="absolute bottom-0 left-0 right-0 z-20 sm:pb-5 lg:pb-10">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<motion.div
						ref={glassRef}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.6 }}
						className="
							max-w-3xl
							rounded-2xl
							border border-white/10
							bg-surface/80 backdrop-blur-md
							px-5 py-4 sm:px-6 sm:py-5 lg:px-7 lg:py-6
							shadow-[0_0_45px_rgba(0,0,0,0.6)]
							hover:bg-surface/90 hover:shadow-[0_0_65px_rgba(0,0,0,0.75)]
							transition-all duration-300
						"
					>
						{children({ slide: activeSlide, isMulti })}
					</motion.div>
				</div>
			</div>

			{/* SLIDESHOW DOTS (bottom center) */}
			{isMulti && (
				<div
					className="
						absolute left-1/2 -translate-x-1/2 bottom-[0.3em]
						z-30
					"
				>
					<div
						className="
							inline-flex items-center gap-2
							rounded-full border border-white/10
							bg-surface/80 backdrop-blur-md
							px-3 py-1
							shadow-[0_0_30px_rgba(0,0,0,0.5)]
						"
					>
						{processedSlides.map((s, idx) => (
							<button
								key={s.id ?? idx}
								onClick={() => setActiveIndex(idx)}
								className={`h-2 w-5 rounded-full transition-all duration-300 ${
									idx === activeIndex ? "bg-accent" : "bg-surface"
								}`}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
