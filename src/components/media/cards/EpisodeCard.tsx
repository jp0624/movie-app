// src/components/media/EpisodeCard.tsx
import { memo } from "react";
import { Link } from "react-router-dom";
import type { Episode } from "../../types/Tv";
import { tmdbBackdrop } from "../../utils/tmdbImage";

interface Props {
	showId: number;
	episode: Episode;
	seasonNumber: number;
	className?: string;
}

function EpisodeCard({ showId, episode, seasonNumber, className = "" }: Props) {
	const stillUrl = episode.still_path
		? tmdbBackdrop(episode.still_path, "md")
		: "/no-image.png";

	return (
		<Link
			to={`/tv/${showId}/season/${seasonNumber}/episode/${episode.episode_number}`}
			className={`card-shell ${className}`}
		>
			<div className="still-container">
				<img
					src={stillUrl}
					loading="lazy"
					decoding="async"
					alt={episode.name}
					className="still-16-9"
				/>
			</div>

			<div className="card-shell-meta">
				<span className="card-pill">
					E{episode.episode_number}
					{episode.runtime ? ` • ${episode.runtime} min` : null}
				</span>
				<p className="line-clamp-2 text-sm font-semibold text-foreground">
					{episode.name}
				</p>
				{episode.air_date && (
					<p className="text-[11px] text-muted">{episode.air_date}</p>
				)}
			</div>
		</Link>
	);
}

export default memo(EpisodeCard);
