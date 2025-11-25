// src/components/ui/CarouselRow.tsx
import React, { useRef } from "react";
import IconButton from "./IconButton";

interface CarouselRowProps {
	/** Optional array-of-items mode */
	items?: React.ReactNode[];
	/** Children mode (e.g. <CarouselRow>{items.map(...)}</CarouselRow>) */
	children?: React.ReactNode;
	className?: string;
}

export default function CarouselRow({
	items,
	children,
	className = "",
}: CarouselRowProps) {
	const containerRef = useRef<HTMLDivElement | null>(null);

	const scroll = (dir: "left" | "right") => {
		const el = containerRef.current;
		if (!el) return;
		const amt = el.clientWidth * 0.6;
		el.scrollTo({
			left: dir === "left" ? el.scrollLeft - amt : el.scrollLeft + amt,
			behavior: "smooth",
		});
	};

	// Decide what to render inside:
	// - if items is a non-empty array, use items.map
	// - otherwise fall back to children (no .map call)
	const content =
		Array.isArray(items) && items.length > 0
			? items.map((node, idx) => (
					<div key={idx} className="snap-start flex-shrink-0">
						{node}
					</div>
			  ))
			: children;

	return (
		<div className={`relative ${className}`}>
			<div
				ref={containerRef}
				className="flex gap-4 overflow-x-auto pb-3 scroll-smooth snap-x snap-mandatory scrollbar-hide"
				style={{ WebkitOverflowScrolling: "touch" }}
			>
				{content}
			</div>

			{/* Left Arrow */}
			<div className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2">
				<IconButton aria-label="Scroll left" onClick={() => scroll("left")}>
					◀
				</IconButton>
			</div>

			{/* Right Arrow */}
			<div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2">
				<IconButton aria-label="Scroll right" onClick={() => scroll("right")}>
					▶
				</IconButton>
			</div>
		</div>
	);
}
