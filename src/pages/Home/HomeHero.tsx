// src/pages/Home/HomeHero.tsx
import ParallaxHero, {
	HeroSlide,
} from "../../components/layout/Hero/ParallaxHero";

interface Props {
	slides: HeroSlide[];
}

export default function HomeHero({ slides }: Props) {
	if (!slides || slides.length === 0) return null;

	return (
		<ParallaxHero slides={slides} autoAdvanceMs={5000} height="min-h-[60vh]">
			{({ slide }) => (
				<div className="max-w-3xl flex flex-col gap-4">
					<p className="text-xs uppercase tracking-wider text-accent">
						Trending {slide.mediaType === "tv" ? "Series" : "Movies"}
					</p>

					<h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">
						{slide.title}
						{slide.year && (
							<span className="ml-2 font-light text-white/80 text-2xl">
								({slide.year})
							</span>
						)}
					</h1>

					{slide.overview && (
						<p className="text-sm text-white/80 leading-relaxed line-clamp-3">
							{slide.overview}
						</p>
					)}

					{slide.score != null && (
						<div className="text-yellow-400 text-xs">
							★ {slide.score.toFixed(1)} / 10
						</div>
					)}

					{slide.link && (
						<a
							href={slide.link}
							className="mt-4 inline-flex items-center rounded-full bg-accent px-4 py-2 text-white font-semibold hover:bg-accent-soft transition"
						>
							View Details
						</a>
					)}
				</div>
			)}
		</ParallaxHero>
	);
}
