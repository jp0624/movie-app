// src/components/media/SeasonCarousel.tsx
import { Link } from "react-router-dom";
import type { Season } from "../../types/Tv";
import CarouselRow from "../ui/CarouselRow";

interface Props {
	seasons?: Season[];
	activeSeason?: number;
	onSeasonChange?: (seasonNumber: number) => void;
	tvId?: number;
}

export default function SeasonCarousel({
	seasons = [],
	activeSeason,
	onSeasonChange,
	tvId,
}: Props) {
	if (!seasons.length) return null;

	return (
		<CarouselRow>
			{seasons.map((s) => {
				const isActive = activeSeason === s.season_number;
				const poster = s.poster_path
					? `https://image.tmdb.org/t/p/w185${s.poster_path}`
					: "/no-image.png";

				const cardClass = `
					flex w-40 shrink-0 flex-col rounded-lg border p-2 text-left text-xs
					transition-transform hover:-translate-y-1
					${isActive ? "border-accent bg-surface-alt" : "border-token bg-surface-alt/80"}
				`;

				const content = (
					<>
						<img
							src={poster}
							alt={s.name}
							className="mb-2 h-40 w-full rounded-md object-cover"
						/>
						<p className="font-semibold line-clamp-2">{s.name}</p>
						{s.episode_count != null && (
							<p className="text-[11px] text-muted">
								{s.episode_count} episodes
							</p>
						)}
						{s.air_date && (
							<p className="mt-1 text-[11px] text-muted">
								Air date: {s.air_date}
							</p>
						)}
					</>
				);

				// If tvId is provided, make cards link to the Season details page
				if (tvId) {
					return (
						<Link
							key={s.id}
							to={`/tv/${tvId}/season/${s.season_number}`}
							className={cardClass}
						>
							{content}
						</Link>
					);
				}

				// Fallback: behave like a selector button (legacy usage)
				return (
					<button
						key={s.id}
						type="button"
						onClick={() => onSeasonChange?.(s.season_number)}
						className={cardClass}
					>
						{content}
					</button>
				);
			})}
		</CarouselRow>
	);
}
