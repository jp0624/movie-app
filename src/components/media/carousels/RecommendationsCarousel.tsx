// src/components/media/carousels/RecommendationsCarousel.tsx
import CarouselRow from "../../ui/CarouselRow";
import MovieCard from "../cards/MovieCard";
import TvCard from "../cards/TvCard";

interface Props {
	items: any[];
	mediaType: "movie" | "tv";
}

export default function RecommendationsCarousel({ items, mediaType }: Props) {
	if (!Array.isArray(items)) return null;

	return (
		<CarouselRow
			items={items}
			itemWidth={150}
			renderItem={(item) =>
				mediaType === "movie" ? (
					<MovieCard movie={item} />
				) : (
					<TvCard show={item} />
				)
			}
		/>
	);
}
