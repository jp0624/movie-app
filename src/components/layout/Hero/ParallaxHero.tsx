// src/components/layout/Hero/ParallaxHero.tsx
import React, {
	useState,
	useEffect,
	useRef,
	useCallback,
	ReactNode,
} from "react";
import HeroSlide from "./HeroSlide";
import HeroControls from "./HeroControls";

// dynamic import for ColorThief
let ColorThief: any;

interface SlideData {
	id: string | number;
	backdropUrl: string;
}

interface ParallaxHeroProps {
	slides: SlideData[];
	autoAdvanceMs?: number;
	children: (data: { slide: SlideData; index: number }) => ReactNode;
}

export default function ParallaxHero({
	slides,
	autoAdvanceMs = 6000,
	children,
}: ParallaxHeroProps) {
	const [index, setIndex] = useState(0);
	const [colors, setColors] = useState<string[]>([]);
	const [blackFallback, setBlackFallback] = useState<boolean[]>([]);
	const intervalRef = useRef<number | null>(null);
	const isDragging = useRef(false);
	const dragStartX = useRef(0);

	/* ------------------------------------------
       Load ColorThief once (lazy)
    ------------------------------------------ */
	useEffect(() => {
		import("colorthief").then((mod) => {
			ColorThief = new mod.default();
		});
	}, []);

	/* ------------------------------------------
       Extract dominant colors
    ------------------------------------------ */
	useEffect(() => {
		if (!slides.length || !ColorThief) return;

		const loadColors = async () => {
			const cols: string[] = [];
			const blacks: boolean[] = [];

			for (const s of slides) {
				try {
					const img = new Image();
					img.crossOrigin = "anonymous";
					img.src = s.backdropUrl;

					await new Promise<void>((res, rej) => {
						img.onload = () => res();
						img.onerror = () => rej();
					});

					const color = ColorThief.getColor(img);
					const rgb = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;

					const isVeryDark = color[0] < 40 && color[1] < 40 && color[2] < 40;

					cols.push(rgb);
					blacks.push(isVeryDark);
				} catch {
					cols.push("rgb(0,0,0)");
					blacks.push(true);
				}
			}

			setColors(cols);
			setBlackFallback(blacks);
		};

		loadColors();
	}, [slides]);

	/* ------------------------------------------
       Slideshow Auto-Advance
    ------------------------------------------ */
	const startAuto = useCallback(() => {
		if (intervalRef.current) clearInterval(intervalRef.current);
		intervalRef.current = window.setInterval(() => {
			setIndex((i) => (i + 1) % slides.length);
		}, autoAdvanceMs);
	}, [slides.length, autoAdvanceMs]);

	const stopAuto = () => {
		if (intervalRef.current) clearInterval(intervalRef.current);
	};

	useEffect(() => {
		startAuto();
		return stopAuto;
	}, [startAuto]);

	/* ------------------------------------------
       Navigation
    ------------------------------------------ */
	const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
	const next = () => setIndex((i) => (i + 1) % slides.length);
	const jump = (i: number) => setIndex(i);

	/* ------------------------------------------
       Swipe (Touch / Mouse drag)
    ------------------------------------------ */
	const onStart = (x: number) => {
		dragStartX.current = x;
		isDragging.current = true;
		stopAuto();
	};

	const onMove = (x: number) => {
		if (!isDragging.current) return;
		const diff = x - dragStartX.current;
		if (Math.abs(diff) > 50) {
			isDragging.current = false;
			diff < 0 ? next() : prev();
			startAuto();
		}
	};

	const onEnd = () => {
		isDragging.current = false;
		startAuto();
	};

	return (
		<div
			className="relative w-screen overflow-hidden"
			onMouseDown={(e) => onStart(e.clientX)}
			onMouseMove={(e) => onMove(e.clientX)}
			onMouseUp={onEnd}
			onTouchStart={(e) => onStart(e.touches[0].clientX)}
			onTouchMove={(e) => onMove(e.touches[0].clientX)}
			onTouchEnd={onEnd}
		>
			<div className="relative w-full h-[65vh] sm:h-[70vh] md:h-[75vh] lg:h-[80vh]">
				{slides.map((slide, i) => (
					<HeroSlide
						key={slide.id}
						image={slide.backdropUrl}
						color={colors[i] || "rgb(0,0,0)"}
						dark={blackFallback[i] || false}
						index={i}
						isActive={i === index}
					>
						{children({ slide, index: i })}
					</HeroSlide>
				))}

				<HeroControls
					total={slides.length}
					current={index}
					onPrev={prev}
					onNext={next}
					onJump={jump}
				/>
			</div>
		</div>
	);
}
