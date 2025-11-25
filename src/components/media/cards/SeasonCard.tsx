// src/components/media/cards/SeasonCard.tsx
import { Link } from "react-router-dom";
import { preload } from "../../../hooks/useTmdbPreload";
import { getTvSeason } from "../../../services/api";
import { tmdbPoster } from "../../../utils/tmdbImage";

interface Props {
	showId: number;
	season: any;
}

export default function SeasonCard({ showId, season }: Props) {
	const title = season.name ?? `Season ${season.season_number}`;
	const poster = season.poster_path
		? tmdbPoster(season.poster_path, "md")
		: "/no-image.png";

	function onHover() {
		preload(() => getTvSeason(showId, season.season_number));
	}

	return (
		<Link
			to={`/tv/${showId}/season/${season.season_number}`}
			onMouseEnter={onHover}
			className="group relative overflow-hidden rounded-xl border border-token bg-black aspect-[2/3]"
		>
			<img
				src={poster}
				className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] group-hover:brightness-90"
				alt={title}
				loading="lazy"
			/>

			<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

			<div className="absolute bottom-3 left-3 text-white opacity-90 group-hover:opacity-100 transition">
				<h3 className="text-sm font-semibold drop-shadow-md line-clamp-2">
					{title}
				</h3>
			</div>
		</Link>
	);
}
