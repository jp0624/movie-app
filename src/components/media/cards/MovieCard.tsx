// src/components/media/MovieCard.tsx
import { Link } from "react-router-dom";
import type { Movie } from "../../types/Movie";
import type { TvShow } from "../../types/Tv";
import { tmdbPoster } from "../../utils/tmdbImage";
import { preload } from "../../hooks/useTmdbPreload";
import { getMovie, getTv } from "../../services/api";

type MediaType = "movie" | "tv";

interface Props {
	item: Movie | TvShow;
	mediaType: MediaType;
	className?: string;
}

export default function MovieCard({ item, mediaType, className = "" }: Props) {
	const id = item.id;
	const title =
		mediaType === "movie"
			? (item as Movie).title
			: (item as TvShow).name || (item as any).original_name || "(Untitled)";

	const posterUrl = item.poster_path
		? tmdbPoster(item.poster_path, "md")
		: "/no-image.png";

	const vote = (item as any).vote_average as number | undefined;

	function handleHover() {
		if (!id) return;
		if (mediaType === "tv") {
			preload(() => getTv(id));
		} else {
			preload(() => getMovie(id));
		}
	}

	return (
		<Link
			to={`/${mediaType}/${id}`}
			onMouseEnter={handleHover}
			className={`block card-shell ${className}`}
		>
			<div className="poster-container">
				<img
					src={posterUrl}
					loading="lazy"
					decoding="async"
					alt={title}
					className="poster-2-3"
				/>
			</div>

			<div className="card-shell-meta">
				{vote != null && vote > 0 && (
					<div className="card-pill">
						<span>★</span>
						<span>{vote.toFixed(1)}</span>
					</div>
				)}
				<p className="line-clamp-2 text-sm font-semibold text-foreground">
					{title}
				</p>
			</div>
		</Link>
	);
}
