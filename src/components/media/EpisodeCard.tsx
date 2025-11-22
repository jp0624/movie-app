// src/components/media/EpisodeCard.tsx
import { Link } from "react-router-dom";
import type { Episode } from "../../types/Tv";

interface Props {
	episode: Episode;
	showId: number;
	seasonNumber: number;
}

export default function EpisodeCard({ episode, showId, seasonNumber }: Props) {
	const still = episode.still_path
		? `https://image.tmdb.org/t/p/w300${episode.still_path}`
		: "/no-image.png";

	return (
		<Link
			to={`/tv/${showId}/season/${seasonNumber}/episode/${episode.episode_number}`}
			className="flex flex-col rounded-xl border border-token bg-surface-alt p-3 text-xs text-foreground hover:-translate-y-1 hover:shadow-card transition-transform"
		>
			<div className="relative mb-2 aspect-video overflow-hidden rounded-lg">
				<img
					src={still}
					alt={episode.name}
					className="h-full w-full object-cover"
				/>
				<div className="absolute left-2 top-2 rounded bg-black/65 px-2 py-0.5 text-[11px] text-white">
					Episode {episode.episode_number}
				</div>
			</div>
			<p className="font-semibold line-clamp-2">{episode.name}</p>
			{episode.air_date && (
				<p className="mt-1 text-[11px] text-muted">{episode.air_date}</p>
			)}
			{episode.overview && (
				<p className="mt-1 line-clamp-3 text-[11px] text-muted">
					{episode.overview}
				</p>
			)}
		</Link>
	);
}
