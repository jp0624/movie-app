// src/components/media/lists/EpisodeGrid.tsx
import EpisodeCard from "../cards/EpisodeCard";

interface Props {
	showId: number;
	seasonNumber: number;
	episodes: any[];
	className?: string;
}

export default function EpisodeGrid({
	showId,
	seasonNumber,
	episodes,
	className = "",
}: Props) {
	if (!Array.isArray(episodes)) return null;

	return (
		<div className={"grid gap-4 md:grid-cols-2 " + className}>
			{episodes.map((ep) =>
				ep ? (
					<EpisodeCard
						key={ep.id}
						showId={showId}
						seasonNumber={seasonNumber}
						episode={ep}
					/>
				) : null
			)}
		</div>
	);
}
