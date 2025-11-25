// src/components/media/lists/SeasonGrid.tsx
import SeasonCard from "../cards/SeasonCard";

interface Props {
	showId: number;
	seasons: any[];
	className?: string;
}

export default function SeasonGrid({ showId, seasons, className = "" }: Props) {
	if (!Array.isArray(seasons)) return null;

	return (
		<div
			className={
				"grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 " + className
			}
		>
			{seasons.map((s) =>
				s ? (
					<SeasonCard
						key={s.id ?? s.season_number}
						showId={showId}
						season={s}
					/>
				) : null
			)}
		</div>
	);
}
