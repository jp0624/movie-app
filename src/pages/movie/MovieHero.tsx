// src/pages/Movie/MovieHero.tsx
import ParallaxHero, {
	HeroSlide,
} from "../../components/layout/Hero/ParallaxHero";
import { tmdbBackdrop, tmdbPoster } from "../../utils/tmdbImage";

interface Props {
	movie: any;
	images: { backdrops?: any[] };
}

export default function MovieHero({ movie, images }: Props) {
	if (!movie) return null;

	const backdrops = images?.backdrops ?? [];

	const slides: HeroSlide[] =
		backdrops.length > 0
			? backdrops.slice(0, 8).map((b: any) => ({
					id: `movie-bd-${b.file_path}`,
					backdropUrl: tmdbBackdrop(b.file_path, "lg"),
					title: movie.title,
					overview: movie.overview,
					year: movie.release_date?.split("-")[0] ?? "",
					score: movie.vote_average,
					mediaType: "movie",
					posterUrl: movie.poster_path
						? tmdbPoster(movie.poster_path, "md")
						: undefined,
			  }))
			: [
					{
						id: movie.id,
						backdropUrl: tmdbBackdrop(
							movie.backdrop_path || movie.poster_path,
							"lg"
						),
						title: movie.title,
						overview: movie.overview,
						year: movie.release_date?.split("-")[0] ?? "",
						score: movie.vote_average,
						mediaType: "movie",
						posterUrl: movie.poster_path
							? tmdbPoster(movie.poster_path, "md")
							: undefined,
					},
			  ];

	return (
		<ParallaxHero slides={slides} autoAdvanceMs={6000} height="min-h-[60vh]">
			{({ slide, index }) => (
				<div className="flex flex-col gap-6 sm:flex-row sm:gap-10">
					{/* Poster */}
					{slide.posterUrl && (
						<div className="hidden sm:block w-40 md:w-48 overflow-hidden rounded-xl border border-token">
							<img
								src={slide.posterUrl}
								className="w-full h-full object-cover"
								alt={slide.title}
							/>
						</div>
					)}

					{/* Main Text */}
					<div className="flex flex-col gap-3 max-w-3xl">
						<h1 className="text-4xl font-bold text-white drop-shadow-xl">
							{slide.title}
							{slide.year && (
								<span className="ml-2 text-2xl font-light opacity-80">
									({slide.year})
								</span>
							)}
						</h1>

						{slide.overview && (
							<p className="text-white/80 text-sm max-w-2xl leading-relaxed">
								{slide.overview}
							</p>
						)}

						{slide.score != null && (
							<div className="text-yellow-400 text-sm">
								★ {slide.score.toFixed(1)} /10
							</div>
						)}
					</div>
				</div>
			)}
		</ParallaxHero>
	);
}
