// src/components/layout/Hero/HeroSlide.tsx
import React from "react";

interface HeroSlideProps {
	image: string;
	color: string; // dominant color
	dark: boolean; // O1-A overlay-intensity flag
	index: number;
	isActive: boolean;
	children?: React.ReactNode;
}

export default function HeroSlide({
	image,
	color,
	dark,
	index,
	isActive,
	children,
}: HeroSlideProps) {
	return (
		<div
			className={`
                absolute inset-0 transition-opacity duration-[900ms]
                ${isActive ? "opacity-100" : "opacity-0"}
            `}
			style={{
				zIndex: isActive ? 2 : 1,
			}}
		>
			{/* BACKDROP */}
			<div className="absolute inset-0 overflow-hidden">
				<img
					src={image}
					alt=""
					className="w-full h-full object-cover scale-[1.15] md:scale-[1.08] lg:scale-[1.04] transition-transform duration-[1800ms]"
					loading="eager"
				/>

				{/* DARK CINEMATIC OVERLAY (O1-A: Heavy Black) */}
				<div
					className="absolute inset-0"
					style={{
						background: dark
							? "rgba(0,0,0,0.72)"
							: `linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.80)), ${color}`,
						mixBlendMode: "multiply",
					}}
				/>
			</div>

			{/* CONTENT */}
			<div className="relative z-20 pt-24 pb-20 px-6 max-w-6xl mx-auto">
				{children}
			</div>
		</div>
	);
}
