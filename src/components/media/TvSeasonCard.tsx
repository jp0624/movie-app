// src/components/media/TvSeasonCard.tsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Season } from "../../types/Tv";

interface Props {
	showId: number;
	season: Season;
	index: number;
}

export default function TvSeasonCard({ showId, season, index }: Props) {
	const poster = season.poster_path
		? `https://image.tmdb.org/t/p/w300${season.poster_path}`
		: "/no-image.png";

	const year = season.air_date ? season.air_date.split("-")[0] : "";
	const epCount = season.episode_count ?? 0;

	return (
		<Link to={`/tv/${showId}/season/${season.season_number}`}>
			<motion.div
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.35, delay: index * 0.05 }}
				className="group flex gap-4 rounded-xl border border-token bg-surface-alt p-4 shadow-card hover:border-accent hover:bg-surface transition-colors"
			>
				{/* Poster */}
				<div className="w-20 flex-shrink-0 sm:w-24 rounded-lg overflow-hidden border border-token bg-surface-alt">
					<img
						src={poster}
						alt={season.name}
						className="h-full w-full object-cover"
					/>
				</div>

				{/* Info */}
				<div className="flex flex-col flex-1">
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
							{season.name}
						</h3>

						{year && <span className="text-sm text-muted">{year}</span>}
					</div>

					<p className="text-xs text-muted mt-1">
						{epCount} episode{epCount !== 1 ? "s" : ""}
					</p>

					{season.overview && (
						<p className="mt-2 text-sm text-foreground/90 line-clamp-3">
							{season.overview}
						</p>
					)}
				</div>
			</motion.div>
		</Link>
	);
}
