// src/components/media/RecommendationsRow.tsx
import type { Movie } from "../../types/Movie";
import type { TvShow } from "../../types/Tv";
import MovieCard from "./MovieCard";
import CarouselRow from "../ui/CarouselRow";

interface Props {
	items?: (Movie | TvShow)[];
	mediaType?: "movie" | "tv";
}

export default function RecommendationsRow({
	items = [],
	mediaType = "movie",
}: Props) {
	if (!items || !items.length) return null;

	return (
		<CarouselRow>
			{items.map((item) => (
				<div key={item.id} className="w-40 shrink-0">
					<MovieCard movie={item} mediaType={mediaType} />
				</div>
			))}
		</CarouselRow>
	);
}
