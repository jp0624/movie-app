// src/components/media/MovieCard.tsx
import { Link } from "react-router-dom";
import { useMovie } from "../../contexts/MovieContext";
import type { Movie } from "../../types/Movie";
import type { TvShow } from "../../types/Tv";

type MediaType = "movie" | "tv";
type MovieLike = Movie | TvShow;

interface Props {
	movie: MovieLike;
	mediaType?: MediaType;
}

export default function MovieCard({ movie, mediaType = "movie" }: Props) {
	const { favorites, toggleFavorite, ratings, setRating } = useMovie();
	const isFav = favorites.includes(movie.id);

	const title = (movie as any).title ?? (movie as any).name ?? "Untitled";
	const rawDate =
		(movie as any).release_date ?? (movie as any).first_air_date ?? "";
	const year = rawDate ? String(rawDate).split("-")[0] : "";
	const rating = ratings[movie.id] ?? "";

	const detailPath =
		mediaType === "tv" ? `/tv/${movie.id}` : `/movie/${movie.id}`;

	const voteAverage = (movie as any).vote_average;
	const score = typeof voteAverage === "number" ? voteAverage.toFixed(1) : "–";

	const poster = (movie as any).poster_path
		? `https://image.tmdb.org/t/p/w500${(movie as any).poster_path}`
		: "/no-image.png";

	return (
		<div className="group bg-surface rounded-xl overflow-hidden shadow-card border border-token transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/40">
			<Link to={detailPath}>
				<div className="relative aspect-[2/3] overflow-hidden">
					<img
						src={poster}
						alt={title}
						className="h-full w-full object-cover transform transition-transform duration-300 group-hover:scale-105"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
				</div>
			</Link>

			<div className="p-3 sm:p-4 space-y-2 text-foreground">
				<div className="flex items-start justify-between gap-2">
					<div className="min-w-0">
						<h3 className="font-semibold text-sm md:text-base line-clamp-2">
							{title}
						</h3>
						{year && (
							<p className="text-xs md:text-sm text-muted mt-0.5">{year}</p>
						)}
					</div>
					<button
						type="button"
						onClick={() => toggleFavorite(movie.id)}
						className={`text-xl md:text-2xl transition-transform ${
							isFav ? "text-red-500 scale-110" : "text-muted hover:text-red-400"
						}`}
						aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
					>
						♥
					</button>
				</div>

				<div className="flex items-center justify-between text-xs md:text-sm text-muted">
					<span className="flex items-center gap-1">
						<span className="text-yellow-400 text-base">★</span>
						<span className="text-foreground">{score}</span>
					</span>

					<select
						value={rating}
						onChange={(e) => setRating(movie.id, Number(e.target.value))}
						className="bg-surface-alt border border-token text-xs px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-accent"
					>
						<option value="">Rate</option>
						{Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
							<option key={n} value={n}>
								{n}
							</option>
						))}
					</select>
				</div>
			</div>
		</div>
	);
}
