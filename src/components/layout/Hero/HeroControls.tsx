// src/components/layout/Hero/HeroControls.tsx
import React from "react";

interface HeroControlsProps {
	total: number;
	current: number;
	onPrev: () => void;
	onNext: () => void;
	onJump: (i: number) => void;
}

export default function HeroControls({
	total,
	current,
	onPrev,
	onNext,
	onJump,
}: HeroControlsProps) {
	return (
		<>
			{/* LEFT ARROW */}
			<button
				aria-label="Previous slide"
				onClick={onPrev}
				className="
                    absolute left-3 md:left-6 top-1/2 -translate-y-1/2
                    h-12 w-12 grid place-items-center rounded-full
                    bg-black/40 hover:bg-black/60 backdrop-blur
                    text-white text-2xl transition
                "
			>
				‹
			</button>

			{/* RIGHT ARROW */}
			<button
				aria-label="Next slide"
				onClick={onNext}
				className="
                    absolute right-3 md:right-6 top-1/2 -translate-y-1/2
                    h-12 w-12 grid place-items-center rounded-full
                    bg-black/40 hover:bg-black/60 backdrop-blur
                    text-white text-2xl transition
                "
			>
				›
			</button>

			{/* DOT INDICATORS */}
			<div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
				{Array.from({ length: total }).map((_, i) => (
					<button
						key={i}
						aria-label={`Go to slide ${i + 1}`}
						onClick={() => onJump(i)}
						className={`
                            h-3 w-3 rounded-full transition-all
                            ${
															current === i
																? "bg-white scale-110"
																: "bg-white/40"
														}
                        `}
					/>
				))}
			</div>
		</>
	);
}
